import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || 'companies';
    const [activeTab, setActiveTab] = useState(type);
    const [results, setResults] = useState({ companies: [], people: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('Fetching results for query:', query);
                const [companiesRes, peopleRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/companies/search?query=${query}`),
                    axios.get(`http://localhost:5000/api/people/search?query=${query}`)
                ]);
                
                console.log('Companies response:', companiesRes.data);
                console.log('People response:', peopleRes.data);

                // Ensure we're setting arrays for both companies and people
                const companies = Array.isArray(companiesRes.data) ? companiesRes.data : [];
                const people = Array.isArray(peopleRes.data) ? peopleRes.data : [];

                console.log('Processed companies:', companies);
                console.log('Processed people:', people);

                setResults({
                    companies,
                    people
                });
            } catch (err) {
                console.error('Search error details:', err.response || err);
                setError('Failed to fetch search results. Please try again.');
                setResults({ companies: [], people: [] });
            }
            setLoading(false);
        };

        fetchResults();
    }, [query]);

    const renderCompanyCard = (company) => (
        <div key={company._id} className="card">
            <Link to={`/companies/${company._id}`} className="block">
                <h3 className="font-semibold">{company.name}</h3>
                <p className="text-gray-600">{company.industry}</p>
                {company.description && (
                    <p className="text-gray-500 mt-2">{company.description}</p>
                )}
            </Link>
        </div>
    );

    const renderPersonCard = (person) => (
        <div className="card" key={person._id}>
            <h3 className="text-lg font-semibold mb-2">{person.name}</h3>
            <p className="text-gray-600 mb-2">{person.designation} at {person.company?.name || person.companyName}</p>
            <p className="text-sm text-gray-500 mb-4">{person.department}</p>
            <div className="text-sm">
                <p><strong>Contact:</strong> {person.contactInfo?.email}</p>
                <p><strong>Phone:</strong> {person.contactInfo?.phone}</p>
            </div>
            <Link to={`/people/${person._id}`} className="btn btn-primary mt-4">
                View Details
            </Link>
        </div>
    );

    return (
        <div className="container">
            <div className="mt-8">
                <div className="flex space-x-4 mb-6">
                    <button
                        className={`btn ${activeTab === 'companies' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('companies')}
                    >
                        Companies ({results.companies.length})
                    </button>
                    <button
                        className={`btn ${activeTab === 'people' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('people')}
                    >
                        People ({results.people.length})
                    </button>
                </div>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner"></div>
                        <p>Loading results...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {activeTab === 'companies'
                            ? results.companies.map(renderCompanyCard)
                            : results.people.map(renderPersonCard)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search; 