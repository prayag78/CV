"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Code,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  AlignLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getTemplate } from "@/actions/temp";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resumeStore";
interface PersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

interface Experience {
  id?: string;
  company?: string;
  position?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface Education {
  id?: string;
  institution?: string;
  degree?: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

interface Skill {
  id?: string;
  category?: string;
  skills?: string[];
}

interface Project {
  id?: string;
  name?: string;
  githubLink?: string;
  liveLink?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  skills?: string[];
}

interface Certification {
  id?: string;
  name?: string;
  description?: string;
  link?: string;
  issueDate?: string;
}

interface ResumeData {
  personalInfo?: PersonalInfo;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  positions?: Position[];
  achievements?: Achievements[];
  summary?: Summary;
}

interface Achievements {
  id?: string;
  list?: string[]; //1.Crack Gsoc 2.Solved 1000+ Leetcode
}

interface Summary {
  id?: string;
  summary?: string;
}

interface ResumeBuilderPageProps {
  templateId: string; // required — used to fetch default template
}

interface Template {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
  defaultLatex?: string;
  isPublic?: boolean;
  sections?: string[];
}

interface Position {
  id?: string;
  position?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export default function ResumeBuilderPage({
  templateId,
}: ResumeBuilderPageProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [showPreview, setShowPreview] = useState(true);
  const [showLatex, setShowLatex] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [inputSkills, setInputSkills] = useState<Record<string, string>>({});
  const [inputProjectSkills, setInputProjectSkills] = useState<
    Record<string, string>
  >({});
  const router = useRouter();
  const { latexCode, setLatexCode, pdfUrl, setPdfUrl } = useResumeStore();

  useEffect(() => {
    const fetchTemplate = async () => {
      const template = await getTemplate(templateId);
      setTemplate(template as Template);
    };
    fetchTemplate();
  }, [templateId]);

  //console.log("template sections", template?.sections);

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    positions: [],
    achievements: [],
    summary: {
      id: "",
      summary: "",
    },
  });

  //const [submittedData, setSubmittedData] = useState<ResumeData | null>(null);
  //const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

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
    };
    setResumeData((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExperience],
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((exp) => exp.id !== id),
    }));
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: string | boolean
  ) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

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
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...(prev.education || []), newEducation],
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((edu) => edu.id !== id),
    }));
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      education: (prev.education || []).map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addSkillCategory = () => {
    const newSkillCategory: Skill = {
      id: Date.now().toString(),
      category: "",
      skills: [],
    };
    setResumeData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), newSkillCategory],
    }));
  };

  const removeSkillCategory = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((skill) => skill.id !== id),
    }));
  };

  const updateSkillCategory = (
    id: string,
    field: keyof Skill,
    value: string | string[]
  ) => {
    setResumeData((prev) => ({
      ...prev,
      skills: (prev.skills || []).map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      githubLink: "",
      liveLink: "",
      description: "",
      startDate: "",
      endDate: "",
    };

    setResumeData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProject],
    }));
  };

  const removeProjects = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((project) => project.id !== id),
    }));
  };

  const updateProject = (
    id: string,
    field: keyof Project,
    value: string | string[] | boolean
  ) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(), // Unique ID (timestamp-based)
      name: "",
      description: "",
      link: "",
      issueDate: "",
    };

    setResumeData((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCert],
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter(
        (cert) => cert.id !== id
      ),
    }));
  };

  const updateCertification = (
    id: string,
    field: keyof Certification,
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  };

  const addPosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };

    setResumeData((prev) => ({
      ...prev,
      positions: [...(prev.positions || []), newPosition],
    }));
  };

  const removePosition = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      positions: (prev.positions || []).filter((pos) => pos.id !== id),
    }));
  };

  const updatePosition = (
    id: string,
    field: keyof Position,
    value: string | boolean
  ) => {
    setResumeData((prev) => ({
      ...prev,
      positions: (prev.positions || []).map((pos) =>
        pos.id === id ? { ...pos, [field]: value } : pos
      ),
    }));
  };

  const addAchievement = () => {
    const newAchievement: Achievements = {
      id: Date.now().toString(),
      list: [""], // Start with an empty string as a placeholder
    };

    setResumeData((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), newAchievement],
    }));
  };

  const removeAchievement = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((ach) => ach.id !== id),
    }));
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).map((ach) =>
        ach.id === id
          ? {
              ...ach,
              list:
                ach.list?.map((item, i) => (i === index ? value : item)) || [],
            }
          : ach
      ),
    }));
  };

  const addAchievementItem = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).map((ach) =>
        ach.id === id
          ? {
              ...ach,
              list: [...(ach.list || []), ""],
            }
          : ach
      ),
    }));
  };

  const removeAchievementItem = (id: string, index: number) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).map((ach) =>
        ach.id === id
          ? {
              ...ach,
              list: (ach.list || []).filter((_, i) => i !== index),
            }
          : ach
      ),
    }));
  };

  const addSummary = () => {
    const newSummary: Summary = {
      id: Date.now().toString(),
      summary: "",
    };

    setResumeData((prev) => ({
      ...prev,
      summary: newSummary,
    }));
  };

  const updateSummary = (value: string) => {
    setResumeData((prev) => ({
      ...prev,
      summary: {
        ...prev.summary,
        summary: value,
      },
    }));
  };

  const removeSummary = () => {
    setResumeData((prev) => ({
      ...prev,
      summary: undefined,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        template: template?.defaultLatex,
        userData: resumeData,
      };

      const res = await fetch("/api/generate-resume", {
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
      }
    } catch (error) {
      toast.error("Generation failed");
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
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

  const handleEdit = () => {
    //console.log("latexCode", latexCode);
    router.push("/edit");
  };

  return (
    <div className="h-100vh bg-slate-50 dark:bg-slate-900 overflow-y-auto mb-10 pt-4">
      <div className="flex flex-col md:flex-row h-[100vh]">
        {/* Left Panel - LaTeX Code and Preview */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-col min-h-[60vh] max-h-[80vh] md:max-h-none">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {template?.name}
              </h2>
              <div className="flex items-center space-x-2">
                {pdfUrl && (
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="text-sm px-3 py-1.5 lg:text-base lg:px-5 lg:py-2.5"
                  >
                    Download
                  </Button>
                )}

                <Button
                  variant={showPreview ? "default" : "outline"}
                  className="text-sm px-3 py-1.5 lg:text-base lg:px-5 lg:py-2.5"
                  onClick={() => {
                    setShowPreview(true);
                    setShowLatex(false);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>

                <Button
                  variant={showLatex ? "default" : "outline"}
                  className="text-sm px-3 py-1.5 lg:text-base lg:px-5 lg:py-2.5"
                  onClick={() => {
                    setShowLatex(true);
                    setShowPreview(false);
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
              <div className="p-2 md:p-6">
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-[400px] md:h-[600px] border rounded"
                    title="PDF Preview"
                  />
                ) : (
                  <Image
                    src={template?.thumbnailUrl || "/image.png"}
                    alt={template?.name || "Template Preview"}
                    width={1000}
                    height={1000}
                    className="rounded border"
                  />
                )}
              </div>
            )}

            {showLatex && (
              <div className="p-2 md:p-4">
                <pre className="bg-slate-900 text-green-400 p-2 md:p-4 rounded-lg text-xs md:text-sm overflow-auto font-mono whitespace-pre-wrap">
                  {template?.defaultLatex}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Resume Information
            </h2>
            <div className="flex justify-center items-center">
              {isLoading ? (
                <Button
                  disabled
                  className="w-full cursor-pointer text-sm px-3 py-1.5 lg:text-base lg:px-5 lg:py-2.5"
                >
                  Generating...
                </Button>
              ) : latexCode ? (
                <Button
                  onClick={handleEdit}
                  className="w-full cursor-pointer text-sm px-3 py-1.5 lg:text-base lg:px-5 lg:py-2.5"
                >
                  Edit with AI
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="w-full cursor-pointer text-sm px-3 py-1.5 lg:text-base lg:px-5 lg:py-2.5"
                >
                  Generate Resume
                </Button>
              )}
            </div>
          </div>

          <div className="w-full mt-4 overflow-scroll p-0.5">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="p-1"
            >
              <div className="w-full overflow-x-auto">
                <TabsList className="flex md:grid md:grid-cols-4 md:m-4 md:h-25 mb-1 md:gap-0 p-2 space-x-2">
                  {template?.sections?.includes("personal") && (
                    <TabsTrigger
                      value="personal"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <User className="h-4 w-4" />
                      Personal
                    </TabsTrigger>
                  )}
                  {template?.sections?.includes("experience") && (
                    <TabsTrigger
                      value="experience"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <Briefcase className="h-4 w-4" />
                      Experience
                    </TabsTrigger>
                  )}
                  {template?.sections?.includes("education") && (
                    <TabsTrigger
                      value="education"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </TabsTrigger>
                  )}
                  {template?.sections?.includes("skills") && (
                    <TabsTrigger
                      value="skills"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <Award className="h-4 w-4" />
                      Skills
                    </TabsTrigger>
                  )}
                  {template?.sections?.includes("projects") && (
                    <TabsTrigger
                      value="projects"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <Code className="h-4 w-4" />
                      Projects
                    </TabsTrigger>
                  )}
                  {template?.sections?.includes("certifications") && (
                    <TabsTrigger
                      value="certifications"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <Award className="h-4 w-4" />
                      Certifications
                    </TabsTrigger>
                  )}
                  {template?.sections?.includes("positions") && (
                    <TabsTrigger
                      value="positions"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <Briefcase className="h-4 w-4" />
                      Positions/Leadership
                    </TabsTrigger>
                  )}
                  {template?.sections?.includes("achievements") && (
                    <TabsTrigger
                      value="achievements"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <Award className="h-4 w-4" />
                      Achievements
                    </TabsTrigger>
                  )}
                  {template?.sections?.includes("summary") && (
                    <TabsTrigger
                      value="summary"
                      className="flex items-center gap-2 justify-center min-h-10 p-1"
                    >
                      <AlignLeft className="h-4 w-4" />
                      Summary
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <div className="p-1">
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
                            value={resumeData.personalInfo?.fullName || ""}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  fullName: e.target.value,
                                },
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
                            value={resumeData.personalInfo?.email || ""}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  email: e.target.value,
                                },
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
                            value={resumeData.personalInfo?.phone || ""}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  phone: e.target.value,
                                },
                              }))
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={resumeData.personalInfo?.location || ""}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  location: e.target.value,
                                },
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
                            value={resumeData.personalInfo?.website || ""}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  website: e.target.value,
                                },
                              }))
                            }
                            placeholder="www.johndoe.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={resumeData.personalInfo?.linkedin || ""}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  linkedin: e.target.value,
                                },
                              }))
                            }
                            placeholder="johndoe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={resumeData.personalInfo?.github || ""}
                            onChange={(e) =>
                              setResumeData((prev) => ({
                                ...prev,
                                personalInfo: {
                                  ...prev.personalInfo,
                                  github: e.target.value,
                                },
                              }))
                            }
                            placeholder="johndoe"
                          />
                        </div>
                      </div>
                      {/* <div>
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          value={resumeData.personalInfo?.summary || ""}
                          onChange={(e) =>
                            setResumeData((prev) => ({
                              ...prev,
                              personalInfo: {
                                ...prev.personalInfo,
                                summary: e.target.value,
                              },
                            }))
                          }
                          placeholder="Brief professional summary highlighting your key achievements and career objectives..."
                          rows={4}
                        />
                      </div> */}
                    </CardContent>
                  </Card>
                </TabsContent>

                {template?.sections?.includes("education") && (
                  <TabsContent value="education" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Education</h3>
                      <Button onClick={addEducation} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>

                    {resumeData.education?.map((education, index) => (
                      <Card key={education.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base">
                            Education {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(education.id || "")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Institution</Label>
                              <Input
                                value={education.institution || ""}
                                onChange={(e) =>
                                  updateEducation(
                                    education.id || "",
                                    "institution",
                                    e.target.value
                                  )
                                }
                                placeholder="University Name"
                              />
                            </div>
                            <div>
                              <Label>Degree</Label>
                              <Input
                                value={education.degree || ""}
                                onChange={(e) =>
                                  updateEducation(
                                    education.id || "",
                                    "degree",
                                    e.target.value
                                  )
                                }
                                placeholder="Bachelor of Science"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Field of Study</Label>
                              <Input
                                value={education.field || ""}
                                onChange={(e) =>
                                  updateEducation(
                                    education.id || "",
                                    "field",
                                    e.target.value
                                  )
                                }
                                placeholder="Computer Science"
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={education.location || ""}
                                onChange={(e) =>
                                  updateEducation(
                                    education.id || "",
                                    "location",
                                    e.target.value
                                  )
                                }
                                placeholder="City, State"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="month"
                                value={education.startDate || ""}
                                onChange={(e) =>
                                  updateEducation(
                                    education.id || "",
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                value={education.endDate || ""}
                                onChange={(e) =>
                                  updateEducation(
                                    education.id || "",
                                    "endDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>GPA (Optional)</Label>
                              <Input
                                value={education.gpa || ""}
                                onChange={(e) =>
                                  updateEducation(
                                    education.id || "",
                                    "gpa",
                                    e.target.value
                                  )
                                }
                                placeholder="3.8"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description (Optional)</Label>
                            <Textarea
                              value={education.description || ""}
                              onChange={(e) =>
                                updateEducation(
                                  education.id || "",
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Relevant coursework, achievements, honors..."
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {resumeData.education?.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No education added yet.</p>
                        <p className="text-sm">
                          Click &quot;Add Education&quot; to get started.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                )}

                {template?.sections?.includes("experience") && (
                  <TabsContent value="experience" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Work Experience</h3>
                      <Button onClick={addExperience} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>

                    {resumeData.experiences?.map((experience, index) => (
                      <Card key={experience.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base">
                            Experience {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeExperience(experience.id || "")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Company</Label>
                              <Input
                                value={experience.company || ""}
                                onChange={(e) =>
                                  updateExperience(
                                    experience.id || "",
                                    "company",
                                    e.target.value
                                  )
                                }
                                placeholder="Company Name"
                              />
                            </div>
                            <div>
                              <Label>Position</Label>
                              <Input
                                value={experience.position || ""}
                                onChange={(e) =>
                                  updateExperience(
                                    experience.id || "",
                                    "position",
                                    e.target.value
                                  )
                                }
                                placeholder="Job Title"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={experience.location || ""}
                                onChange={(e) =>
                                  updateExperience(
                                    experience.id || "",
                                    "location",
                                    e.target.value
                                  )
                                }
                                placeholder="City, State"
                              />
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="month"
                                value={experience.startDate || ""}
                                onChange={(e) =>
                                  updateExperience(
                                    experience.id || "",
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                value={experience.endDate || ""}
                                onChange={(e) =>
                                  updateExperience(
                                    experience.id || "",
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                disabled={experience.current}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-${experience.id}`}
                              checked={experience.current}
                              onChange={(e) =>
                                updateExperience(
                                  experience.id || "",
                                  "current",
                                  e.target.checked
                                )
                              }
                            />
                            <Label htmlFor={`current-${experience.id}`}>
                              Currently working here
                            </Label>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={experience.description || ""}
                              onChange={(e) =>
                                updateExperience(
                                  experience.id || "",
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe your responsibilities and achievements..."
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {resumeData.experiences?.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No work experience added yet.</p>
                        <p className="text-sm">
                          Click &quot;Add Experience&quot; to get started.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                )}

                {template?.sections?.includes("projects") && (
                  <TabsContent value="projects" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Projects</h3>
                      <Button onClick={addProject} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </div>

                    {resumeData.projects?.map((project, index) => (
                      <Card key={project.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base">
                            Project {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProjects(project.id || "")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Project Name</Label>
                              <Input
                                value={project.name || ""}
                                onChange={(e) =>
                                  updateProject(
                                    project.id || "",
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="My Cool Project"
                              />
                            </div>
                            <div>
                              <Label>GitHub Link</Label>
                              <Input
                                value={project.githubLink || ""}
                                onChange={(e) =>
                                  updateProject(
                                    project.id || "",
                                    "githubLink",
                                    e.target.value
                                  )
                                }
                                placeholder="https://github.com/username/project"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Tech Stack / Skills</Label>
                              <Input
                                value={
                                  inputProjectSkills[project.id || ""] ??
                                  (project.skills?.join(", ") || "")
                                }
                                onChange={(e) => {
                                  setInputProjectSkills((prev) => ({
                                    ...prev,
                                    [project.id || ""]: e.target.value,
                                  }));
                                }}
                                onBlur={() => {
                                  const parsed = (
                                    inputProjectSkills[project.id || ""] || ""
                                  )
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter((s) => s);

                                  updateProject(
                                    project.id || "",
                                    "skills",
                                    parsed
                                  );
                                }}
                                placeholder="React, Tailwind, Node.js"
                                //rows={2}
                              />
                            </div>
                            <div>
                              <Label>Live Link</Label>
                              <Input
                                value={project.liveLink || ""}
                                onChange={(e) =>
                                  updateProject(
                                    project.id || "",
                                    "liveLink",
                                    e.target.value
                                  )
                                }
                                placeholder="https://project-live.com"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="month"
                                value={project.startDate || ""}
                                onChange={(e) =>
                                  updateProject(
                                    project.id || "",
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                value={project.endDate || ""}
                                onChange={(e) =>
                                  updateProject(
                                    project.id || "",
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                disabled={project.current}
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-project-${project.id}`}
                              checked={project.current || false}
                              onChange={(e) =>
                                updateProject(
                                  project.id || "",
                                  "current",
                                  e.target.checked
                                )
                              }
                            />
                            <Label htmlFor={`current-project-${project.id}`}>
                              Currently working on this project
                            </Label>
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={project.description || ""}
                              onChange={(e) =>
                                updateProject(
                                  project.id || "",
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="What problem does it solve, how was it built, and what were the results..."
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {resumeData.projects?.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No projects added yet.</p>
                        <p className="text-sm">
                          Click &quot;Add Project&quot; to get started.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                )}

                {template?.sections?.includes("skills") && (
                  <TabsContent value="skills" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Skills</h3>
                      <Button onClick={addSkillCategory} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>

                    {resumeData.skills?.map((skillGroup, index) => (
                      <Card key={skillGroup.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base">
                            Skill Category {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeSkillCategory(skillGroup.id || "")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Category Name</Label>
                            <Input
                              value={skillGroup.category || ""}
                              onChange={(e) =>
                                updateSkillCategory(
                                  skillGroup.id || "",
                                  "category",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Programming Languages, Tools, etc."
                            />
                          </div>
                          <div>
                            <Label>Skills (comma-separated)</Label>
                            <Textarea
                              value={
                                inputSkills[skillGroup.id || ""] ??
                                (skillGroup.skills?.join(", ") || "")
                              }
                              onChange={(e) => {
                                setInputSkills((prev) => ({
                                  ...prev,
                                  [skillGroup.id || ""]: e.target.value,
                                }));
                              }}
                              onBlur={() => {
                                const parsed = (
                                  inputSkills[skillGroup.id || ""] || ""
                                )
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter((s) => s);
                                updateSkillCategory(
                                  skillGroup.id || "",
                                  "skills",
                                  parsed
                                );
                              }}
                              placeholder="JavaScript, Python, React, Node.js"
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {resumeData.skills?.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No skills added yet.</p>
                        <p className="text-sm">
                          Click &quot;Add Category&quot; to get started.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                )}

                {template?.sections?.includes("certifications") && (
                  <TabsContent value="certifications" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Certifications</h3>
                      <Button onClick={addCertification} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>

                    {resumeData.certifications?.map((cert, index) => (
                      <Card key={cert.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base">
                            Certification {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCertification(cert.id || "")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Certificate Name</Label>
                              <Input
                                value={cert.name || ""}
                                onChange={(e) =>
                                  updateCertification(
                                    cert.id || "",
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. AWS Certified Developer"
                              />
                            </div>
                            <div>
                              <Label>Issue Date</Label>
                              <Input
                                type="month"
                                value={cert.issueDate || ""}
                                onChange={(e) =>
                                  updateCertification(
                                    cert.id || "",
                                    "issueDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={cert.description || ""}
                              onChange={(e) =>
                                updateCertification(
                                  cert.id || "",
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Brief summary of what the certification covers..."
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label>Certificate Link</Label>
                            <Input
                              value={cert.link || ""}
                              onChange={(e) =>
                                updateCertification(
                                  cert.id || "",
                                  "link",
                                  e.target.value
                                )
                              }
                              placeholder="https://example.com/cert"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {resumeData.certifications?.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No certifications added yet.</p>
                        <p className="text-sm">
                          Click &quot;Add Certification&quot; to get started.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                )}

                {template?.sections?.includes("positions") && (
                  <TabsContent value="positions" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Positions/Leadership
                      </h3>
                      <Button onClick={addPosition} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Position
                      </Button>
                    </div>

                    {resumeData.positions?.map((position, index) => (
                      <Card key={position.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base">
                            Position {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePosition(position.id || "")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Position</Label>
                              <Input
                                value={position.position || ""}
                                onChange={(e) =>
                                  updatePosition(
                                    position.id || "",
                                    "position",
                                    e.target.value
                                  )
                                }
                                placeholder="Job Title"
                              />
                            </div>
                            <div>
                              <Label>Company</Label>
                              <Input
                                value={position.company || ""}
                                onChange={(e) =>
                                  updatePosition(
                                    position.id || "",
                                    "company",
                                    e.target.value
                                  )
                                }
                                placeholder="Company Name"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={position.location || ""}
                                onChange={(e) =>
                                  updatePosition(
                                    position.id || "",
                                    "location",
                                    e.target.value
                                  )
                                }
                                placeholder="City, State"
                              />
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="month"
                                value={position.startDate || ""}
                                onChange={(e) =>
                                  updatePosition(
                                    position.id || "",
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                value={position.endDate || ""}
                                onChange={(e) =>
                                  updatePosition(
                                    position.id || "",
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                disabled={position.current}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-${position.id}`}
                              checked={position.current}
                              onChange={(e) =>
                                updatePosition(
                                  position.id || "",
                                  "current",
                                  e.target.checked
                                )
                              }
                            />
                            <Label htmlFor={`current-${position.id}`}>
                              Currently working here
                            </Label>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={position.description || ""}
                              onChange={(e) =>
                                updatePosition(
                                  position.id || "",
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe your role and responsibilities..."
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {resumeData.positions?.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No positions added yet.</p>
                        <p className="text-sm">
                          Click &quot;Add Position&quot; to get started.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                )}

                {template?.sections?.includes("achievements") && (
                  <TabsContent value="achievements" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Achievements</h3>
                      <Button onClick={addAchievement} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>

                    {resumeData.achievements?.map((achievement, index) => (
                      <Card key={achievement.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base">
                            Achievement Group {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeAchievement(achievement.id || "")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {achievement.list?.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Input
                                value={item}
                                onChange={(e) =>
                                  updateAchievement(
                                    achievement.id || "",
                                    i,
                                    e.target.value
                                  )
                                }
                                placeholder={`Achievement ${i + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeAchievementItem(achievement.id || "", i)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addAchievementItem(achievement.id || "")
                            }
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add More
                          </Button>
                        </CardContent>
                      </Card>
                    ))}

                    {resumeData.achievements?.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No achievements added yet.</p>
                        <p className="text-sm">
                          Click &quot;Add Achievement&quot; to get started.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                )}

                {template?.sections?.includes("summary") && (
                  <TabsContent value="summary" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Professional Summary
                      </h3>
                      {resumeData.summary ? (
                        <Button
                          onClick={removeSummary}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Summary
                        </Button>
                      ) : (
                        <Button onClick={addSummary} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Summary
                        </Button>
                      )}
                    </div>

                    {resumeData.summary && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            rows={5}
                            placeholder="Briefly describe your background, skills, and goals..."
                            value={resumeData.summary.summary || ""}
                            onChange={(e) => updateSummary(e.target.value)}
                          />
                        </CardContent>
                      </Card>
                    )}

                    {!resumeData.summary && (
                      <div className="text-center py-8 text-slate-500">
                        <AlignLeft className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No summary added yet.</p>
                        <p className="text-sm">
                          Click &quot;Add Summary&quot; to get started.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
