import { Check } from 'lucide-react';

const steps = [
  { number: 1, label: "Type" },
  { number: 2, label: "Contenu" },
  { number: 3, label: "Style" },
  { number: 4, label: "Télécharger" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const isDone = step.number < currentStep;
        const isActive = step.number === currentStep;
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500
                ${isDone ? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/30' : ''}
                ${isActive ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/40 scale-110 ring-2 ring-violet-400/30' : ''}
                ${!isDone && !isActive ? 'bg-white/5 text-muted-foreground border border-white/10' : ''}
              `}>
                {isDone ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className={`text-xs font-medium transition-colors ${isActive ? 'text-violet-300' : isDone ? 'text-violet-400/70' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 md:w-20 h-0.5 mx-2 mb-5 transition-all duration-500 ${isDone ? 'bg-gradient-to-r from-violet-500 to-cyan-500' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}