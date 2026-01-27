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
    <div className="overflow-x-auto bg-neutral-900 rounded-xl border border-neutral-800">
      <table className="w-full text-sm text-left text-neutral-400">
        <thead className="text-xs text-neutral-500 uppercase bg-black border-b border-neutral-800">
          <tr>
            <th className="px-6 py-4">Categoria / Meta</th>
            <th className="px-6 py-4 text-center">Realizado (Anual)</th>
            <th className="px-6 py-4 text-center">% Concluído</th>
            <th className="px-6 py-4 text-center">% Restante</th>
            <th className="px-6 py-4 text-center">META FINAL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {goals.map((goal) => {
            const percentage = Math.min(100, (goal.current / goal.target) * 100);
            const remaining = Math.max(0, 100 - percentage);
            
            return (
              <tr key={goal.id} className="hover:bg-neutral-800 transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: goal.color }}></span>
                  {goal.title}
                </td>
                <td className="px-6 py-4 text-center font-semibold text-neutral-300">
                  {formatValue(goal.current, goal.unit)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${percentage >= 100 ? 'bg-neutral-800 text-white border-neutral-600' : 'bg-black text-neutral-500 border-neutral-800'}`}>
                    {percentage.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-neutral-600">
                  {remaining.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-center font-bold text-white">
                  {formatValue(goal.target, goal.unit)}
                </td>
              </tr>
            );
          })}
          {goals.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
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