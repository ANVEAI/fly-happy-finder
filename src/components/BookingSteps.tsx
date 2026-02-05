 import { Check } from 'lucide-react';
 import { motion } from 'framer-motion';
 
 interface Step {
   id: number;
   label: string;
   description: string;
 }
 
 interface BookingStepsProps {
   currentStep: number;
   steps: Step[];
 }
 
 const BookingSteps = ({ currentStep, steps }: BookingStepsProps) => {
   return (
     <div className="w-full py-4">
       <div className="flex items-center justify-between max-w-3xl mx-auto">
         {steps.map((step, index) => (
           <div key={step.id} className="flex items-center">
             {/* Step Circle */}
             <div className="flex flex-col items-center">
               <motion.div
                 initial={{ scale: 0.8 }}
                 animate={{ scale: 1 }}
                 className={`step-dot ${
                   currentStep > step.id
                     ? 'step-dot-completed'
                     : currentStep === step.id
                     ? 'step-dot-active'
                     : 'step-dot-inactive'
                 }`}
               >
                 {currentStep > step.id ? (
                   <Check className="w-4 h-4" />
                 ) : (
                   step.id
                 )}
               </motion.div>
               <div className="mt-2 text-center">
                 <div className={`text-sm font-medium ${
                   currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                 }`}>
                   {step.label}
                 </div>
                 <div className="text-xs text-muted-foreground hidden sm:block">
                   {step.description}
                 </div>
               </div>
             </div>
 
             {/* Connector Line */}
             {index < steps.length - 1 && (
               <div className="flex-1 mx-4 hidden sm:block">
                 <div className={`h-0.5 rounded-full transition-colors ${
                   currentStep > step.id ? 'bg-success' : 'bg-border'
                 }`} />
               </div>
             )}
           </div>
         ))}
       </div>
     </div>
   );
 };
 
 export default BookingSteps;