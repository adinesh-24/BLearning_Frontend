import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const StudentDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/analytics');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="container mt-5">Loading Dashboard...</div>;
    if (!stats) return <div className="container mt-5">No personal stats available.</div>;

    const COLORS = ['#4a90e2', '#ff6b6b', '#1dd1a1', '#feca57', '#5f27cd', '#2bcbba', '#eb3b5a'];

    const timePieData = {
        labels: Object.keys(stats.categoryTime),
        datasets: [{
            data: Object.values(stats.categoryTime),
            backgroundColor: COLORS,
            hoverOffset: 10,
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };

    const articlesPieData = {
        labels: Object.keys(stats.categoryArticles),
        datasets: [{
            data: Object.values(stats.categoryArticles),
            backgroundColor: COLORS,
            hoverOffset: 10,
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };

    return (
        <div className="container mt-5 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold text-dark m-0">Learning Analytics</h1>
                <span className="badge bg-primary px-3 py-2 rounded-pill">Student Portal</span>
            </div>

            {/* Summary Stats */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-0 rounded-4 bg-gradient-primary">
                        <div className="card-body p-4 text-center">
                            <p className="text-muted small text-uppercase fw-bold mb-2">Total Articles Read</p>
                            <h2 className="display-4 fw-bold mb-0 text-primary">{stats.readArticles}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-body p-4 text-center">
                            <p className="text-muted small text-uppercase fw-bold mb-2">Saved Highlights</p>
                            <h2 className="display-4 fw-bold mb-0 text-danger">{stats.highlights.length}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-5">
                {/* Reading Time Chart */}
                <div className="col-lg-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
                        <h5 className="fw-bold mb-4 text-center">Reading Time Distribution (sec)</h5>
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div style={{ position: 'relative', height: '220px' }}>
                                    <Pie data={timePieData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mt-3 mt-md-0 ps-md-3">
                                    {Object.entries(stats.categoryTime).map(([cat, time], idx) => (
                                        <div key={cat} className="d-flex align-items-center mb-2">
                                            <div className="rounded-circle me-2" style={{ width: '10px', height: '10px', backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            <div className="flex-grow-1 small fw-semibold text-muted">{cat}</div>
                                            <div className="small fw-bold">{time}s</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Articles Count Chart */}
                <div className="col-lg-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
                        <h5 className="fw-bold mb-4 text-center">Articles Read per Category</h5>
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div style={{ position: 'relative', height: '220px' }}>
                                    <Pie data={articlesPieData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mt-3 mt-md-0 ps-md-3">
                                    {Object.entries(stats.categoryArticles).map(([cat, count], idx) => (
                                        <div key={cat} className="d-flex align-items-center mb-2">
                                            <div className="rounded-circle me-2" style={{ width: '10px', height: '10px', backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            <div className="flex-grow-1 small fw-semibold text-muted">{cat}</div>
                                            <div className="small fw-bold">{count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h5 className="fw-bold mb-4">Saved Highlights & Notes</h5>
                        {stats.highlights.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {stats.highlights.map(h => (
                                    <div key={h._id} className="list-group-item border-0 ps-0 mb-3">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h6 className="mb-1 text-primary">{h.articleId?.title || 'Unknown Article'}</h6>
                                        </div>
                                        <p className="mb-1 bg-light p-2 rounded small" style={{ borderLeft: '4px solid #ff6b6b' }}>
                                            "{h.text}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">You haven't highlighted anything yet. Go read some articles!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
