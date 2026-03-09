import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const StudentHome = () => {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const categories = ['Tamil', 'English', 'Maths', 'Science', 'Social Science'];

    useEffect(() => {
        fetchArticles();
    }, [category]); // Fetch on category change

    const fetchArticles = async () => {
        try {
            const res = await api.get(`/articles?category=${category}&search=${search}`);
            setArticles(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchArticles();
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 fw-bold">Explore Articles</h1>

            <div className="row g-3 mb-5">
                <div className="col-md-8">
                    <form onSubmit={handleSearch} className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control form-control-lg shadow-sm"
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary btn-lg shadow-sm px-4">Search</button>
                    </form>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select form-select-lg shadow-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Loading articles...</div>
            ) : (
                <div className="row g-4">
                    {articles.length > 0 ? articles.map(article => (
                        <div key={article._id} className="col-md-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <span className="badge bg-soft-primary text-primary mb-2" style={{ backgroundColor: '#e7f1ff' }}>{article.category}</span>
                                    <h5 className="card-title fw-bold mb-3">{article.title}</h5>
                                    <p className="card-text text-muted small">By {article.createdBy?.name || 'Unknown'}</p>
                                    <Link to={`/article/${article._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3 mt-2">Read More</Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center py-5">
                            <h3 className="text-muted">No articles found matching your criteria.</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentHome;
