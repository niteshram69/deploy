import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/ui/Stepper';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import api from '../lib/axios';

const steps = [
    'Employee Details',
    'Customer Details',
    'AI Engagement',
    'AI Skills',
    'Account',
];

// Zod Schema
const registerSchema = z.object({
    // Step 1
    employee_id: z.string().min(1, 'Employee ID is required'),
    full_name: z.string().min(1, 'Full name is required'),
    designation: z.string().min(1, 'Designation is required'),
    primary_technology: z.string().min(1, 'Primary technology is required'),
    experience_years: z.coerce.number().min(0, 'Years cannot be negative'),
    experience_months: z.coerce.number().min(0, 'Months cannot be negative').max(11, 'Months must be 0-11'),
    skill_level: z.enum(['Basics', 'Intermediate', 'Expert']),

    // Step 2
    customer_name: z.string().min(1, 'Customer name is required'),
    customer_country: z.string().min(1, 'Customer country is required'),
    customer_pic_name: z.string().min(1, 'PIC name is required'),
    customer_pic_department: z.string().min(1, 'PIC department is required'),
    current_work_description: z.string()
        .min(10, 'Please provide more detail')
        .max(1500, 'Max words exceeded (approx)'),

    // Step 3
    ai_opportunity: z.string().max(1000, 'Max words exceeded'),
    customer_ai_adoption: z.enum(['Yes', 'No', 'Not Sure']),
    product_business_line: z.string().max(1000, 'Max words exceeded'),
    worked_on_ai: z.enum(['Yes', 'No']),

    // Step 4
    ai_skill_level: z.enum(['Basics', 'Intermediate', 'Advanced']),
    ai_upskill_interest: z.enum(['Low', 'Medium', 'High']),
    ai_certification: z.string().optional(),
    ai_forge_core_business_view: z.string().max(1000, 'Max words exceeded'),

    // Step 5
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const { register, control, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema) as any,
        mode: 'onBlur',
        defaultValues: {
            ai_skill_level: 'Basics',
            ai_upskill_interest: 'Medium',
            skill_level: 'Basics',
            customer_ai_adoption: 'Not Sure',
            worked_on_ai: 'No',
            ai_certification: 'NIL'
        }
    });

    const nextStep = async () => {
        let fieldsToValidate: (keyof RegisterFormData)[] = [];

        if (currentStep === 0) {
            fieldsToValidate = ['employee_id', 'full_name', 'designation', 'primary_technology', 'experience_years', 'experience_months', 'skill_level'];
        } else if (currentStep === 1) {
            fieldsToValidate = ['customer_name', 'customer_country', 'customer_pic_name', 'customer_pic_department', 'current_work_description'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['ai_opportunity', 'customer_ai_adoption', 'product_business_line', 'worked_on_ai'];
        } else if (currentStep === 3) {
            fieldsToValidate = ['ai_skill_level', 'ai_upskill_interest', 'ai_certification', 'ai_forge_core_business_view'];
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        window.scrollTo(0, 0);
    };

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError(null);
            await api.post('/auth/register', data);
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            let errorMessage = 'Registration failed. Please try again.';
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
        <div className="min-h-screen bg-[#0a0e27] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <img src="/logo.png" alt="Mindteck" className="h-12 w-auto" />
                </a>
            </div>
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Join <span className="text-white">mind</span><span className="text-sky-400">AI</span><span className="text-white">thon</span>
                    </h1>
                    <p className="mt-2 text-lg text-slate-400">
                        Complete your profile to participate
                    </p>
                </div>

                <Stepper steps={steps} currentStep={currentStep} />

                <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit as any)} className="p-8 space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* STEP 1: Employee Details */}
                            {currentStep === 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-white mb-4">Employee Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Employee ID</label>
                                            <Input {...register('employee_id')} placeholder="e.g. 100123" className="bg-slate-900/50 border-slate-700" />
                                            {errors.employee_id && <span className="text-xs text-red-400">{errors.employee_id.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Full Name</label>
                                            <Input {...register('full_name')} placeholder="John Doe" className="bg-slate-900/50 border-slate-700" />
                                            {errors.full_name && <span className="text-xs text-red-400">{errors.full_name.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Designation</label>
                                            <Input {...register('designation')} placeholder="Software Engineer" className="bg-slate-900/50 border-slate-700" />
                                            {errors.designation && <span className="text-xs text-red-400">{errors.designation.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Primary Technology</label>
                                            <Input {...register('primary_technology')} placeholder="React/Node.js" className="bg-slate-900/50 border-slate-700" />
                                            {errors.primary_technology && <span className="text-xs text-red-400">{errors.primary_technology.message}</span>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Experience (Years)</label>
                                                <Input type="number" min="0" {...register('experience_years')} placeholder="5" className="bg-slate-900/50 border-slate-700" />
                                                {errors.experience_years && <span className="text-xs text-red-400">{errors.experience_years.message}</span>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Experience (Months)</label>
                                                <Input type="number" min="0" max="11" {...register('experience_months')} placeholder="0" className="bg-slate-900/50 border-slate-700" />
                                                {errors.experience_months && <span className="text-xs text-red-400">{errors.experience_months.message}</span>}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Skill Level</label>
                                            <Controller
                                                name="skill_level"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Basics">Basics</SelectItem>
                                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                            <SelectItem value="Expert">Expert</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.skill_level && <span className="text-xs text-red-400">{errors.skill_level.message}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Customer Details */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-white mb-4">Customer Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Customer Name</label>
                                            <Input {...register('customer_name')} placeholder="Client Corp" className="bg-slate-900/50 border-slate-700" />
                                            {errors.customer_name && <span className="text-xs text-red-400">{errors.customer_name.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Customer Country</label>
                                            <Input {...register('customer_country')} placeholder="USA" className="bg-slate-900/50 border-slate-700" />
                                            {errors.customer_country && <span className="text-xs text-red-400">{errors.customer_country.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Customer PIC Name</label>
                                            <Input {...register('customer_pic_name')} placeholder="Project Manager Name" className="bg-slate-900/50 border-slate-700" />
                                            {errors.customer_pic_name && <span className="text-xs text-red-400">{errors.customer_pic_name.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Customer PIC Dept</label>
                                            <Input {...register('customer_pic_department')} placeholder="IT Department" className="bg-slate-900/50 border-slate-700" />
                                            {errors.customer_pic_department && <span className="text-xs text-red-400">{errors.customer_pic_department.message}</span>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">What are you currently working on?</label>
                                        <Textarea {...register('current_work_description')} placeholder="Briefly describe your current project..." className="bg-slate-900/50 border-slate-700 h-32" />
                                        {errors.current_work_description && <span className="text-xs text-red-400">{errors.current_work_description.message}</span>}
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: AI Engagement */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-white mb-4">AI in Current Engagement</h2>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">AI Opportunity in current engagement</label>
                                        <Textarea {...register('ai_opportunity')} placeholder="Describe potential AI use cases..." className="bg-slate-900/50 border-slate-700" />
                                        {errors.ai_opportunity && <span className="text-xs text-red-400">{errors.ai_opportunity.message}</span>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Is customer adopting AI?</label>
                                            <Controller
                                                name="customer_ai_adoption"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Yes">Yes</SelectItem>
                                                            <SelectItem value="No">No</SelectItem>
                                                            <SelectItem value="Not Sure">Not Sure</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.customer_ai_adoption && <span className="text-xs text-red-400">{errors.customer_ai_adoption.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Have you worked on AI before?</label>
                                            <Controller
                                                name="worked_on_ai"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Yes">Yes</SelectItem>
                                                            <SelectItem value="No">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.worked_on_ai && <span className="text-xs text-red-400">{errors.worked_on_ai.message}</span>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Product / Business Line</label>
                                        <Textarea {...register('product_business_line')} placeholder="e.g. Healthcare, Finance..." className="bg-slate-900/50 border-slate-700" />
                                        {errors.product_business_line && <span className="text-xs text-red-400">{errors.product_business_line.message}</span>}
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: AI Skills */}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-white mb-4">AI Skills & Interest</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">AI Skill Level</label>
                                            <Controller
                                                name="ai_skill_level"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Basics">Basics</SelectItem>
                                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.ai_skill_level && <span className="text-xs text-red-400">{errors.ai_skill_level.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Interest to Upskill</label>
                                            <Controller
                                                name="ai_upskill_interest"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="bg-slate-900/50 border-slate-700">
                                                            <SelectValue placeholder="Select interest" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Low">Low</SelectItem>
                                                            <SelectItem value="Medium">Medium</SelectItem>
                                                            <SelectItem value="High">High</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.ai_upskill_interest && <span className="text-xs text-red-400">{errors.ai_upskill_interest.message}</span>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">AI Certifications (Enter 'NIL' if none)</label>
                                        <Input {...register('ai_certification')} placeholder="List certifications..." className="bg-slate-900/50 border-slate-700" />
                                        {errors.ai_certification && <span className="text-xs text-red-400">{errors.ai_certification.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">What do you think is mindAIthon's core business area?</label>
                                        <Textarea {...register('ai_forge_core_business_view')} placeholder="Your thoughts..." className="bg-slate-900/50 border-slate-700" />
                                        {errors.ai_forge_core_business_view && <span className="text-xs text-red-400">{errors.ai_forge_core_business_view.message}</span>}
                                    </div>
                                </div>
                            )}

                            {/* STEP 5: Account & Submit */}
                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-white mb-4">Account Creation</h2>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address (Login ID)</label>
                                        <Input type="email" {...register('email')} placeholder="you@example.com" className="bg-slate-900/50 border-slate-700" />
                                        {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <Input type="password" {...register('password')} placeholder="******" className="bg-slate-900/50 border-slate-700" />
                                            {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Confirm Password</label>
                                            <Input type="password" {...register('confirmPassword')} placeholder="******" className="bg-slate-900/50 border-slate-700" />
                                            {errors.confirmPassword && <span className="text-xs text-red-400">{errors.confirmPassword.message}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>

                        <div className="flex justify-between pt-6 border-t border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 0 || isSubmitting}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                            >
                                Back
                            </Button>

                            {currentStep < steps.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-gradient-primary hover:opacity-90 text-white border-0"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-primary hover:opacity-90 text-white border-0 w-32"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Register'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
