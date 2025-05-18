import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="text-xl font-bold">Corporate Directory</Link>
                
                <div className="nav-links">
                    <Link to="/search" className="btn btn-primary">
                        Search
                    </Link>
                    {user ? (
                        <>
                            <Link to="/import" className="btn btn-secondary">
                                Import Data
                            </Link>
                            <div className="user-menu">
                                <span className="user-name">{user.name}</span>
                                <button onClick={logout} className="btn btn-secondary">
                                    Sign out
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-secondary">
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar; 