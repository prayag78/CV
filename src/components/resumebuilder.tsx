"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//import { Badge } from "@/components/ui/badge"
import {
  //Brain,
  //Download,
  Eye,
  Code,
  //Save,
  Plus,
  Trash2,
  //ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
//import Link from "next/link"
import { useState } from "react"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
}

interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  gpa: string
  description: string
}

interface Skill {
  id: string
  category: string
  skills: string[]
}

interface ResumeData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
}

interface ResumeBuilderPageProps {
  templateId: string
}

export default function ResumeBuilderPage({ templateId }: ResumeBuilderPageProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [showPreview, setShowPreview] = useState(true)
  const [showLatex, setShowLatex] = useState(false)

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
    },
    experiences: [],
    education: [],
    skills: [],
  })

  // Mock LaTeX code based on resume data
  const generateLatexCode = () => {
    return `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{classic}
\\moderncvcolor{blue}

\\usepackage[scale=0.75]{geometry}

% Personal data
\\name{${resumeData.personalInfo.fullName.split(" ")[0] || "John"}}{${resumeData.personalInfo.fullName.split(" ").slice(1).join(" ") || "Doe"}}
\\title{${resumeData.experiences[0]?.position || "Professional Title"}}
\\address{${resumeData.personalInfo.location || "City, State"}}
\\phone[mobile]{${resumeData.personalInfo.phone || "+1 (555) 123-4567"}}
\\email{${resumeData.personalInfo.email || "john.doe@email.com"}}
\\homepage{${resumeData.personalInfo.website || "www.johndoe.com"}}
\\social[linkedin]{${resumeData.personalInfo.linkedin || "johndoe"}}
\\social[github]{${resumeData.personalInfo.github || "johndoe"}}

\\begin{document}
\\makecvtitle

% Summary
\\section{Summary}
\\cvitem{}{${resumeData.personalInfo.summary || "Professional summary goes here..."}}

% Experience
\\section{Experience}
${resumeData.experiences.map((exp) => `\\cventry{${exp.startDate}--${exp.current ? "Present" : exp.endDate}}{${exp.position}}{${exp.company}}{${exp.location}}{}{${exp.description}}`).join("\n")}

% Education
\\section{Education}
${resumeData.education.map((edu) => `\\cventry{${edu.startDate}--${edu.endDate}}{${edu.degree}}{${edu.institution}}{${edu.location}}{\\textit{${edu.gpa ? "GPA: " + edu.gpa : ""}}}{${edu.description}}`).join("\n")}

% Skills
\\section{Skills}
${resumeData.skills.map((skillGroup) => `\\cvitem{${skillGroup.category}}{${skillGroup.skills.join(", ")}}`).join("\n")}

\\end{document}`
  }

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setResumeData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }))
  }

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    }
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addSkillCategory = () => {
    const newSkillCategory: Skill = {
      id: Date.now().toString(),
      category: "",
      skills: [],
    }
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkillCategory],
    }))
  }

  const removeSkillCategory = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }))
  }

  const updateSkillCategory = (id: string, field: keyof Skill, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)),
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      {/* <nav className="sticky top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/templates">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Templates
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">ResumeAI</span>
            </div>
            <Badge variant="secondary" className="hidden md:block">
              Template: {templateId}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </nav> */}

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - LaTeX Code and Preview */}
        <div className="w-1/2 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Resume Preview</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={showPreview ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setShowPreview(true)
                    setShowLatex(false)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant={showLatex ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setShowLatex(true)
                    setShowPreview(false)
                  }}
                >
                  <Code className="h-4 w-4 mr-2" />
                  LaTeX
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {showPreview && (
              <div className="p-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                  {/* Resume Preview */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center border-b pb-4">
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {resumeData.personalInfo.fullName || "Your Name"}
                      </h1>
                      <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {resumeData.personalInfo.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {resumeData.personalInfo.email}
                          </div>
                        )}
                        {resumeData.personalInfo.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {resumeData.personalInfo.phone}
                          </div>
                        )}
                        {resumeData.personalInfo.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {resumeData.personalInfo.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.personalInfo.summary && (
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Summary</h2>
                        <p className="text-slate-700 dark:text-slate-300">{resumeData.personalInfo.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experiences.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Experience</h2>
                        <div className="space-y-4">
                          {resumeData.experiences.map((exp) => (
                            <div key={exp.id} className="border-l-2 border-emerald-500 pl-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-slate-900 dark:text-white">{exp.position}</h3>
                                  <p className="text-emerald-600 font-medium">{exp.company}</p>
                                  <p className="text-sm text-slate-500">{exp.location}</p>
                                </div>
                                <span className="text-sm text-slate-500">
                                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                </span>
                              </div>
                              {exp.description && (
                                <p className="mt-2 text-slate-700 dark:text-slate-300">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Education</h2>
                        <div className="space-y-4">
                          {resumeData.education.map((edu) => (
                            <div key={edu.id} className="border-l-2 border-blue-500 pl-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-slate-900 dark:text-white">{edu.degree}</h3>
                                  <p className="text-blue-600 font-medium">{edu.institution}</p>
                                  <p className="text-sm text-slate-500">{edu.location}</p>
                                </div>
                                <span className="text-sm text-slate-500">
                                  {edu.startDate} - {edu.endDate}
                                </span>
                              </div>
                              {edu.gpa && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">GPA: {edu.gpa}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Skills</h2>
                        <div className="space-y-2">
                          {resumeData.skills.map((skillGroup) => (
                            <div key={skillGroup.id} className="flex">
                              <span className="font-medium text-slate-900 dark:text-white w-32 flex-shrink-0">
                                {skillGroup.category}:
                              </span>
                              <span className="text-slate-700 dark:text-slate-300">{skillGroup.skills.join(", ")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showLatex && (
              <div className="p-4">
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-auto font-mono">
                  {generateLatexCode()}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Resume Information</h2>
          </div>

          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-4 m-4">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Skills
                </TabsTrigger>
              </TabsList>

              <div className="p-4">
                <TabsContent value="personal" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={resumeData.personalInfo.fullName}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                              }))
                            }
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resumeData.personalInfo.email}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: { ...prev.personalInfo, email: e.target.value },
                              }))
                            }
                            placeholder="john.doe@email.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: { ...prev.personalInfo, phone: e.target.value },
                              }))
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={resumeData.personalInfo.location}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: { ...prev.personalInfo, location: e.target.value },
                              }))
                            }
                            placeholder="City, State"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={resumeData.personalInfo.website}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: { ...prev.personalInfo, website: e.target.value },
                              }))
                            }
                            placeholder="www.johndoe.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={resumeData.personalInfo.linkedin}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: { ...prev.personalInfo, linkedin: e.target.value },
                              }))
                            }
                            placeholder="johndoe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={resumeData.personalInfo.github}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: { ...prev.personalInfo, github: e.target.value },
                              }))
                            }
                            placeholder="johndoe"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          value={resumeData.personalInfo.summary}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, summary: e.target.value },
                            }))
                          }
                          placeholder="Brief professional summary highlighting your key achievements and career objectives..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <Button onClick={addExperience} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>

                  {resumeData.experiences.map((experience, index) => (
                    <Card key={experience.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base">Experience {index + 1}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(experience.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={experience.company}
                              onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                              placeholder="Company Name"
                            />
                          </div>
                          <div>
                            <Label>Position</Label>
                            <Input
                              value={experience.position}
                              onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                              placeholder="Job Title"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={experience.location}
                              onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                              placeholder="City, State"
                            />
                          </div>
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={experience.startDate}
                              onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={experience.endDate}
                              onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                              disabled={experience.current}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`current-${experience.id}`}
                            checked={experience.current}
                            onChange={(e) => updateExperience(experience.id, "current", e.target.checked)}
                          />
                          <Label htmlFor={`current-${experience.id}`}>Currently working here</Label>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={experience.description}
                            onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {resumeData.experiences.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No work experience added yet.</p>
                      <p className="text-sm">Click &quot;Add Experience&quot; to get started.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="education" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button onClick={addEducation} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>

                  {resumeData.education.map((education, index) => (
                    <Card key={education.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base">Education {index + 1}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(education.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Institution</Label>
                            <Input
                              value={education.institution}
                              onChange={(e) => updateEducation(education.id, "institution", e.target.value)}
                              placeholder="University Name"
                            />
                          </div>
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={education.degree}
                              onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                              placeholder="Bachelor of Science"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Field of Study</Label>
                            <Input
                              value={education.field}
                              onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                              placeholder="Computer Science"
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={education.location}
                              onChange={(e) => updateEducation(education.id, "location", e.target.value)}
                              placeholder="City, State"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={education.startDate}
                              onChange={(e) => updateEducation(education.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={education.endDate}
                              onChange={(e) => updateEducation(education.id, "endDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>GPA (Optional)</Label>
                            <Input
                              value={education.gpa}
                              onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                              placeholder="3.8"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description (Optional)</Label>
                          <Textarea
                            value={education.description}
                            onChange={(e) => updateEducation(education.id, "description", e.target.value)}
                            placeholder="Relevant coursework, achievements, honors..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {resumeData.education.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No education added yet.</p>
                      <p className="text-sm">Click &quot;Add Education&quot; to get started.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <Button onClick={addSkillCategory} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>

                  {resumeData.skills.map((skillGroup, index) => (
                    <Card key={skillGroup.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base">Skill Category {index + 1}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => removeSkillCategory(skillGroup.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Category Name</Label>
                          <Input
                            value={skillGroup.category}
                            onChange={(e) => updateSkillCategory(skillGroup.id, "category", e.target.value)}
                            placeholder="e.g., Programming Languages, Tools, etc."
                          />
                        </div>
                        <div>
                          <Label>Skills (comma-separated)</Label>
                          <Textarea
                            value={skillGroup.skills.join(", ")}
                            onChange={(e) =>
                              updateSkillCategory(
                                skillGroup.id,
                                "skills",
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter((s) => s),
                              )
                            }
                            placeholder="JavaScript, Python, React, Node.js"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {resumeData.skills.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No skills added yet.</p>
                      <p className="text-sm">Click &quot;Add Category&quot; to get started.</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
