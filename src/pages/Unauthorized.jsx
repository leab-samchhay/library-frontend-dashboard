import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import { logoutUser } from '@/service/auth';
import { ShieldAlert, LogOut } from 'lucide-react';

const Unauthorized = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(logout());
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-zinc-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                    <ShieldAlert size={36} />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 mb-2">
                    គ្មានសិទ្ធិចូលប្រើប្រាស់
                </h1>
                
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
                    សួស្តី <span className="font-semibold text-slate-700 dark:text-zinc-300">{user?.name || "អ្នកប្រើប្រាស់"}</span>, 
                    គណនីរបស់អ្នកមិនទាន់ត្រូវបានកំណត់សិទ្ធិឲ្យចូលមើលផ្ទាំង ឬទិន្នន័យណាមួយនៅក្នុងប្រព័ន្ធនៅឡើយទេ។ សូមទាក់ទង Administrator ដើម្បីស្នើសុំសិទ្ធិ។
                </p>

                <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-4 mb-6 text-left text-xs space-y-1">
                    <div><span className="text-slate-400">Email:</span> <span className="font-medium text-slate-700 dark:text-zinc-300">{user?.email}</span></div>
                    <div><span className="text-slate-400">Status:</span> <span className="text-amber-600 font-medium">Pending Permission Assignment</span></div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
                >
                    <LogOut size={18} />
                    <span>ចាកចេញ (Logout)</span>
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
