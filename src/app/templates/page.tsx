"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  defaultLatex: string;
  isPublic: boolean;
  sections: string[];
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch("/api/get-templates");
      const data = await res.json();
      setTemplates(data);
    };
    fetchTemplates();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const filteredTemplates = templates.filter((template: Template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
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
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                        src={template.thumbnailUrl}
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
                        {/* <Badge
                          className={`text-white text-xs ${
                            template.isPublic
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                          }`}
                        >
                          {template.isPublic ? "Free" : "Premium"}
                        </Badge> */}
                      </div>
                    </div>
                    <Link href={`/templates/${template.name}`}>
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
    </div>
  );
}
