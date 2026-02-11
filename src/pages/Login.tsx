import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError(null);
            const response = await api.post('/auth/login', data);
            login(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            let errorMessage = 'Login failed. Please checks your credentials.';
            if (err.response?.data?.error) {
                if (typeof err.response.data.error === 'string') {
                    errorMessage = err.response.data.error;
                } else if (typeof err.response.data.error === 'object') {
                    errorMessage = err.response.data.error.message || JSON.stringify(err.response.data.error);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e27] text-slate-200 flex items-center justify-center p-4 relative">
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <img src="/logo.png" alt="Mindteck" className="h-12 w-auto" />
                </a>
            </div>
            <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Login</h1>
                    <p className="text-slate-400">Welcome back to <span className="text-white font-semibold">mind</span><span className="text-sky-400 font-semibold">AI</span><span className="text-white font-semibold">thon</span></p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input type="email" {...register('email')} placeholder="you@example.com" className="bg-slate-900/50 border-slate-700" />
                        {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input type="password" {...register('password')} placeholder="******" className="bg-slate-900/50 border-slate-700" />
                        {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-primary hover:opacity-90 text-white border-0"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-slate-500">Don't have an account? </span>
                    <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
