import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, X, Download } from 'lucide-react';

interface UserData {
    id: number;
    employee_id: string;
    full_name: string;
    email: string;
    designation: string;
    role: string;
    idea_pdf_url: string | null;
    created_at: string;
    [key: string]: any; // Allow indexing
}

const Admin = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete user');
        }
    };

    const handleExportPDF = async () => {
        try {
            const response = await api.get('/admin/export-pdf', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users_export.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed', err);
            alert('Failed to export PDF');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e27] text-slate-200 p-8 relative">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                    <div className="flex gap-4">
                        <Button onClick={() => navigate('/dashboard')} variant="outline" className="text-slate-300 border-slate-700">
                            Back to Dashboard
                        </Button>
                        <Button onClick={handleExportPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Export PDF
                        </Button>
                        <Button onClick={async () => {
                            if (!window.confirm('Run database migration?')) return;
                            try {
                                await api.post('/admin/migrate-db');
                                alert('Migration successful!');
                            } catch (err) {
                                console.error(err);
                                alert('Migration failed');
                            }
                        }} variant="secondary" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Migrate DB
                        </Button>
                    </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1f2937] text-slate-300 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Emp ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Designation</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Idea</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                                ) : users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{user.employee_id}</td>
                                        <td className="px-6 py-4">{user.full_name}</td>
                                        <td className="px-6 py-4 text-slate-400">{user.designation}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700 text-slate-300'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.idea_pdf_url ? <span className="text-green-400">Yes</span> : <span className="text-slate-600">No</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => setSelectedUser(user)} className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            {user.idea_pdf_url && (
                                                <a href={user.idea_pdf_url} target="_blank" rel="noopener noreferrer">
                                                    <Button size="icon" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </a>
                                            )}
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1f2937] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700 sticky top-0 bg-[#1f2937] z-10">
                            <h2 className="text-xl font-bold text-white">User Details</h2>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailGroup title="Employee Info">
                                    <Detail label="ID" value={selectedUser.employee_id} />
                                    <Detail label="Name" value={selectedUser.full_name} />
                                    <Detail label="Email" value={selectedUser.email} />
                                    <Detail label="Designation" value={selectedUser.designation} />
                                    <Detail label="Role" value={selectedUser.role} />
                                    <Detail label="Tech" value={selectedUser.primary_technology} />
                                    <Detail label="Experience" value={`${selectedUser.experience_years} years, ${selectedUser.experience_months || 0} months`} />
                                    <Detail label="Skill Level" value={selectedUser.skill_level} />
                                </DetailGroup>

                                <DetailGroup title="Customer Info">
                                    <Detail label="Customer" value={selectedUser.customer_name} />
                                    <Detail label="Country" value={selectedUser.customer_country} />
                                    <Detail label="PIC Name" value={selectedUser.customer_pic_name} />
                                    <Detail label="PIC Dept" value={selectedUser.customer_pic_department} />
                                    <div className="col-span-2">
                                        <p className="text-xs text-slate-500 mb-1">Project Desc</p>
                                        <p className="text-sm text-slate-300">{selectedUser.current_work_description}</p>
                                    </div>
                                </DetailGroup>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                <h3 className="text-lg font-semibold text-white">AI Engagement</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Detail label="AI Opportunity" value={selectedUser.ai_opportunity} fullWidth />
                                    <Detail label="Customer Adoption" value={selectedUser.customer_ai_adoption} />
                                    <Detail label="Worked on AI?" value={selectedUser.worked_on_ai} />
                                    <Detail label="AI Skill Level" value={selectedUser.ai_skill_level} />
                                    <Detail label="Upskill Interest" value={selectedUser.ai_upskill_interest} />
                                    <Detail label="Certification" value={selectedUser.ai_certification} />
                                    <Detail label="Core Business View" value={selectedUser.ai_forge_core_business_view} fullWidth />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
        <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-700 pb-2">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const Detail = ({ label, value, fullWidth = false }: { label: string, value: string | number | null, fullWidth?: boolean }) => (
    <div className={fullWidth ? 'col-span-full' : ''}>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm text-slate-300 break-words">{value || 'N/A'}</p>
    </div>
);

export default Admin;
