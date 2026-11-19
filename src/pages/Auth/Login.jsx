import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/service/auth';
import { loginSuccess } from '@/store/authSlice';
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from '@base-ui/react/button';
import { Spinner } from '@/components/ui/spinner';
import { toast, Toaster } from "@/components/ui/toast";
import { GlobleContext } from '@/globleContext/GlobleContext';
import { getFirstAllowedPath } from '@/lib/permissions';

const Login = () => {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('123');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token, user } = useSelector(state => state.auth);
    const { isDarkMode } = useContext(GlobleContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        try {
            const data = await loginUser(cleanEmail, cleanPassword);
            dispatch(loginSuccess(data));
            
            if (toast && toast.add) {
                toast.add({
                    type: "success",
                    description: "Login successfully!",
                    timeout: 3000,
                });
            }
            
            navigate('/home'); // redirect to dashboard
        } catch (error) {
            console.error(error);
            if (toast && toast.add) {
                toast.add({
                    type: "error",
                    description: error.response?.data?.message || error.message || "Login failed. Please check your credentials.",
                    timeout: 3000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className={`min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
            style={{ backgroundImage: "url('https://i.pinimg.com/1200x/69/f3/04/69f30403d80b7373958d419fc73b9efe.jpg')" }}
        >
            <div className={`absolute inset-0 ${isDarkMode ? "bg-black/60" : "bg-black/20"}`}></div>

            <div className={`relative z-10 w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg border-2 backdrop-blur-sm ${isDarkMode ? "bg-gray-800/90 border-gray-700 text-white" : "bg-white/10 border-gray-200"}`}>
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-blue-200">Welcome Back</h2>
                    <p className={`mt-2 text-sm ${isDarkMode ? "text-white" : "text-white"}`}>
                        Please sign in to your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="email" className='text-white'>Email address</FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className={`w-full px-3 py-5 rounded-md border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password" className='text-white'>Password</FieldLabel>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`w-full px-3 py-5 rounded-md border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                        </Field>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full cursor-pointer flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                    >
                        {loading ? <span className="flex items-center gap-2"><Spinner /> Signing in...</span> : 'Sign in'}
                    </Button>
                </form>
            </div>
            <Toaster />
        </div>
    );
};

export default Login;