import React from 'react';
import { Goal } from '../types';

interface SummaryTableProps {
  goals: Goal[];
}

const SummaryTable: React.FC<SummaryTableProps> = ({ goals }) => {
  const formatValue = (val: number, unit: string) => {
    if (unit === 'R$') {
      return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return val;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-white uppercase bg-blue-500">
          <tr>
            <th className="px-6 py-3 rounded-tl-lg">Categoria / Meta</th>
            <th className="px-6 py-3 text-center">Realizado (Anual)</th>
            <th className="px-6 py-3 text-center">% Concluído</th>
            <th className="px-6 py-3 text-center">% Restante</th>
            <th className="px-6 py-3 text-center rounded-tr-lg">META FINAL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {goals.map((goal) => {
            const percentage = Math.min(100, (goal.current / goal.target) * 100);
            const remaining = Math.max(0, 100 - percentage);
            
            return (
              <tr key={goal.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: goal.color }}></span>
                  {goal.title}
                </td>
                <td className="px-6 py-4 text-center font-semibold text-slate-700">
                  {formatValue(goal.current, goal.unit)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${percentage >= 100 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {percentage.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-slate-500">
                  {remaining.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-center font-bold text-slate-900">
                  {formatValue(goal.target, goal.unit)}
                </td>
              </tr>
            );
          })}
          {goals.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                Nenhuma meta cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;