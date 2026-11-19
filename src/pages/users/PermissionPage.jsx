import React, { useEffect, useState, useContext } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/service/api';
import { GlobleContext } from '@/globleContext/GlobleContext';
import { useNavigate, useParams } from 'react-router-dom';

const PermissionPage = () => {
    const { isDarkMode } = useContext(GlobleContext);
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [permissions, setPermissions] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allPermsRes, userPermsRes] = await Promise.all([
                api.get('permissions'),
                api.get(`users/${id}/permissions`)
            ]);
            setPermissions(allPermsRes.data);
            setUserPermissions(userPermsRes.data.permissions || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (permId) => {
        setUserPermissions(prev => 
            prev.includes(permId) 
                ? prev.filter(pid => pid !== permId)
                : [...prev, permId]
        );
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.post(`users/${id}/permissions`, { permissions: userPermissions });
            navigate('/user');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/user');
    };

    // Grouping permissions by module (first part of slug)
    const grouped = permissions.reduce((acc, perm) => {
        const [module, action] = perm.slug.split('.');
        if (!acc[module]) acc[module] = [];
        acc[module].push({ ...perm, action });
        return acc;
    }, {});

    const displayGroups = [
        { label: 'MAIN', modules: ['dashboard'] },
        { label: 'BOOK MANAGEMENT', modules: ['books', 'book_copies', 'category', 'authors', 'publishers', 'author_books'] },
        { label: 'TRANSACTION', modules: ['loans_return', 'loans', 'loans_detail', 'book_return'] },
        { label: 'PEOPLE', modules: ['users', 'member'] },
        { label: 'FINES', modules: ['fines', 'fine_payments'] },
    ];

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className={`w-full h-full flex flex-col rounded-sm shadow-sm border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
            {/* Header Actions */}
            <div className={`flex justify-between items-center p-4 bg-blue-500 rounded-t-sm text-white`}>
                <button onClick={handleCancel} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded flex items-center gap-2 cursor-pointer transition-colors">
                    &larr; Back
                </button>
                <div className="flex gap-2">
                    <button onClick={handleCancel} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded cursor-pointer transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-slate-100 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save User
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
                {loading && permissions.length === 0 ? (
                    <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
                ) : (
                    <div className="space-y-6">
                        {displayGroups.map((group) => {
                            const groupModules = group.modules.filter(m => grouped[m]);
                            if (groupModules.length === 0) return null;

                            return (
                                <div key={group.label} className={`border rounded-lg p-4 shadow-sm ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
                                    <h3 className="font-bold mb-4 text-sm text-slate-500">{group.label}</h3>
                                    <div className="space-y-4">
                                        {groupModules.map(module => {
                                            const perms = grouped[module];
                                            const allSelected = perms.every(p => userPermissions.includes(p.id));
                                            
                                            const handleSelectAll = () => {
                                                if (allSelected) {
                                                    const idsToRemove = perms.map(p => p.id);
                                                    setUserPermissions(prev => prev.filter(id => !idsToRemove.includes(id)));
                                                } else {
                                                    const idsToAdd = perms.map(p => p.id).filter(id => !userPermissions.includes(id));
                                                    setUserPermissions(prev => [...prev, ...idsToAdd]);
                                                }
                                            };

                                            return (
                                                <div key={module} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0 border-slate-200 dark:border-slate-700/50">
                                                    <div className="flex items-center gap-2 w-48 mb-2 sm:mb-0">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{module.split('_').map(word => capitalize(word)).join(' ')}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 items-center justify-end flex-1">
                                                        {['view', 'create', 'edit', 'delete'].map(action => {
                                                            const perm = perms.find(p => p.action === action);
                                                            if (!perm) return null;
                                                            
                                                            const isChecked = userPermissions.includes(perm.id);
                                                            
                                                            return (
                                                                <label key={perm.id} className="flex items-center gap-2 cursor-pointer group">
                                                                    <div className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${isChecked ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                                                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${isChecked ? 'translate-x-5' : ''}`}></div>
                                                                    </div>
                                                                    <input 
                                                                        type="checkbox" 
                                                                        className="hidden" 
                                                                        checked={isChecked}
                                                                        onChange={() => handleToggle(perm.id)}
                                                                    />
                                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{capitalize(action)}</span>
                                                                </label>
                                                            );
                                                        })}
                                                        
                                                        <label className="flex items-center gap-2 cursor-pointer ml-4 border-l pl-4 border-slate-200 dark:border-slate-700 group">
                                                            <div className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${allSelected ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                                                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${allSelected ? 'translate-x-5' : ''}`}></div>
                                                            </div>
                                                            <input 
                                                                type="checkbox" 
                                                                className="hidden" 
                                                                checked={allSelected}
                                                                onChange={handleSelectAll}
                                                            />
                                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Select All</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PermissionPage;
