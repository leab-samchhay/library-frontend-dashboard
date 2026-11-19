import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ permission, children }) => {
    const { user, token } = useSelector(state => state.auth);
    
    if (!token) return <Navigate to="/login" replace />;
    
    if (permission && (!user || !user.permissions || !user.permissions.includes(permission))) {
        return <Navigate to="/home" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
