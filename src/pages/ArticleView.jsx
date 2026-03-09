import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const ArticleView = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeSpent, setTimeSpent] = useState(0);
    const [selection, setSelection] = useState('');
    const startTimeRef = useRef(Date.now());
    const timerRef = useRef(null);

    useEffect(() => {
        fetchArticle();
        startTimeRef.current = Date.now();

        timerRef.current = setInterval(() => {
            setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
            const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (duration > 0) {
                api.post('/tracking', { articleId: id, duration }).catch(err => {
                    console.error('Failed to save tracking data', err);
                });
            }
        };
    }, [id]);

    const fetchArticle = async () => {
        try {
            const res = await api.get(`/articles/${id}`);
            setArticle(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to load article');
        }
    };

    const handleTextSelection = () => {
        const text = window.getSelection().toString().trim();
        if (text) setSelection(text);
    };

    const saveHighlight = async () => {
        if (!selection) return;
        try {
            await api.post('/student/highlights', { articleId: id, text: selection });
            toast.success('Highlight saved to your library');
            setSelection('');
        } catch (err) {
            toast.error('Failed to save highlight');
        }
    };

    if (loading) return <div className="container mt-5">Loading article...</div>;
    if (!article) return <div className="container mt-5">Article not found.</div>;

    return (
        <div className="container mt-5 mb-5" onMouseUp={handleTextSelection}>
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><small className="text-uppercase fw-bold text-muted">{article.category}</small></li>
                            <li className="breadcrumb-item active" aria-current="page">{article.title}</li>
                        </ol>
                    </nav>

                    <h1 className="fw-bold mb-3">{article.title}</h1>
                    <p className="text-muted mb-5">Author: {article.createdBy?.name} | Published on: {new Date(article.createdAt).toLocaleDateString()}</p>

                    <div className="article-content shadow-sm p-4 bg-white rounded mb-5 position-relative">
                        {article.contentBlocks.map((block, index) => (
                            <div key={index} className="mb-4">
                                {block.type === 'text' && <p>{block.value}</p>}
                                {block.type === 'image' && <img src={block.value} alt="Content" className="img-fluid rounded shadow-sm w-100" />}
                                {block.type === 'video' && (
                                    <div className="ratio ratio-16x9">
                                        <iframe src={block.value} title="Content Video" allowFullScreen></iframe>
                                    </div>
                                )}
                            </div>
                        ))}

                        {selection && (
                            <div className="highlight-popup shadow-lg p-3 rounded bg-white border position-fixed" style={{ bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                                <p className="mb-2 small fw-bold">Add to my highlights:</p>
                                <p className="mb-3 font-italic small">"{selection}"</p>
                                <button className="btn btn-primary btn-sm px-4" onClick={saveHighlight}>Save Selection</button>
                                <button className="btn btn-link btn-sm text-secondary ms-2" onClick={() => setSelection('')}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center text-muted small fixed-bottom bg-white p-2 border-top shadow-sm">
                Timer: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s spent reading
            </div>
        </div>
    );
};

export default ArticleView;
