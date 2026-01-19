import { GoogleGenAI } from "@google/genai";
import { Goal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProgressInsights = async (goals: Goal[]): Promise<string> => {
  try {
    const goalsSummary = goals.map(g => ({
      title: g.title,
      progress: `${g.current}/${g.target}`,
      percentage: ((g.current / g.target) * 100).toFixed(1) + '%',
      category: g.category
    }));

    const prompt = `
      Atue como um coach de produtividade pessoal experiente.
      Analise meus dados de "Hacks Anuais" (Metas do Ano) abaixo e forneça um resumo motivacional curto.
      
      Dados das Metas:
      ${JSON.stringify(goalsSummary, null, 2)}

      Instruções:
      1. Parabenize pelo progresso na melhor meta.
      2. Identifique a meta que precisa de mais atenção.
      3. Dê 2 dicas práticas e curtas para melhorar a consistência.
      4. Mantenha o tom encorajador e direto. Use emojis.
      5. Responda em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Erro ao conectar com Gemini:", error);
    return "Erro ao gerar insights. Verifique sua conexão ou tente mais tarde.";
  }
};