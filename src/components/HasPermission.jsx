import React from 'react';
import { useSelector } from 'react-redux';

const HasPermission = ({ permission, children }) => {
    const { user } = useSelector(state => state.auth);

    if (!user || !user.permissions || !user.permissions.includes(permission)) {
        return null;
    }
    return <>{children}</>;
};

export default HasPermission;
