import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    // Countdown logic (simple fixed date for demo, or 3 days from registration)
    // Let's use a fixed date 3 days from now for demo
    const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Fetch fresh user data
        api.get('/user/me').then(res => setUserData(res.data)).catch(console.error);

        // Countdown Timer (Simulated)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('ideaPdf', file);

        try {
            setUploadStatus('Uploading...');
            await api.post('/user/upload-idea', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadStatus('Upload Successful!');
            // Refresh user data to show upload status
            const res = await api.get('/user/me');
            setUserData(res.data);
        } catch (err) {
            console.error(err);
            setUploadStatus('Upload Failed.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-[#0a0e27] text-slate-200 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-slate-400">Welcome, {user?.full_name}</p>
                    </div>
                    <div className="flex gap-4">
                        {user?.role === 'ADMIN' && (
                            <Button onClick={() => navigate('/admin')} variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-950">
                                Admin Panel
                            </Button>
                        )}
                        <Button onClick={handleLogout} variant="destructive">Logout</Button>
                    </div>
                </div>

                {/* Countdown Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit, i) => (
                        <div key={unit} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                            <div className="text-3xl font-bold text-indigo-400">
                                {Object.values(timeLeft)[i]}
                            </div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">{unit}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Project Idea Submission */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Submit Your Idea</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-slate-400">
                                Upload your innovative AI solution proposal (PDF only, max 5MB).
                            </p>

                            {userData?.idea_pdf_url ? (
                                <div className="bg-green-500/10 text-green-400 p-4 rounded-lg border border-green-500/20">
                                    ✅ Proposal Submitted Successfully
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="bg-slate-950 border-slate-700 text-slate-300"
                                    />
                                    <Button
                                        onClick={handleUpload}
                                        disabled={!file || uploadStatus === 'Uploading...'}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {uploadStatus || 'Upload PDF'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resources & Rules */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Hackathon Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-white">Rules</h3>
                                <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                                    <li>Teams must consist of 1-3 members. (Individual registration required)</li>
                                    <li>Use of GenAI tools is encouraged.</li>
                                    <li>Final submission must include code + presentation.</li>
                                </ul>
                            </div>

                            <div className="pt-4">
                                <a
                                    href="https://chat.openai.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors"
                                >
                                    Open ChatGPT
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Registration Summary */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Your Profile Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                            <div>
                                <div className="text-slate-500">Employee ID</div>
                                <div className="text-white">{userData?.employee_id}</div>
                            </div>
                            <div>
                                <div className="text-slate-500">Designation</div>
                                <div className="text-white">{userData?.designation}</div>
                            </div>
                            <div>
                                <div className="text-slate-500">Technology</div>
                                <div className="text-white">{userData?.primary_technology}</div>
                            </div>
                            <div>
                                <div className="text-slate-500">Customer</div>
                                <div className="text-white">{userData?.customer_name} ({userData?.customer_country})</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default Dashboard;
