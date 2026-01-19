import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, Minus, Trophy, Check } from 'lucide-react';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onAddValue: (id: string, value: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onIncrement, onDecrement, onAddValue }) => {
  const [addValueStr, setAddValueStr] = useState('');
  
  const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.current);
  
  const isFinancial = goal.unit === 'R$' || goal.category === 'Financeiro';

  const formatValue = (val: number) => {
    if (isFinancial) {
      return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return val;
  };

  const data = [
    { name: 'Concluído', value: goal.current },
    { name: 'Restante', value: remaining },
  ];

  // If goal is exceeded, we still want the chart to look full
  const chartData = goal.current >= goal.target 
    ? [{ name: 'Concluído', value: 1 }] 
    : data;

  const COLORS = [goal.color, '#e2e8f0'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addValueStr) return;
    
    // Replace comma with dot for parsing
    const val = parseFloat(addValueStr.replace(',', '.'));
    if (!isNaN(val) && val > 0) {
      onAddValue(goal.id, val);
      setAddValueStr('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
            {goal.category}
          </span>
          <h3 className="text-lg font-bold text-slate-800 mt-2">{goal.title}</h3>
        </div>
        {percentage >= 100 && (
          <div className="text-yellow-500 animate-bounce">
            <Trophy size={24} fill="currentColor" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center relative h-40 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
          <span className="text-xs text-slate-500">Concluído</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Atual: <strong>{formatValue(goal.current)}</strong></span>
          <span>Meta: <strong>{formatValue(goal.target)}</strong></span>
        </div>
        
        {isFinancial ? (
          <form onSubmit={handleAddSubmit} className="flex gap-2">
            <input 
              type="text" 
              inputMode="decimal"
              placeholder="0,00"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent text-sm"
              style={{ '--tw-ring-color': goal.color } as React.CSSProperties}
              value={addValueStr}
              onChange={e => setAddValueStr(e.target.value)}
            />
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center transition-transform active:scale-95 shadow-sm hover:opacity-90"
              style={{ backgroundColor: goal.color }}
              disabled={!addValueStr}
            >
              <Plus size={20} />
            </button>
          </form>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => onDecrement(goal.id)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Diminuir"
            >
              <Minus size={20} />
            </button>
            <button 
              onClick={() => onIncrement(goal.id)}
              className="flex-1 py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm hover:opacity-90"
              style={{ backgroundColor: goal.color }}
            >
              <Plus size={20} />
              Marcar Presença
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;