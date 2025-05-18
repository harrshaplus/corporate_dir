import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PersonDetail() {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/people/${id}`);
                setPerson(response.data);
            } catch (err) {
                setError('Failed to fetch person details. Please try again.');
                console.error('Person detail error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerson();
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <div className="text-center mt-8">
                    <div className="spinner"></div>
                    <p>Loading person details...</p>
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

    if (!person) {
        return (
            <div className="container">
                <div className="text-center mt-8">
                    <p>Person not found</p>
                    <Link to="/" className="btn btn-primary mt-4">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="mt-8">
                <div className="card">
                    <h1 className="text-4xl font-bold mb-4">{person.name}</h1>
                    <p className="text-gray-600 mb-4">{person.designation}</p>
                    <p className="mb-6">{person.bio}</p>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                        <p><strong>Email:</strong> {person.contactInfo.email}</p>
                        <p><strong>Phone:</strong> {person.contactInfo.phone}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
                        <p><strong>Company:</strong> {person.companyName}</p>
                        <p><strong>Department:</strong> {person.department}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Address</h2>
                        <p>{person.address.street}</p>
                        <p>{person.address.city}, {person.address.state} {person.address.zipCode}</p>
                        <p>{person.address.country}</p>
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

export default PersonDetail; 