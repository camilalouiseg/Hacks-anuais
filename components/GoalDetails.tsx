import React from 'react';
import { X, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Goal } from '../types';

interface GoalDetailsProps {
  goal: Goal;
  onClose: () => void;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const GoalDetails: React.FC<GoalDetailsProps> = ({ goal, onClose }) => {
  const isFinancial = goal.unit === 'R$' || goal.category === 'Financeiro';

  const formatValue = (val: number) => {
    if (isFinancial) {
      return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return val;
  };

  // Global Chart Data
  const globalPercentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const globalData = [
    { value: goal.current },
    { value: Math.max(0, goal.target - goal.current) }
  ];
  // If completed/exceeded, fill the chart
  if (goal.current >= goal.target) {
    globalData[0].value = 1;
    globalData[1].value = 0;
  }

  // Monthly Calculations
  const monthlyTarget = goal.target / 12;
  
  const getMonthlyData = (monthIndex: number) => {
    const currentYear = new Date().getFullYear();
    
    // Filter logs for this specific month
    const monthlyLogs = goal.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.getMonth() === monthIndex && logDate.getFullYear() === currentYear;
    });

    // Sum exact values from filtered logs
    const monthlyCurrent = monthlyLogs.reduce((acc, log) => {
      return acc + (log.value ?? 1);
    }, 0);
    
    // Find the latest log date for this month
    let lastLogDate: Date | null = null;
    if (monthlyLogs.length > 0) {
      // Sort by timestamp descending to get the latest
      const lastLog = monthlyLogs.sort((a, b) => b.timestamp - a.timestamp)[0];
      lastLogDate = new Date(lastLog.timestamp);
    }
    
    // Visual data
    const chartData = [
        { value: monthlyCurrent },
        { value: Math.max(0, monthlyTarget - monthlyCurrent) }
    ];
    if (monthlyCurrent >= monthlyTarget) {
        chartData[0].value = 1;
        chartData[1].value = 0;
    }

    return {
        current: monthlyCurrent,
        target: monthlyTarget,
        percentage: Math.min(100, Math.round((monthlyCurrent / monthlyTarget) * 100)),
        chartData,
        lastLogDate
    };
  };

  // Updated Colors: White with 10% opacity for empty state
  const COLORS = [goal.color, 'rgba(255, 255, 255, 0.1)'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black/80 backdrop-blur-md">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">{goal.category}</p>
          <h2 className="text-2xl font-bold mt-1">{goal.title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full transition-colors text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Global Stats */}
          <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 flex flex-col md:flex-row items-center justify-around gap-8">
             <div className="text-center md:text-left">
                <h3 className="text-xl text-neutral-400 mb-2">Progresso Anual</h3>
                <div className="text-5xl font-bold text-white mb-2">{formatValue(goal.current)}</div>
                <div className="text-neutral-500 font-medium">de {formatValue(goal.target)} {goal.unit}</div>
             </div>

             <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={globalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={goal.color} />
                      <Cell fill={COLORS[1]} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">{globalPercentage}%</span>
                </div>
             </div>
          </div>

          <h3 className="text-xl font-bold flex items-center gap-3 mt-8 text-white">
            <Calendar className="text-neutral-500" />
            Progresso Mensal
          </h3>

          {/* Monthly Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MONTHS.map((month, index) => {
              const data = getMonthlyData(index);
              const isActiveMonth = index === new Date().getMonth();
              
              return (
                <div 
                  key={month} 
                  className={`bg-neutral-900 rounded-xl p-4 border transition-all ${isActiveMonth ? 'border-neutral-500 ring-1 ring-neutral-500' : 'border-neutral-800'}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isActiveMonth ? 'text-white' : 'text-neutral-500'}`}>
                            {month}
                        </span>
                        {isActiveMonth && <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-wide mt-0.5">(Atual)</span>}
                    </div>
                    <span className="text-[10px] bg-black px-2 py-1 rounded text-neutral-300 border border-neutral-800 font-mono">{data.percentage}%</span>
                  </div>
                  
                  <div className="relative h-24 w-full mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={40}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill={goal.color} />
                          <Cell fill={COLORS[1]} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">{formatValue(data.current)}</div>
                    <div className="text-[10px] text-neutral-500 uppercase mt-1">
                      Meta: {formatValue(Number(data.target.toFixed(0)))}
                    </div>
                    {data.lastLogDate && (
                      <div className="text-[10px] text-neutral-400 mt-1 font-medium">
                        Última vez: {data.lastLogDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GoalDetails;