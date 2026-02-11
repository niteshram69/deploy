import { motion } from 'framer-motion';

interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center w-full relative">
                    <div className="flex items-center w-full">
                        {/* Line connecting steps */}
                        {index !== 0 && (
                            <div className={`flex-auto border-t-2 transition-colors duration-300 ${index <= currentStep ? 'border-indigo-500' : 'border-slate-700'}`}></div>
                        )}

                        {/* Step Circle */}
                        <motion.div
                            initial={false}
                            animate={{
                                backgroundColor: index <= currentStep ? '#6366f1' : '#1e293b', // indigo-500 or slate-800
                                borderColor: index <= currentStep ? '#6366f1' : '#475569', // indigo-500 or slate-600
                                scale: index === currentStep ? 1.1 : 1
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 text-xs font-bold ${index <= currentStep ? 'text-white' : 'text-slate-400'}`}
                        >
                            {index + 1}
                        </motion.div>

                        {/* Line connecting steps (right side for symmetry, handled by next element usually but let's keep it simple) */}
                        {index !== steps.length - 1 && (
                            <div className={`flex-auto border-t-2 transition-colors duration-300 ${index < currentStep ? 'border-indigo-500' : 'border-slate-700'}`}></div>
                        )}
                    </div>

                    {/* Step Label */}
                    <div className={`mt-2 text-xs font-medium text-center ${index <= currentStep ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {step}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Stepper;
