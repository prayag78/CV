"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Brain, Send, RefreshCw, Download, Lightbulb } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/resumeStore";
import toast from "react-hot-toast";

export default function LatexEditorPage() {
  const { pdfUrl, setPdfUrl, latexCode, setLatexCode } = useResumeStore();
  const [newPdfUrl, setNewPdfUrl] = useState<string | null>(null);

  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPrompt.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      const payload = {
        template: latexCode,
        userPrompt: currentPrompt,
      };

      const res = await fetch("/api/edit-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Resume generation failed");

      const { latex, pdf } = await res.json();

      if (latex) setLatexCode(latex);

      if (pdf) {
        const byteCharacters = atob(pdf);
        const byteArray = new Uint8Array(
          [...byteCharacters].map((c) => c.charCodeAt(0))
        );
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setNewPdfUrl(url);
      }

      setCurrentPrompt("");
    } catch (error) {
      toast.error("Generation failed");
      console.error("Generation error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "resume.pdf";
      a.click();
    }
  };

  const currentPdfUrl = newPdfUrl || pdfUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <Brain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  PDF Preview
                </h1>
              </div>
            </div>

            {(newPdfUrl || pdfUrl) && (
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all duration-200"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">Download</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* PDF Viewer Section */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                    Document Preview
                  </h2>
                  <div className="flex items-center gap-2">
                    {/* Green Status Dot */}
                    <div className="relative w-2 h-2">
                      {/* Ping animation (background pulse) */}
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-90 animate-ping"></span>
                      {/* Static green dot */}
                      <span className="absolute inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex justify-center items-center bg-slate-50 dark:bg-slate-900/50">
                <div className="w-full max-w-4xl">
                  <iframe
                    src={currentPdfUrl || "/image.png"}
                    className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] xl:h-[75vh] border-2 border-slate-300 dark:border-slate-600 rounded-lg shadow-inner bg-white"
                    title="PDF Preview"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 h-fit sticky top-4">
              <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg">
                    <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      AI Assistant
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Modify your Resume
                    </p>
                  </div>
                </div>

                {isProcessing && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-800/30 px-3 py-2 rounded-lg">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing your request...
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      What would you like to change?
                    </label>
                    <Input
                      ref={inputRef}
                      value={currentPrompt}
                      onChange={(e) => setCurrentPrompt(e.target.value)}
                      placeholder="e.g., Bold the word Leetcode"
                      className="w-full h-10 border-2 border-slate-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg transition-colors duration-200"
                      disabled={isProcessing}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!currentPrompt.trim() || isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Apply Changes
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Lightbulb className="h-4 w-4 inline-block mr-1 mb-1" />{" "}
                    Quick Tips
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Mention section for the modified content</li>
                    <li>• Don&apos;t ask for font or color changes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
