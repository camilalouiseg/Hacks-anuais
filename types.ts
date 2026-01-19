export interface LogEntry {
  id: string;
  timestamp: number;
}

export interface Goal {
  id: string;
  title: string;
  category: 'Saúde' | 'Financeiro' | 'Estudos' | 'Outro';
  target: number;
  current: number;
  unit: string; // e.g., "vezes", "livros", "horas"
  logs: LogEntry[];
  color: string;
}

export interface GoalFormData {
  title: string;
  target: number;
  category: Goal['category'];
  unit: string;
}