import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CompanyDetail() {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/companies/${id}`);
                setCompany(response.data);
            } catch (err) {
                setError('Failed to fetch company details. Please try again.');
                console.error('Company detail error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <div className="text-center mt-8">
                    <div className="spinner"></div>
                    <p>Loading company details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="text-center mt-8">
                    <p className="text-red-600">{error}</p>
                    <Link to="/" className="btn btn-primary mt-4">Back to Home</Link>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="container">
                <div className="text-center mt-8">
                    <p>Company not found</p>
                    <Link to="/" className="btn btn-primary mt-4">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="mt-8">
                <div className="card">
                    <h1 className="text-4xl font-bold mb-4">{company.name}</h1>
                    <p className="text-gray-600 mb-4">{company.industry}</p>
                    <p className="mb-6">{company.description}</p>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                        <p><strong>Email:</strong> {company.contactInfo.email}</p>
                        <p><strong>Phone:</strong> {company.contactInfo.phone}</p>
                        <p><strong>Website:</strong> <a href={company.contactInfo.website} target="_blank" rel="noopener noreferrer">{company.contactInfo.website}</a></p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Address</h2>
                        <p>{company.address.street}</p>
                        <p>{company.address.city}, {company.address.state} {company.address.zipCode}</p>
                        <p>{company.address.country}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
                        <p><strong>Founded:</strong> {company.foundedYear}</p>
                        <p><strong>Employee Count:</strong> {company.employeeCount}</p>
                    </div>

                    <div className="flex space-x-4">
                        <Link to="/" className="btn btn-secondary">Back to Home</Link>
                        <Link to="/search" className="btn btn-primary">Search More</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDetail; 