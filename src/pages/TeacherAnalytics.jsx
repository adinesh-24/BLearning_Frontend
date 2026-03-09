import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const TeacherAnalytics = () => {
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

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading Analytics...</p>
        </div>
    );

    if (!stats) return <div className="container mt-5">No analytics data available.</div>;

    const barData = {
        labels: stats.barChart.labels,
        datasets: [
            {
                label: 'Articles Count',
                data: stats.barChart.articlesCount,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Views Count',
                data: stats.barChart.viewsCount,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ]
    };

    const pieData = {
        labels: stats.pieChart.labels,
        datasets: [{
            label: 'Categories',
            data: stats.pieChart.data,
            backgroundColor: [
                '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'
            ],
            hoverOffset: 10
        }]
    };

    const lineData = {
        labels: stats.lineChart.labels,
        datasets: [{
            label: 'Daily Engagement (Views)',
            data: stats.lineChart.data,
            fill: true,
            backgroundColor: 'rgba(78, 115, 223, 0.05)',
            borderColor: 'rgba(78, 115, 223, 1)',
            pointRadius: 3,
            pointBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointBorderColor: 'rgba(78, 115, 223, 1)',
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
            pointHitRadius: 10,
            pointBorderWidth: 2,
            tension: 0.4
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    return (
        <div className="page-wrapper" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
            <div className="container py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Analytics Overview</h2>
                        <p className="text-muted mb-0">Track your performance and student engagement</p>
                    </div>
                    <div className="d-flex gap-3">
                        <div className="card border-0 shadow-sm px-3 py-2 bg-white rounded-3">
                            <small className="text-muted d-block font-weight-bold">Total Articles</small>
                            <span className="h5 mb-0 fw-bold text-primary">{stats.totalArticles}</span>
                        </div>
                        <div className="card border-0 shadow-sm px-3 py-2 bg-white rounded-3">
                            <small className="text-muted d-block font-weight-bold">Total Views</small>
                            <span className="h5 mb-0 fw-bold text-success">{stats.totalViews}</span>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Line Chart - Full width top */}
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                                <h5 className="mb-0 fw-bold text-dark">Daily Engagement Trends</h5>
                                <p className="text-muted small">Views over the last 7 days</p>
                            </div>
                            <div className="card-body px-4 pb-4" style={{ height: '350px' }}>
                                <Line data={lineData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                                <h5 className="mb-0 fw-bold text-dark">Category Impact</h5>
                                <p className="text-muted small">Articles count vs Total views</p>
                            </div>
                            <div className="card-body px-4 pb-4" style={{ height: '400px' }}>
                                <Bar data={barData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                                <h5 className="mb-0 fw-bold text-dark">Content Distribution</h5>
                                <p className="text-muted small">Article volume by category</p>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center p-4" style={{ height: '400px' }}>
                                <div style={{ width: '100%', height: '100%' }}>
                                    <Pie data={pieData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherAnalytics;
