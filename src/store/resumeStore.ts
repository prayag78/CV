import { create } from 'zustand';

type ResumeState = {
  latexCode: string | null;
  setLatexCode: (code: string) => void;
  pdfUrl: string | null;
  setPdfUrl: (url: string) => void;
};

export const useResumeStore = create<ResumeState>((set) => ({
  latexCode: null,
  setLatexCode: (code) => set({ latexCode: code }),
  pdfUrl: null,
  setPdfUrl: (url) => set({ pdfUrl: url }),
}));
