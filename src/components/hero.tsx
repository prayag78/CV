"use client";

import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function hero() {
  return (
    <div className="mt-20 flex items-center justify-center px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 px-4 py-2 text-sm font-medium">
            🚀 Powered by Advanced AI Technology
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Build Your Resume
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              with AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate professional, ATS-friendly resumes in seconds. Let AI craft
            the perfect resume that gets you hired.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/dashboard">
                Get Started Free
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
              asChild
            >
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </div>
  );
}
