


import { CVData } from "@/types/cv";

export const cvData: CVData = {
  name: "Joseph Elijah Isaiah",
  title: "Junior Frontend Developer",
  tagline: "Building responsive, high-performance web applications with Next.js, React & TypeScript.",
  email: "isaiaheli224@gmail.com",
  phone: "+234-913-176-6494",
  github: "https://github.com/Truth123-dev",
  portfolio: "https://my-react-project-c43xwcyvk-elijahvision-s-projects.vercel.app",
  location: "Ready to play code / Open to any...",
  summary:
    "Enthusiastic and detail-driven Junior Frontend Developer with hands-on experience in building pixel-perfect, accessible, and fast web applications using React, Next.js, TypeScript, and Tailwind CSS. Passionate about UI/UX performance, clean code architecture, and modern animation workflows.",
  skills: [
    {
      category: "Frontend Core",
      skills: ["React 19","Tailwinds", "Next.js 15 (App Router)", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3 / Sass"],
    },
    {
      category: "Styling & UI",
      skills: ["Tailwind CSS", "Framer Motion", "Shadcn UI", "Responsive Design", "CSS Grid & Flexbox"],
    },
    {
      category: "State & Data Fetching",
      skills: ["React Query (TanStack)", "Zustand", "Context API", "REST APIs", "Axios"],
    },
    {
      category: "Tools & Workflow",
      skills: ["Git & GitHub", "Vercel", "Figma to Code", "Postman", "Jest", "Vite"],
    },
  ],
  projects: [
    {
      title: "1. Authentication Pathway – Secure User Management",
      description: "A secure user authentication system with role-based access control and seamless integration with third-party identity providers.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com/Truth123-dev",
      liveUrl: "https://my-nextjs-ra244f09m-elijahvision-s-projects.vercel.app",
    },
    {
      title: "2. E-Commerce Checkout Pipeline & Gateway Integration",
      description: "A streamlined checkout process with integrated payment gateways and real-time inventory updates.",
      tags: ["React", "Zustand", "Tailwind CSS", "Stripe API"],
      githubUrl: "https://github.com/Truth123-dev",
      liveUrl: "https://my-react-project-l1xry4zmv-elijahvision-s-projects.vercel.app",
    },
    {
      title: "3.Recipe Discovery & Meal Planner ",
      description: "A responsive web application for discovering recipes and planning meals with a clean, intuitive interface.",
      tags: ["React", "TypeScript", "Tailwind CSS", "Edamam API"],
      githubUrl: "https://github.com/Truth123-dev",
      liveUrl: "https://my-react-project-imkvwbxhp-elijahvision-s-projects.vercel.app",
    },
    {
      title: "4.  Cryptocurrency Market Monitor - Tracker",
      description: "Real-time cryptocurrency analytics dashboard fetching live price feeds, candle charts, and market volume updates.",
      tags: ["Next.js", "Tailwind CSS", "Chart.js", "CoinGecko API"],
      githubUrl: "https://github.com/Truth123-dev",
      liveUrl: "https://my-react-project-8sy2vcpit-elijahvision-s-projects.vercel.app",
    },
    {
      title: "5.SaaSGuard Vision Force - SaaS Security Platform",
      description: "A comprehensive SaaS security platform providing real-time threat detection, vulnerability scanning, and compliance reporting.",
      tags: ["React", "TypeScript", "OpenWeather API", "Tailwind CSS"],
      githubUrl: "https://github.com/Truth123-dev",
      liveUrl: "https://my-react-project-947msi9wh-elijahvision-s-projects.vercel.app",
    },
  ],
  experience: [
    {
      role: "Frontend Developer Intern",
      company: "Apex Digital Solutions",
      period: "2024 – Present",
      location: "Remote",
      achievements: [
        "Converted 15+ high-fidelity Figma designs into fully responsive React/Tailwind components with 98+ PageSpeed scores.",
        "Integrated REST APIs with TanStack Query, reducing unnecessary re-renders by 35%.",
        "Collaborated in Agile sprints, resolving 40+ UI bugs and improving cross-browser compatibility.",
      ],
    },
    {
      role: "Freelance Web Developer",
      company: "Self-Employed",
      period: "2024 – 2025",
      location: "Remote",
      achievements: [
        "Built and deployed 6 custom responsive websites for local businesses using Next.js and Tailwind CSS.",
        "Optimized SEO, metadata, and core web vitals resulting in a 45% increase in client organic leads.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Sc. in Computer Science",
      institution: "State University of Technology",
      year: "Graduated: 2024",
    },
    {
      degree: "Meta Frontend Developer Professional Certificate",
      institution: "Coursera / Meta",
      year: "Completed: 2024P",
    },
  ],
};