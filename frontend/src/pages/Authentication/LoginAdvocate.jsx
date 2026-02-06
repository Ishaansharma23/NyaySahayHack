import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService.js';
import { useQueryClient } from '@tanstack/react-query';

const LoginAdvocate = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await authService.loginAdvocate(data);
            console.log('Login successful:', response);

            const profileComplete = !!(response.user.lawFirm && response.user.barCouncilNumber && response.user.specialization);
            queryClient.setQueryData(['authUser'], {
                authenticated: true,
                user: response.user,
                role: response.user.role,
                profileComplete
            });
            
            // Navigate to dashboard or onboarding based on user completion status
            if (profileComplete) {
                navigate('/advocate/dashboard');
            } else {
                navigate('/onboarding/advocate');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('root', { 
                message: error.message || 'Login failed. Please check your credentials.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 relative text-white">
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 text-gray-300 hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, Advocate</h1>
                        <p className="text-gray-400">Sign in to your legal practice account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@lawfirm.com"
                                    className={`block w-full pl-10 pr-3 py-3 border bg-white/5 text-white placeholder:text-gray-500 ${
                                        errors.email ? 'border-red-400' : 'border-white/10'
                                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent`}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className={`block w-full pl-10 pr-10 py-3 border bg-white/5 text-white placeholder:text-gray-500 ${
                                        errors.password ? 'border-red-400' : 'border-white/10'
                                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent`}
                                    {...register('password', {
                                        required: 'Password is required'
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-white/20 bg-white/10 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-indigo-300 hover:text-indigo-200">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {errors.root && (
                            <div className="text-sm text-red-600 text-center">
                                {errors.root.message}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/signup/advocate" className="font-medium text-indigo-300 hover:text-indigo-200">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAdvocate;