import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Import from './pages/Import';
import CompanyDetail from './pages/CompanyDetail';
import PersonDetail from './pages/PersonDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDetails from './pages/CompanyDetails';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/import"
                            element={
                                <ProtectedRoute>
                                    <Import />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/company/:id" element={<CompanyDetail />} />
                        <Route path="/person/:id" element={<PersonDetail />} />
                        <Route path="/companies/:id" element={<CompanyDetails />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}

export default App; 