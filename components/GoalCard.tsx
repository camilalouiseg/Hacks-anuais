import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, Minus, Trophy, GripVertical } from 'lucide-react';
import { Goal } from '../types';

interface GoalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  goal: Goal;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onAddValue: (id: string, value: number) => void;
  onSelect: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onIncrement, 
  onDecrement, 
  onAddValue, 
  onSelect,
  ...props // Catch drag events and other div props
}) => {
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

  // Updated Colors: Goal Color vs White with 10% opacity for the "remaining" part
  const COLORS = [goal.color, 'rgba(255, 255, 255, 0.1)'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    if (!addValueStr) return;
    
    const val = parseFloat(addValueStr.replace(',', '.'));
    if (!isNaN(val) && val > 0) {
      onAddValue(goal.id, val);
      setAddValueStr('');
    }
  };

  return (
    <div 
      {...props} // Spread drag events here
      onClick={() => onSelect(goal)}
      className={`bg-neutral-900 rounded-xl border border-neutral-800 p-6 flex flex-col justify-between hover:border-neutral-600 transition-all cursor-pointer group relative ${props.className || ''}`}
    >
      {/* Drag Handle Indicator */}
      <div className="absolute top-4 right-4 text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical size={20} />
      </div>

      <div className="flex justify-between items-start mb-4 pr-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-black px-2 py-1 rounded border border-neutral-800">
            {goal.category}
          </span>
          <h3 className="text-lg font-bold text-white mt-3 group-hover:text-neutral-200 transition-colors">{goal.title}</h3>
        </div>
        {percentage >= 100 && (
          <div className="text-yellow-500 animate-bounce absolute top-6 right-6">
            <Trophy size={24} fill="currentColor" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center relative h-40 w-full my-4">
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
          <span className="text-3xl font-bold text-white">{percentage}%</span>
          <span className="text-xs text-neutral-500 font-medium">Concluído</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex justify-between text-sm text-neutral-500 mb-2 font-medium">
          <span>Atual: <strong className="text-white">{formatValue(goal.current)}</strong></span>
          <span>Meta: <strong className="text-white">{formatValue(goal.target)}</strong></span>
        </div>
        
        {isFinancial ? (
          <form onSubmit={handleAddSubmit} className="flex gap-2" onClick={e => e.stopPropagation()}>
            <input 
              type="text" 
              inputMode="decimal"
              placeholder="0,00"
              className="flex-1 px-3 py-2 bg-black border border-neutral-800 text-white rounded-lg outline-none focus:border-neutral-500 transition-colors text-sm placeholder-neutral-700"
              style={{ '--tw-ring-color': goal.color } as React.CSSProperties}
              value={addValueStr}
              onChange={e => setAddValueStr(e.target.value)}
            />
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center transition-transform active:scale-95 hover:brightness-110"
              style={{ backgroundColor: goal.color }}
              disabled={!addValueStr}
            >
              <Plus size={20} />
            </button>
          </form>
        ) : (
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <button 
              onClick={(e) => { e.stopPropagation(); onDecrement(goal.id); }}
              className="p-2 rounded-lg bg-black hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              aria-label="Diminuir"
            >
              <Minus size={20} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onIncrement(goal.id); }}
              className="flex-1 py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-transform active:scale-95 hover:brightness-110"
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