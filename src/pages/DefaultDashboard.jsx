import React from 'react';
import { useSelector } from 'react-redux';

const DefaultDashboard = () => {
    const { user } = useSelector(state => state.auth);

    return (
        <div className="w-full h-full min-h-[75vh] flex items-center justify-center bg-white dark:bg-zinc-900">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 dark:text-gray-200 tracking-wide text-center">
                Welcome ( {user?.name || "User"} )
            </h1>
        </div>
    );
};

export default DefaultDashboard;
