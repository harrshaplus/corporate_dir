import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Import() {
    const [file, setFile] = useState(null);
    const [importType, setImportType] = useState('companies');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = useAuth();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
            setSuccess('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(
                `http://localhost:5000/api/${importType}/import`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSuccess(`Successfully imported ${response.data.count} ${importType}`);
            setFile(null);
            // Reset file input
            e.target.reset();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to import data. Please try again.');
            console.error('Import error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="mt-8">
                <div className="card">
                    <h1 className="text-2xl font-bold mb-6">Import Data</h1>

                    {error && (
                        <div className="text-red-600 mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-green-600 mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="block mb-2">Import Type</label>
                            <select
                                value={importType}
                                onChange={(e) => setImportType(e.target.value)}
                                className="form-control"
                            >
                                <option value="companies">Companies</option>
                                <option value="people">People</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="block mb-2">File (CSV or JSON)</label>
                            <input
                                type="file"
                                accept=".csv,.json"
                                onChange={handleFileChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Importing...' : 'Import Data'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Import; 