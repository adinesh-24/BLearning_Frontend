import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const CreateArticle = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Tamil');
    const [contentBlocks, setContentBlocks] = useState([{ type: 'text', value: '' }]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const navigate = useNavigate();

    const categories = ['Tamil', 'English', 'Maths', 'Science', 'Social Science'];

    useEffect(() => {
        if (isEditMode) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            const res = await api.get(`/articles/${id}`);
            const { title, category, contentBlocks } = res.data;
            setTitle(title);
            setCategory(category);
            setContentBlocks(contentBlocks);
            setFetching(false);
        } catch (err) {
            toast.error('Failed to fetch article data');
            setFetching(false);
            navigate('/teacher/dashboard');
        }
    };

    const addBlock = (type) => {
        setContentBlocks([...contentBlocks, { type, value: '' }]);
    };

    const removeBlock = (index) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    };

    const handleBlockChange = (index, value) => {
        const newBlocks = [...contentBlocks];
        newBlocks[index].value = value;
        setContentBlocks(newBlocks);
    };

    const handleFileUpload = async (index, file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/articles/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleBlockChange(index, res.data.url);
            toast.success('File uploaded successfully');
        } catch (err) {
            toast.error('Upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await api.put(`/articles/${id}`, { title, category, contentBlocks });
                toast.success('Article updated successfully!');
            } else {
                await api.post('/articles', { title, category, contentBlocks });
                toast.success('Article created successfully!');
            }
            navigate('/teacher/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} article`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="container mt-5">Loading article data...</div>;

    return (
        <div className="container mt-5 pb-5">
            <h1 className="mb-4 fw-bold">{isEditMode ? 'Edit Article' : 'Create New Article'}</h1>
            <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-md-8">
                    <div className="card shadow-sm p-4 mb-4">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Title</label>
                            <input type="text" className="form-control form-control-lg" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter title..." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Category</label>
                            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="card shadow-sm p-4">
                        <h5 className="fw-bold mb-4">Content Blocks</h5>
                        {contentBlocks.map((block, index) => (
                            <div key={index} className="mb-4 p-3 border rounded position-relative">
                                <button type="button" className="btn-close position-absolute top-0 end-0 m-2" onClick={() => removeBlock(index)}></button>
                                <label className="form-label text-uppercase small fw-bold text-muted">{block.type}</label>

                                {block.type === 'text' ? (
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={block.value}
                                        onChange={(e) => handleBlockChange(index, e.target.value)}
                                        placeholder="Write your content here..."
                                    ></textarea>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Paste ${block.type} URL or upload below`}
                                            value={block.value}
                                            onChange={(e) => handleBlockChange(index, e.target.value)}
                                        />
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => addBlock('text')}>+ Text Block</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => addBlock('image')}>+ Image Block</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => addBlock('video')}>+ Video Block</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="fw-bold mb-4">{isEditMode ? 'Update' : 'Publishing'}</h5>
                        <p className="text-muted small">
                            {isEditMode
                                ? 'Changes will be visible to students immediately after updating.'
                                : 'Articles are visible to students immediately after publishing.'}
                        </p>
                        <button type="submit" className="btn btn-primary w-100 btn-lg mt-3" disabled={loading}>
                            {loading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Article' : 'Publish Article')}
                        </button>
                        {isEditMode && (
                            <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate('/teacher/dashboard')}>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateArticle;
