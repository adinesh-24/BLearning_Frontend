import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TeacherDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, articlesRes] = await Promise.all([
                api.get('/analytics'),
                api.get(`/articles?teacherId=${user.id}`)
            ]);
            setStats(statsRes.data);
            setArticles(articlesRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            await api.delete(`/articles/${id}`);
            toast.success('Article deleted successfully');
            setArticles(articles.filter(a => a._id !== id));
            // Optionally refresh stats if deletion affects them
            const statsRes = await api.get('/analytics');
            setStats(statsRes.data);
        } catch (err) {
            toast.error('Failed to delete article');
        }
    };

    if (loading) return <div className="container mt-5">Loading Dashboard...</div>;
    if (!stats) return <div className="container mt-5">No analytics data available.</div>;

    const barData = {
        labels: stats.barChart.labels,
        datasets: [
            {
                label: 'Articles',
                data: stats.barChart.articlesCount,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Views',
                data: stats.barChart.viewsCount,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
        ]
    };

    const pieData = {
        labels: stats.pieChart.labels,
        datasets: [{
            data: stats.pieChart.data,
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
        }]
    };

    return (
        <div className="container mt-5 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold mb-0">Teacher Dashboard</h1>
                <Link to="/teacher/create-article" className="btn btn-primary shadow-sm px-4 rounded-pill">
                    + Create New Article
                </Link>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card text-center bg-primary text-white p-4 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title opacity-75 text-uppercase small fw-bold">Total Articles</h5>
                            <h1 className="display-4 fw-bold mb-0">{stats.totalArticles}</h1>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card text-center bg-success text-white p-4 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title opacity-75 text-uppercase small fw-bold">Total Views</h5>
                            <h1 className="display-4 fw-bold mb-0">{stats.totalViews}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-8">
                    <div className="chart-container shadow-sm p-4 bg-white rounded-4 h-100">
                        <h4 className="mb-4 fw-bold text-dark">Category Impact</h4>
                        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="chart-container shadow-sm p-4 bg-white rounded-4 h-100">
                        <h4 className="mb-4 fw-bold text-dark">Content Hub</h4>
                        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
                    </div>
                </div>
            </div>

            <section className="mt-5">
                <h2 className="fw-bold mb-4">Manage Your Articles</h2>
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="py-3">Category</th>
                                    <th className="py-3">Created At</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.length > 0 ? articles.map(article => (
                                    <tr key={article._id}>
                                        <td className="px-4 fw-bold">{article.title}</td>
                                        <td>
                                            <span className="badge bg-soft-primary text-primary" style={{ backgroundColor: '#e7f1ff' }}>{article.category}</span>
                                        </td>
                                        <td className="text-muted small">
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 text-end">
                                            <Link to={`/teacher/edit-article/${article._id}`} className="btn btn-outline-primary btn-sm me-2 rounded-pill px-3">
                                                Edit
                                            </Link>
                                            <button
                                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                                onClick={() => handleDelete(article._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">
                                            You haven't created any articles yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TeacherDashboard;
