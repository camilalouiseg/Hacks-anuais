import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AICoachProps {
  insights: string | null;
  loading: boolean;
  onGenerate: () => void;
}

const AICoach: React.FC<AICoachProps> = ({ insights, loading, onGenerate }) => {
  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Sparkles size={24} className="text-yellow-300" />
          </div>
          <h2 className="text-2xl font-bold">Coach IA - Insights</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="animate-spin" />
            <p>Analisando seus hacks anuais...</p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {insights ? (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10 whitespace-pre-line leading-relaxed">
                {insights}
              </div>
            ) : (
              <p className="text-indigo-100 mb-4">
                Receba uma análise inteligente do seu progresso, dicas personalizadas e motivação baseada nos seus dados atuais.
              </p>
            )}
            
            <button 
              onClick={onGenerate}
              className="mt-4 px-6 py-2 bg-white text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg active:scale-95 flex items-center gap-2"
            >
              {insights ? 'Atualizar Análise' : 'Gerar Análise com IA'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;