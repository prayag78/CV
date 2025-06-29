"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Upload,
  FileText,
  Code,
  ImageIcon,
  CheckCircle,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "react-hot-toast";

interface TemplateSection {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

interface CreateTemplateData {
  name: string;
  latexCode: string;
  sections: string[];
  isPublic: boolean;
  thumbnailImage: File | null;
  thumbnailPreview: string | null;
}

export default function CreateTemplatePage() {
  const [templateData, setTemplateData] = useState<CreateTemplateData>({
    name: "",
    latexCode: "",
    sections: [],
    isPublic: true,
    thumbnailImage: null,
    thumbnailPreview: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSections: TemplateSection[] = [
    {
      id: "personal",
      name: "Personal Information",
      description: "Name, contact details, summary",
      required: false,
    },
    {
      id: "summary",
      name: "Summary",
      description: "Summary of your work experience, education, and skills",
      required: false,
    },
    {
      id: "experience",
      name: "Experience",
      description: "Professional work history",
      required: false,
    },
    {
      id: "education",
      name: "Education",
      description: "Academic background",
      required: false,
    },
    {
      id: "skills",
      name: "Skills",
      description: "Technical and soft skills",
      required: false,
    },
    {
      id: "projects",
      name: "Projects",
      description: "Personal and professional projects",
      required: false,
    },
    {
      id: "certifications",
      name: "Certifications",
      description: "Professional certifications",
      required: false,
    },
    {
      id: "achievements",
      name: "Achievements",
      description: "Achievements and awards",
      required: false,
    },
    {
      id: "positions",
      name: "Positions",
      description: "Positions and responsibilities",
      required: false,
    },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        thumbnailImage: "Image size must be less than 5MB",
      }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        thumbnailImage: "Please select a valid image file",
      }));
      return;
    }

    // Read file as Base64 for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setTemplateData((prev) => ({
        ...prev,
        thumbnailImage: file,
        thumbnailPreview: e.target?.result as string,
      }));
      setErrors((prev) => ({ ...prev, thumbnailImage: "" }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setTemplateData((prev) => ({
      ...prev,
      thumbnailImage: null,
      thumbnailPreview: null,
    }));

    // Clear the file input value to allow re-upload of same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    setTemplateData((prev) => ({
      ...prev,
      sections: checked
        ? [...prev.sections, sectionId]
        : prev.sections.filter((id) => id !== sectionId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrl = "";

      if (templateData.thumbnailImage) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

        if (!cloudName || !preset) {
          toast.error("Cloudinary setup missing");
          return;
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const formData = new FormData();
        formData.append("file", templateData.thumbnailImage);
        formData.append("upload_preset", preset);
        formData.append("folder", "template_thumbnails");

        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const data = await uploadRes.json();

        if (!uploadRes.ok || !data.secure_url) {
          throw new Error(data.error?.message || "Image upload failed");
        }

        uploadedImageUrl = data.secure_url;
      }

      //console.log(templateData);

      // Step 2: Send everything to your API
      const res = await fetch("/api/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateData.name,
          defaultLatex: templateData.latexCode,
          isPublic: templateData.isPublic,
          thumbnailUrl: uploadedImageUrl,
          sections: templateData.sections,
        }),
      });

      if (!res.ok) throw new Error("Failed to save template");

      toast.success("Template created successfully!");
      // Optionally reset form or redirect
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      templateData.name = "";
      templateData.latexCode = "";
      templateData.sections = [];
      templateData.isPublic = true;
      templateData.thumbnailImage = null;
      templateData.thumbnailPreview = null;
      setErrors({});
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Create New
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Resume Template
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Design a new resume template with custom LaTeX code and configurable
            sections
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className={`grid ${"lg:grid-cols-1"} gap-8`}>
          {/* Form Section */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="templateName">Template Name *</Label>
                    <Input
                      id="templateName"
                      value={templateData.name}
                      onChange={(e) =>
                        setTemplateData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g., Modern Professional, Creative Designer"
                      className={errors.name ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Label htmlFor="isPublic">Public Template</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Make this template available to all users
                      </p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={templateData.isPublic}
                      onCheckedChange={(checked: boolean) =>
                        setTemplateData((prev) => ({
                          ...prev,
                          isPublic: checked,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Thumbnail Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Thumbnail Image *
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
                    {templateData.thumbnailPreview ? (
                      <div className="flex items-center justify-between">
                        <div className="text-slate-700 dark:text-slate-300 text-sm">
                          <span className="font-medium">Selected:</span>{" "}
                          {templateData.thumbnailImage?.name}
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          Upload a thumbnail image for your template
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                          PNG, JPG up to 5MB. Recommended size: 300x400px
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </Button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Template Sections *
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Select which sections this template will support
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {availableSections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <Checkbox
                          id={section.id}
                          checked={templateData.sections.includes(section.id)}
                          onCheckedChange={(checked: boolean) =>
                            handleSectionToggle(section.id, checked as boolean)
                          }
                          disabled={section.required}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={section.id} className="font-medium">
                              {section.name}
                            </Label>
                            {section.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* LaTeX Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    LaTeX Template Code *
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Enter the LaTeX code for your resume template
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      value={templateData.latexCode}
                      onChange={(e) =>
                        setTemplateData((prev) => ({
                          ...prev,
                          latexCode: e.target.value,
                        }))
                      }
                      placeholder="Enter your LaTeX template code here..."
                      rows={20}
                      className={`font-mono text-sm ${
                        errors.latexCode ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <div className="flex items-center space-x-2"></div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Template
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
