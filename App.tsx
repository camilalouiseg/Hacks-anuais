import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, Table as TableIcon } from 'lucide-react';
import { Goal, GoalFormData } from './types';
import GoalCard from './components/GoalCard';
import SummaryTable from './components/SummaryTable';
import AddGoalModal from './components/AddGoalModal';
import GoalDetails from './components/GoalDetails';

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
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('hacks-anuais-data-v2');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  useEffect(() => {
    localStorage.setItem('hacks-anuais-data-v2', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (selectedGoal) {
      const updatedGoal = goals.find(g => g.id === selectedGoal.id);
      if (updatedGoal) setSelectedGoal(updatedGoal);
    }
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
          logs: [...goal.logs, { id: Date.now().toString(), timestamp: Date.now(), value: 1 }]
        };
      }
      return goal;
    }));
  };

  const handleDecrement = (id: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id && goal.current > 0) {
        // Find value of last log to subtract correctly
        const lastLog = goal.logs[goal.logs.length - 1];
        const valueToRemove = lastLog?.value || 1;
        
        return {
          ...goal,
          current: Math.max(0, goal.current - valueToRemove),
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
          logs: [...goal.logs, { id: Date.now().toString(), timestamp: Date.now(), value: value }]
        };
      }
      return goal;
    }));
  };

  // Drag Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    // Optional: Visual feedback could be added here
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newGoals = [...goals];
    const draggedItem = newGoals[draggedIndex];
    
    // Remove from old position
    newGoals.splice(draggedIndex, 1);
    // Insert at new position
    newGoals.splice(index, 0, draggedItem);

    setGoals(newGoals);
    setDraggedIndex(null);
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
  const totalPercentage = goals.length > 0 
    ? goals.reduce((acc, curr) => acc + Math.min(100, (curr.current / curr.target) * 100), 0) / goals.length
    : 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      {/* Header */}
      <header className="bg-black border-b border-neutral-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-xl">
              H
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Hacks Anuais</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Progresso Global</span>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-32 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, totalPercentage)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-white">{totalPercentage.toFixed(1)}%</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg transition-colors border border-neutral-800"
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white">Meus Objetivos</h2>
            <p className="text-xs text-neutral-500">Arraste os cards para organizar sua prioridade.</p>
          </div>
          <div className="flex bg-black rounded-lg p-1 border border-neutral-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-neutral-900 text-white border border-neutral-800' : 'text-neutral-600 hover:text-neutral-400'}`}
              aria-label="Visualização em grade"
            >
              <LayoutDashboard size={20} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-neutral-900 text-white border border-neutral-800' : 'text-neutral-600 hover:text-neutral-400'}`}
              aria-label="Visualização em tabela"
            >
              <TableIcon size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        {goals.length === 0 ? (
          <div className="text-center py-20 bg-neutral-950 rounded-xl border border-dashed border-neutral-800">
            <p className="text-neutral-500 text-lg mb-4">Você ainda não tem hacks cadastrados.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white font-semibold hover:underline"
            >
              Começar agora
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal, index) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onAddValue={handleAddValue}
                    onSelect={setSelectedGoal}
                    className={draggedIndex === index ? 'opacity-50 border-white border-dashed' : ''}
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

      {/* Goal Details Modal */}
      {selectedGoal && (
        <GoalDetails 
          goal={selectedGoal} 
          onClose={() => setSelectedGoal(null)} 
        />
      )}
    </div>
  );
};

export default App;