import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, Table as TableIcon } from 'lucide-react';
import { Goal, GoalFormData } from './types';
import GoalCard from './components/GoalCard';
import SummaryTable from './components/SummaryTable';
import AddGoalModal from './components/AddGoalModal';

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Ir na Academia',
    category: 'Saúde',
    target: 156,
    current: 6,
    unit: 'treinos',
    color: '#8b5cf6', // Violet
    logs: []
  },
  {
    id: '2',
    title: 'Cardio',
    category: 'Saúde',
    target: 156,
    current: 4,
    unit: 'sessões',
    color: '#f97316', // Orange
    logs: []
  },
  {
    id: '3',
    title: 'Beber Água (2L)',
    category: 'Saúde',
    target: 365,
    current: 12,
    unit: 'dias',
    color: '#3b82f6', // Blue
    logs: []
  },
  {
    id: '4',
    title: 'Ler Livros',
    category: 'Estudos',
    target: 12,
    current: 1,
    unit: 'livros',
    color: '#10b981', // Emerald
    logs: []
  },
  {
    id: '5',
    title: '100K',
    category: 'Financeiro',
    target: 100000,
    current: 62453.36,
    unit: 'R$',
    color: '#059669', // Green
    logs: []
  }
];

const App: React.FC = () => {
  // Changed key to v2 to ensure new 100K goal appears for existing users
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('hacks-anuais-data-v2');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  useEffect(() => {
    localStorage.setItem('hacks-anuais-data-v2', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (data: GoalFormData) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      ...data,
      current: 0,
      logs: [],
      color: getRandomColor(data.category)
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleIncrement = (id: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        return {
          ...goal,
          current: goal.current + 1,
          logs: [...goal.logs, { id: Date.now().toString(), timestamp: Date.now() }]
        };
      }
      return goal;
    }));
  };

  const handleDecrement = (id: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id && goal.current > 0) {
        return {
          ...goal,
          current: goal.current - 1,
          logs: goal.logs.slice(0, -1)
        };
      }
      return goal;
    }));
  };

  const handleAddValue = (id: string, value: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        return {
          ...goal,
          current: goal.current + value,
          logs: [...goal.logs, { id: Date.now().toString(), timestamp: Date.now() }]
        };
      }
      return goal;
    }));
  };

  // Helper for colors
  const getRandomColor = (category: string) => {
    const colors = {
      'Saúde': ['#ef4444', '#f97316', '#8b5cf6', '#ec4899'],
      'Financeiro': ['#10b981', '#059669', '#34d399'],
      'Estudos': ['#3b82f6', '#6366f1', '#8b5cf6'],
      'Outro': ['#64748b', '#94a3b8']
    };
    // @ts-ignore
    const palette = colors[category] || colors['Outro'];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  // Calculate totals for header summary
  // For total percentage, we need to normalize goals since they have different scales (e.g. 156 vs 100000)
  // Simple average of percentages is often better than sum of values for mixed types
  const totalPercentage = goals.length > 0 
    ? goals.reduce((acc, curr) => acc + Math.min(100, (curr.current / curr.target) * 100), 0) / goals.length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <h1 className="text-xl font-bold tracking-tight">Hacks Anuais</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-xs text-slate-500 font-semibold uppercase">Progresso Global</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, totalPercentage)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-blue-600">{totalPercentage.toFixed(1)}%</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova Meta</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* View Toggles & Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Meus Objetivos</h2>
          <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Visualização em grade"
            >
              <LayoutDashboard size={20} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Visualização em tabela"
            >
              <TableIcon size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        {goals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg mb-4">Você ainda não tem hacks cadastrados.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Começar agora
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onAddValue={handleAddValue}
                  />
                ))}
              </div>
            ) : (
              <SummaryTable goals={goals} />
            )}
          </>
        )}
      </main>

      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddGoal}
      />
    </div>
  );
};

export default App;