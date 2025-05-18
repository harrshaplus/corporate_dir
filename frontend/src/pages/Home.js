import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalCompanies: 0,
        totalPeople: 0,
        activeCompanies: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [companiesRes, peopleRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/companies'),
                    axios.get('http://localhost:5000/api/people')
                ]);

                setStats({
                    totalCompanies: companiesRes.data.length,
                    totalPeople: peopleRes.data.length,
                    activeCompanies: companiesRes.data.length // For now, all companies are considered active
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="container">
            <div className="text-center mt-8">
                <h1 className="text-4xl font-bold mb-4">Corporate Directory</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Search for companies and people in our comprehensive corporate database.
                </p>
            </div>

            <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                        placeholder="Search for companies or people..."
                    />
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                </form>
            </div>

            <div className="card-grid">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Total Companies</h3>
                    {loading ? (
                        <div className="spinner"></div>
                    ) : error ? (
                        <p className="text-red-600">Error loading data</p>
                    ) : (
                        <Link to="/search?query=&type=companies" className="text-2xl text-blue-600 hover:text-blue-800 hover:underline">
                            {stats.totalCompanies}
                        </Link>
                    )}
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Total People</h3>
                    {loading ? (
                        <div className="spinner"></div>
                    ) : error ? (
                        <p className="text-red-600">Error loading data</p>
                    ) : (
                        <Link to="/search?query=&type=people" className="text-2xl text-blue-600 hover:text-blue-800 hover:underline">
                            {stats.totalPeople}
                        </Link>
                    )}
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Active Companies</h3>
                    {loading ? (
                        <div className="spinner"></div>
                    ) : error ? (
                        <p className="text-red-600">Error loading data</p>
                    ) : (
                        <Link to="/search?query=&type=companies" className="text-2xl text-blue-600 hover:text-blue-800 hover:underline">
                            {stats.activeCompanies}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home; 