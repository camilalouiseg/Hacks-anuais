import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GoalFormData } from '../types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: GoalFormData) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    target: 100,
    category: 'Saúde',
    unit: 'vezes',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    // Reset form
    setFormData({ title: '', target: 100, category: 'Saúde', unit: 'vezes' });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in text-white">
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">Nova Meta Anual</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Título da Meta</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none transition-all text-white placeholder-neutral-600"
              placeholder="Ex: Ir na Academia"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Meta Anual</label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none text-white"
                value={formData.target}
                onChange={e => setFormData({...formData, target: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Unidade</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none text-white placeholder-neutral-600"
                placeholder="Ex: vezes"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Categoria</label>
            <select
              className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg focus:ring-1 focus:ring-white focus:border-white outline-none text-white appearance-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value as any})}
            >
              <option value="Saúde">Saúde</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Estudos">Estudos</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl shadow-lg transition-all"
            >
              Criar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;