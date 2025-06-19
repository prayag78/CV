"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Brain,
  Search,
  Filter,
  Plus,
  Briefcase,
  Code,
  Palette,
  GraduationCap,
  Building,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  isPro: boolean;
  color: string;
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates: Template[] = [
    {
      id: "1",
      name: "Modern Minimal",
      category: "modern",
      preview: "/image.png",
      isPro: false,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "2",
      name: "Executive Pro",
      category: "professional",
      preview: "/placeholder.svg?height=400&width=300",
      isPro: true,
      color: "from-slate-600 to-slate-800",
    },
    {
      id: "3",
      name: "Creative Designer",
      category: "creative",
      preview: "/placeholder.svg?height=400&width=300",
      isPro: true,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "4",
      name: "Classic Traditional",
      category: "traditional",
      preview: "/placeholder.svg?height=400&width=300",
      isPro: false,
      color: "from-emerald-600 to-teal-600",
    },
    {
      id: "5",
      name: "Tech Developer",
      category: "modern",
      preview: "/placeholder.svg?height=400&width=300",
      isPro: true,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "6",
      name: "Academic Scholar",
      category: "academic",
      preview: "/placeholder.svg?height=400&width=300",
      isPro: false,
      color: "from-indigo-500 to-blue-600",
    },
    {
      id: "7",
      name: "Startup Founder",
      category: "modern",
      preview: "/placeholder.svg?height=400&width=300",
      isPro: true,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "8",
      name: "Healthcare Professional",
      category: "professional",
      preview: "/placeholder.svg?height=400&width=300",
      isPro: false,
      color: "from-teal-500 to-cyan-500",
    },
    {
      id: "9",
      name: "Marketing Specialist",
      category: "creative",
      preview: "/placeholder.svg?height=400&width=300",
      isPro: true,
      color: "from-pink-500 to-rose-500",
    },
  ];

  const categories = [
    { value: "all", label: "All Templates", icon: null },
    { value: "modern", label: "Modern", icon: Code },
    { value: "professional", label: "Professional", icon: Briefcase },
    { value: "creative", label: "Creative", icon: Palette },
    { value: "traditional", label: "Traditional", icon: Building },
    { value: "academic", label: "Academic", icon: GraduationCap },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Resume Template
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Browse our collection of professionally designed, ATS-friendly
            resume templates.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-4 mb-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Category:
              </span>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Templates" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        {cat.icon && <cat.icon className="h-4 w-4" />}
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                No templates found
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Try adjusting your search terms or category filter
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
                >
                  <div className="p-2">
                    <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 overflow-hidden border">
                      <Image
                        src={template.preview}
                        alt={template.name}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                          {template.name}
                        </h3>
                        <Badge
                          className={`text-white text-xs ${
                            template.isPro
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                          }`}
                        >
                          {template.isPro ? "Premium" : "Free"}
                        </Badge>
                      </div>
                    </div>
                    <Link href={`/templates/${template.id}`}>
                      <Button className="w-full group-hover:shadow-lg transition-shadow duration-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Use This Template
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Can&apos;t Find the Perfect Template?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Our AI can help you create a custom template based on your industry,
            experience level, and personal preferences.
          </p>
          <Button size="lg" className="px-8 py-4" asChild>
            <Link href="/custom">
              <Brain className="h-5 w-5 mr-2" />
              Create Custom Template
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
