


"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Download,
  Briefcase,
  GraduationCap,
  Code2,
  Sparkles,
} from "lucide-react";
import { cvData } from "@/data/cvData";

// Animation Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

export default function ResumePage() {
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:p-0 print:text-black">
      {/* Top Floating Download Bar (Hidden during PDF print) */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mb-6 flex max-w-4xl justify-end print:hidden"
      >
        <button
          onClick={handleDownloadPDF}
          className="group flex transform cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-95"
        >
          <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
          <span>Download PDF Resume</span>
        </button>
      </motion.div>

      {/* Main CV Container Card */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-sky-100 bg-white text-slate-800 shadow-2xl print:rounded-none print:border-none print:shadow-none"
      >
        {/* ================= HEADER SECTION ================= */}
        <motion.header
          variants={itemVariants}
          className="relative overflow-hidden bg-linear-to-r from-sky-600 via-sky-500 to-sky-700 p-8 text-white sm:p-10"
        >
          {/* Subtle Orange Accent Circle */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-500/30 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase shadow-sm">
                <Sparkles className="h-3.5 w-3.5" /> Available for Hire
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {cvData.name}
              </h1>
              <h2 className="mt-1 text-lg font-medium text-sky-100 sm:text-xl">
                {cvData.title}
              </h2>
            </div>
          </div>

          {/* Contact & Main Links Bar */}
          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-sky-400/50 pt-6 text-sm text-sky-50 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={`mailto:${cvData.email}`}
              className="flex items-center gap-2 transition-colors hover:text-orange-300"
            >
              <Mail className="h-4 w-4 shrink-0 text-orange-400" />
              <span className="truncate">{cvData.email}</span>
            </a>
            <a
              href={`tel:${cvData.phone}`}
              className="flex items-center gap-2 transition-colors hover:text-orange-300"
            >
              <Phone className="h-4 w-4 shrink-0 text-orange-400" />
              <span>{cvData.phone}</span>
            </a>
            <a
              href={cvData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-orange-300"
            >
              <GitBranch className="h-4 w-4 shrink-0 text-orange-400" />
              <span className="truncate">GitHub Profile</span>
            </a>
            <a
              href={cvData.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-orange-300"
            >
              <Globe className="h-4 w-4 shrink-0 text-orange-400" />
              <span className="truncate">Live Portfolio</span>
            </a>
          </div>
        </motion.header>

        {/* ================= BODY CONTENT ================= */}
        <div className="space-y-8 p-8 sm:p-10">
          {/* Summary Section */}
          <motion.section variants={itemVariants} className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-sky-700 uppercase">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Professional Summary
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              {cvData.summary}
            </p>
          </motion.section>

          {/* Technical Skills Matrix */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-sky-700 uppercase">
              <Code2 className="h-4 w-4 text-orange-500" />
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cvData.skills.map((group) => (
                <div 
                  key={group.category}
                  className="rounded-xl border border-sky-100 bg-sky-50/70 p-4 transition-colors hover:border-sky-300"
                >
                  <span className="text-xs font-bold tracking-wide text-sky-800 uppercase">
                    {group.category}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Featured Projects (5 Vercel Links) */}
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-sky-700 uppercase">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Featured Projects (5 Live Vercel Deployments)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {cvData.projects.map((project) => (
                <motion.div
                  key={project.title}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="group space-y-2 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-400 hover:shadow-md"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                      {project.title}
                    </h4>
                    
                    {/* Live Links */}
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-orange-600 transition-colors hover:bg-orange-100 hover:text-orange-700"
                      >
                        <span>Vercel Live</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-sky-700 transition-colors hover:bg-sky-100 hover:text-sky-800"
                      >
                        <span>GitHub</span>
                        <GitBranch className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Work Experience */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-sky-700 uppercase">
              <Briefcase className="h-4 w-4 text-orange-500" />
              Experience & Internships
            </h3>

            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <div key={exp.company} className="space-y-1 border-l-2 border-sky-200 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-bold text-slate-900">{exp.role} · <span className="text-sky-600">{exp.company}</span></span>
                    <span className="text-xs font-medium text-slate-500">{exp.period} | {exp.location}</span>
                  </div>
                  <ul className="list-inside list-disc space-y-1 pt-1 text-sm text-slate-600">
                    {exp.achievements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Education Section */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-sky-700 uppercase">
              <GraduationCap className="h-4 w-4 text-orange-500" />
              Education & Certifications
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cvData.education.map((edu) => (
                <div key={edu.degree} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm font-bold text-slate-800">{edu.degree}</div>
                  <div className="text-xs font-medium text-sky-700">{edu.institution}</div>
                  <div className="mt-1 text-xs text-slate-500">{edu.year}</div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
}