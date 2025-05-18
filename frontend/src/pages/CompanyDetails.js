import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CompanyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [people, setPeople] = useState([]);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/companies/${id}`);
                setCompany(response.data);
                
                // Fetch people associated with this company
                const peopleResponse = await axios.get(`http://localhost:5000/api/people/search?company=${response.data.name}`);
                setPeople(peopleResponse.data);
            } catch (err) {
                setError('Failed to load company details');
                console.error('Error fetching company details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="card">
                    <div className="text-red-600">{error}</div>
                    <button 
                        className="btn btn-secondary mt-4"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="container">
                <div className="card">
                    <div>Company not found</div>
                    <button 
                        className="btn btn-secondary mt-4"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="mt-8">
                <button 
                    className="btn btn-secondary mb-4"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <div className="card">
                    <h1 className="text-2xl font-bold mb-6">{company.name}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-600">Industry</label>
                                    <p className="font-semibold">{company.industry}</p>
                                </div>

                                {company.description && (
                                    <div>
                                        <label className="text-gray-600">Description</label>
                                        <p>{company.description}</p>
                                    </div>
                                )}

                                {company.foundedYear && (
                                    <div>
                                        <label className="text-gray-600">Founded</label>
                                        <p>{company.foundedYear}</p>
                                    </div>
                                )}

                                {company.employeeCount && (
                                    <div>
                                        <label className="text-gray-600">Employees</label>
                                        <p>{company.employeeCount}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                            
                            <div className="space-y-4">
                                {company.contactInfo?.email && (
                                    <div>
                                        <label className="text-gray-600">Email</label>
                                        <p>{company.contactInfo.email}</p>
                                    </div>
                                )}

                                {company.contactInfo?.phone && (
                                    <div>
                                        <label className="text-gray-600">Phone</label>
                                        <p>{company.contactInfo.phone}</p>
                                    </div>
                                )}

                                {company.contactInfo?.website && (
                                    <div>
                                        <label className="text-gray-600">Website</label>
                                        <p>
                                            <a 
                                                href={company.contactInfo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {company.contactInfo.website}
                                            </a>
                                        </p>
                                    </div>
                                )}

                                {company.address && (
                                    <div>
                                        <label className="text-gray-600">Address</label>
                                        <p>
                                            {company.address.street && <>{company.address.street}<br /></>}
                                            {company.address.city && <>{company.address.city}, </>}
                                            {company.address.state && <>{company.address.state} </>}
                                            {company.address.zipCode && <>{company.address.zipCode}<br /></>}
                                            {company.address.country}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {people.length > 0 && (
                    <div className="card mt-8">
                        <h2 className="text-xl font-semibold mb-4">People at {company.name}</h2>
                        <div className="card-grid">
                            {people.map(person => (
                                <div key={person._id} className="card">
                                    <h3 className="font-semibold">{person.name}</h3>
                                    <p className="text-gray-600">{person.designation}</p>
                                    {person.department && (
                                        <p className="text-gray-500">{person.department}</p>
                                    )}
                                    {person.contactInfo?.email && (
                                        <p className="mt-2">
                                            <a 
                                                href={`mailto:${person.contactInfo.email}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {person.contactInfo.email}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompanyDetails; 