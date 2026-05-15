// ─── Site Configuration ───────────────────────────────────────────────────────
export const siteConfig = {
  name: 'Mielle Almedejar',
  firstName: 'Mielle',
  role: 'Web / Software / AI Engineer',
  tagline: 'Building intelligent systems from pixel to pipeline.',
  bio: `I'm a full-stack engineer and junior AI engineer based in the Philippines, 
  passionate about crafting scalable web applications and integrating AI into real-world products. 
  I work across the entire stack — from polished React frontends to robust Django/Laravel backends 
  and intelligent AI pipelines. I love turning complex problems into clean, maintainable solutions.`,
  url: 'https:mielle.tech',
  email: 'jesimielalmedejar1018@gmail.com',
  github: 'https://github.com/brown-cookies',
  linkedin: 'https://linkedin.com/in/mielle-almedejar',
  location: 'Angeles City, Philippines',
  resumeUrl: '/mielle-resume.pdf',
  availableForWork: true,
}

// ─── Tech Stack ───────────────────────────────────────────────────────────────
export const techStack = [
  { name: 'React',       color: '#61DAFB', icon: 'react'        },
  { name: 'Next.js',     color: '#ffffff', icon: 'nextdotjs'    },
  { name: 'TypeScript',  color: '#3178C6', icon: 'typescript'   },
  { name: 'Django',      color: '#092E20', icon: 'django'       },
  { name: 'Laravel',     color: '#FF2D20', icon: 'laravel'      },
  { name: 'Python',      color: '#3776AB', icon: 'python'       },
  { name: 'PHP',         color: '#777BB4', icon: 'php'          },
  { name: 'PostgreSQL',  color: '#4169E1', icon: 'postgresql'   },
  { name: 'MySQL',       color: '#4479A1', icon: 'mysql'        },
  { name: 'Docker',      color: '#2496ED', icon: 'docker'       },
  { name: 'AWS',         color: '#FF9900', icon: 'amazonaws'    },
  { name: 'TailwindCSS', color: '#06B6D4', icon: 'tailwindcss'  },
  { name: 'Redux',       color: '#764ABC', icon: 'redux'        },
  { name: 'Node.js',     color: '#339933', icon: 'nodedotjs'    },
  { name: 'Linux',       color: '#FCC624', icon: 'linux'        },
  { name: 'Git',         color: '#F05032', icon: 'git'          },
]

// ─── Projects ─────────────────────────────────────────────────────────────────
export type Project = {
  id:           number
  title:        string
  subtitle:     string
  description:  string
  tags:         string[]
  features:     string[]
  deliverables: string[]
  techIcons:    { icon: string; label: string }[]
  github?:      string
  live?:        string
  featured:     boolean
  status:       'live' | 'in-progress' | 'archived'
  gradient:     string
  category:     string
  timeline:     string
  clientType:   string
}

export const projects: Project[] = [
  {
    id: 1,
    title: "HeatMatch",
    subtitle: "Anonymous 1-on-1 Chat with Smart Matchmaking",
    description:
      "A real-time anonymous chat platform that pairs strangers based on gender preference, university, age range, and vibe. No accounts, no stored messages — just instant, filtered connections powered by a Redis queue with progressive filter relaxation.",
    tags: ["Real-time", "Matchmaking", "Anonymous", "Monorepo", "Socket.io"],
    features: [
      "Vibe-based matchmaking (Friendly, Deep Talk, Flirty 18+)",
      "Progressive filter relaxation — loosens age then university filters over time to guarantee a match",
      "Gender preference matching with mutual opt-in logic",
      "University filtering seeded with Philippine universities",
      "Typing indicators and message read receipts (seen)",
      "Reply-to threading on chat messages",
      "Skip & re-queue without losing socket session",
      "Report system with categorized reasons (harassment, spam, underage, explicit)",
      "Live admin dashboard with Redis-backed stats (online users, active rooms, total matches/messages)",
      "Dark/light theme toggle with persisted preference",
      "Session-persisted form state across navigation",
      "Mobile-polished responsive UI",
    ],
    deliverables: [
      "Next.js 14 frontend (filter screen, waiting screen, chat screen)",
      "Node.js + Express + Socket.io backend",
      "Redis-backed matchmaking queue with vibe segmentation",
      "Shared TypeScript types package (@heatmatch/types)",
      "Docker Compose setup for Redis and PostgreSQL",
      "pnpm monorepo with one-command dev startup",
      "Admin dashboard with real-time analytics",
    ],
    techIcons: [
      { icon: "nextjs",      label: "Next.js 14" },
      { icon: "typescript",  label: "TypeScript" },
      { icon: "socketio",    label: "Socket.io" },
      { icon: "redis",       label: "Redis" },
      { icon: "nodejs",      label: "Node.js" },
      { icon: "express",     label: "Express" },
      { icon: "postgresql",  label: "PostgreSQL" },
      { icon: "tailwindcss", label: "Tailwind CSS" },
      { icon: "zustand",     label: "Zustand" },
      { icon: "pnpm",        label: "pnpm Workspaces" },
      { icon: "docker",      label: "Docker" },
    ],
    github: "https://github.com/brown-cookies/heatmatch",
    live: "https://heatmatch.mielle.tech",
    featured: true,
    status: "live",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    category: "Full-Stack",
    timeline: "2 Months",
    clientType: "Personal / Side Project",
  },
  {
    id: 2,
    title: 'HanH Robot Companion',
    subtitle: 'Raspberry Pi AI Robot with Event-Driven Architecture',
    description:
      'A physical AI companion robot built on Raspberry Pi 3B+ using a custom event-driven architecture (EDA). Features local LLM inference via Ollama, wake-word detection, ST7789 LCD face animations, L298N motor control, and a FastAPI laptop AI server.',
    tags: ['Python', 'ROS2', 'AI', 'Raspberry Pi', 'FastAPI', 'LangChain'],
    features: [
      'Custom EventBus pub/sub architecture with typed topics',
      'Local LLM inference via Ollama (no cloud dependency)',
      'Wake-word detection ("hey hanh") with pvporcupine',
      'ST7789 240×240 LCD with animated emotion faces',
      'L298N dual motor driver for movement control',
      'FastAPI laptop AI server with HTTP client nodes',
      'LangChain integration for conversational memory',
      'Mock GPIO layer for Windows dev / Pi deployment parity',
    ],
    deliverables: [
      'Raspberry Pi firmware with EDA node architecture',
      'FastAPI AI server (laptop-side inference)',
      'VoiceNode → AINode → CommandNode → HardwareNode pipeline',
      'ST7789 face renderer with 6 emotion states',
      'Full pytest suite with conftest path fixtures',
      'Split requirements (base / windows / pi)',
    ],
    techIcons: [
      { icon: 'logos:python',           label: 'Python'     },
      { icon: 'logos:raspberry-pi',     label: 'RPi 3B+'    },
      { icon: 'logos:fastapi-icon',     label: 'FastAPI'    },
      { icon: 'simple-icons:langchain', label: 'LangChain'  },
      { icon: 'logos:ollama',           label: 'Ollama'     },
      { icon: 'logos:pytest',           label: 'Pytest'     },
    ],
    github: 'https://github.com/mielle-almedejar/hanh',
    featured: true,
    status: 'in-progress',
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    category: 'Robotics / AI',
    timeline: '3 months',
    clientType: 'Personal Project',
  },
  {
    id: 3,
    title: 'Handyman Services Platform',
    subtitle: 'Full-Stack Marketplace for Home Services',
    description:
      'A multi-merchant marketplace connecting clients with handymen. Django REST Framework backend with 5 domain apps, a React/Redux Toolkit frontend using Bootswatch Lux, real-time Gemini-powered chat, and multi-merchant PayPal checkout.',
    tags: ['Django', 'React', 'Redux', 'DRF', 'PayPal'],
    features: [
      'Five DRF apps: users, applications, services, orders, chat',
      'Redux Toolkit with async thunks and normalised state',
      'Gemini AI chatbot for service recommendations',
      'Multi-merchant PayPal integration per vendor',
      'JWT auth with role-based access (client / handyman / admin)',
      'Real-time order status updates via polling',
      'Responsive UI with React Bootstrap / Bootswatch Lux',
      'Image upload for service listings via Django media',
    ],
    deliverables: [
      'Django REST API with browsable docs',
      'React/Redux SPA (Create React App)',
      'Multi-merchant PayPal checkout flow',
      'Gemini AI chat widget',
      'Single GitHub monorepo with full README',
      'Postman collection and API spec',
    ],
    techIcons: [
      { icon: 'logos:django-icon',  label: 'Django'  },
      { icon: 'logos:react',        label: 'React'   },
      { icon: 'logos:redux',        label: 'Redux'   },
      { icon: 'logos:postgresql',   label: 'Postgres'},
      { icon: 'logos:paypal',       label: 'PayPal'  },
      { icon: 'logos:google-icon',  label: 'Gemini'  },
      { icon: 'logos:jwt-icon',     label: 'JWT'     },
    ],
    github: 'https://github.com/mielle-almedejar/handyman-services',
    featured: true,
    status: 'live',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    category: 'Web Application',
    timeline: '3 months',
    clientType: 'Academic / Solo',
  },
  {
    id: 4,
    title: 'Node.js Deployment Suite',
    subtitle: 'Zero-Dependency Automated Deploy Toolchain',
    description:
      'A 14-file Express.js deployment automation suite with zero external runtime dependencies. Includes PM2 process management, rsync file transfers, exponential back-off health checks, atomic rollback, and Slack webhook notifications.',
    tags: ['Node.js', 'DevOps', 'Express', 'PM2', 'Shell'],
    features: [
      'Zero external npm dependencies at runtime',
      'PM2 upsert — starts or gracefully restarts processes',
      'rsync-based incremental file transfers',
      'Exponential back-off health check with configurable retries',
      'Atomic rollback restores previous release on failure',
      'Slack webhook notifications for deploy events',
      'Environment-specific config (staging / production)',
      'Structured JSON logging throughout pipeline',
    ],
    deliverables: [
      '14 modular Node.js deploy scripts',
      'PM2 ecosystem config generator',
      'Rollback and health-check utilities',
      'Slack notifier module',
      'Shell wrapper for CI/CD integration',
      'README with usage and configuration guide',
    ],
    techIcons: [
      { icon: 'logos:nodejs-icon',  label: 'Node.js' },
      { icon: 'logos:pm2',          label: 'PM2'     },
      { icon: 'logos:bash-icon',    label: 'Bash'    },
      { icon: 'logos:slack-icon',   label: 'Slack'   },
      { icon: 'logos:linux-tux',    label: 'Linux'   },
    ],
    github: 'https://github.com/mielle-almedejar/deploy-suite',
    featured: false,
    status: 'live',
    gradient: 'from-slate-600 via-gray-600 to-zinc-600',
    category: 'DevOps',
    timeline: '2 weeks',
    clientType: 'Open Source',
  },
  {
    id: 5,
    title: 'Network Security Lab',
    subtitle: 'Cisco Packet Tracer Multi-Router Security Topology',
    description:
      'Advanced Cisco Packet Tracer network with four routers, four VLANs, CBAC/ZBF stateful firewall, Site-to-Site IPsec VPN, NAT/PAT, and OSPF with explicit router-IDs. Demonstrates enterprise-grade network segmentation and defence-in-depth.',
    tags: ['Networking', 'Cisco', 'Security', 'OSPF', 'IPsec'],
    features: [
      'Four-router topology: R1–R4 with distinct VLAN segments',
      'VLAN10 (public), VLAN20/30 (private), VLAN40 (DMZ)',
      'Extended ACL + CBAC stateful inspection on edge routers',
      'Zone-Based Firewall (ZBF) policy configuration',
      'Site-to-Site IPsec VPN between R1 and R4',
      'NAT/PAT for internet-facing VLAN10 hosts',
      'OSPF with explicit router-IDs (1.1.1.1–4.4.4.4)',
      'Inter-VLAN routing verified with end-to-end ping tests',
    ],
    deliverables: [
      'Cisco Packet Tracer .pkt topology file',
      'Step-by-step configuration documentation',
      'Network diagram with IP addressing scheme',
      'ACL and ZBF policy reference sheets',
      'IPsec VPN tunnel verification output',
      'OSPF neighbour and routing table screenshots',
    ],
    techIcons: [
      { icon: 'logos:cisco',          label: 'Cisco'    },
      { icon: 'mdi:shield-lock',      label: 'IPsec'    },
      { icon: 'mdi:router-network',   label: 'OSPF'     },
      { icon: 'mdi:firewall',         label: 'CBAC/ZBF' },
      { icon: 'mdi:lan',              label: 'VLAN'     },
    ],
    featured: false,
    status: 'archived',
    gradient: 'from-blue-600 via-indigo-600 to-blue-800',
    category: 'Network Security',
    timeline: '6 weeks',
    clientType: 'Academic',
  },
  {
    id: 6,
    title: 'Operation Phantom Ledger',
    subtitle: 'Ransomware / OAuth IR Playbook — EY Financial Services',
    description:
      'A five-phase CyberOps capstone simulating a ransomware and OAuth token-theft attack against EY Financial Services. Delivered as a unified Word document covering threat modelling, MITRE ATT&CK mapping, Philippine regulatory compliance, NIST SP 800-61 IR playbook, and ROSI analysis.',
    tags: ['CyberSecurity', 'MITRE', 'NIST', 'Incident Response'],
    features: [
      'MITRE ATT&CK-mapped attack model (T1486, T1528, T1071)',
      'Philippine regulatory compliance: RA 10173, RA 10175, BSP Circular 982',
      'NIST SP 800-61 Rev.2 four-phase IR playbook',
      'SOAR workflow automation for alert triage',
      'ROSI (Return on Security Investment) analysis',
      'Threat actor profiling and kill-chain mapping',
      'Evidence preservation and chain-of-custody procedures',
      'Executive summary and board-level risk report',
    ],
    deliverables: [
      'Five-phase capstone report (single styled Word doc)',
      'MITRE ATT&CK navigator layer file',
      'IR playbook runbook (detection → containment → eradication)',
      'SOAR workflow diagram',
      'Regulatory compliance checklist',
      'ROSI financial justification spreadsheet',
    ],
    techIcons: [
      { icon: 'simple-icons:mitre',      label: 'MITRE'   },
      { icon: 'mdi:shield-alert',        label: 'IR'      },
      { icon: 'mdi:file-document-alert', label: 'NIST'    },
      { icon: 'mdi:robot',               label: 'SOAR'    },
      { icon: 'mdi:bank-outline',        label: 'FinSec'  },
    ],
    featured: false,
    status: 'archived',
    gradient: 'from-red-700 via-rose-700 to-red-900',
    category: 'Cybersecurity',
    timeline: '4 weeks',
    clientType: 'Academic',
  },
]

// ─── Skills ───────────────────────────────────────────────────────────────────
export type SkillCategory = {
  category: string
  skills: { name: string; level: number }[]
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React / Next.js',  level: 92 },
      { name: 'TypeScript',       level: 85 },
      { name: 'Tailwind CSS',     level: 90 },
      { name: 'Redux Toolkit',    level: 80 },
      { name: 'Framer Motion',    level: 75 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Laravel (PHP)',    level: 88 },
      { name: 'Django (Python)',  level: 85 },
      { name: 'Node.js / Express',level: 78 },
      { name: 'REST API Design',  level: 90 },
      { name: 'PostgreSQL / MySQL',level: 82 },
    ],
  },
  {
    category: 'AI / ML',
    skills: [
      { name: 'Gemini API',       level: 75 },
      { name: 'LangChain',        level: 65 },
      { name: 'Ollama (Local LLMs)',level: 70 },
      { name: 'Hugging Face',     level: 60 },
      { name: 'FastAPI for AI',   level: 72 },
    ],
  },
  {
    category: 'DevOps & Security',
    skills: [
      { name: 'Docker',           level: 72 },
      { name: 'AWS (S3, EC2)',     level: 68 },
      { name: 'CI/CD (Jenkins)',   level: 70 },
      { name: 'Network Security', level: 65 },
      { name: 'Linux / Bash',     level: 78 },
    ],
  },
]

// ─── Experience / Timeline ────────────────────────────────────────────────────
export type Experience = {
  id:           number
  type:         'work' | 'education'
  title:        string
  organization: string
  period:       string
  description:  string
  tags?:        string[]
}

export const experiences: Experience[] = [
  {
    id: 1,
    type: 'work',
    title: 'Senior React.js & Laravel Developer',
    organization: 'Freelance / Independent',
    period: '2022 – Present',
    description:
      'Architecting and delivering full-stack web applications for clients. Specialised in React frontends, Laravel/Django backends, and integrating AI features into production systems.',
    tags: ['React', 'Laravel', 'Django', 'TypeScript'],
  },
  {
    id: 2,
    type: 'work',
    title: 'Junior AI Engineer',
    organization: 'Independent Projects',
    period: '2024 – Present',
    description:
      'Building AI-powered applications using Gemini, LangChain, Ollama, and Hugging Face. Currently developing TuneQuest (music AI) and HanH (robot companion).',
    tags: ['Gemini', 'LangChain', 'Python', 'FastAPI'],
  },
  {
    id: 3,
    type: 'work',
    title: 'Junior CyberSecurity Specialist',
    organization: 'Academic / Lab Projects',
    period: '2023 – Present',
    description:
      'Completed advanced network security labs including CBAC, ZBF, IPsec VPN, and incident response playbooks mapped to MITRE ATT&CK and NIST SP 800-61.',
    tags: ['Cisco', 'MITRE', 'NIST', 'Network Security'],
  },
  {
    id: 4,
    type: 'education',
    title: 'Bachelor of Science in Computer Engineering',
    organization: 'University — Philippines',
    period: '2021 – Present',
    description:
      'Focused on software engineering, network systems, electronics, and AI. Active in robotics and web development projects alongside academic work.',
    tags: ['Computer Engineering', 'Networking', 'AI', 'Embedded Systems'],
  },
]

// ─── Certifications ───────────────────────────────────────────────────────────
export type Certification = {
  id:             number
  title:          string
  issuer:         string
  date:           string
  credentialUrl?: string
  badge?:         string
  category:       'web' | 'ai' | 'security' | 'networking' | 'cloud' | 'literacy'
}

export const certifications: Certification[] = [
  { id: 1, title: 'IT Essentials: PC Hardware and Software',            issuer: 'Cisco Networking Academy', date: '2024', category: 'literacy',   credentialUrl: '/certificates/it-essentials-pc-hardware-and-software.pdf'  },
  { id: 2, title: 'CCNA: Switching, Routing, and Wireless Essentials',  issuer: 'Cisco Networking Academy', date: '2025', category: 'networking', credentialUrl: '/certificates/ccna-switching-routing-wireless-essentials.pdf'  },
  { id: 3, title: 'CCNA: Introduction to Networks',                     issuer: 'Cisco Networking Academy', date: '2024', category: 'networking', credentialUrl: '/certificates/ccna-introduction-to-networks.pdf'  },
  { id: 4, title: 'Introduction to Packet Tracer',                      issuer: 'Cisco Networking Academy', date: '2024', category: 'networking', credentialUrl: '/certificates/introduction-to-packet-tracer.pdf' },
  { id: 5, title: 'JavaScript Algorithms and Data Structures',   issuer: 'freeCodeCamp',             date: '2023', category: 'web'         },
  { id: 6, title: 'Responsive Web Design',                       issuer: 'freeCodeCamp',             date: '2022', category: 'web'         },
  { id: 7, title: 'AI Essentials',                               issuer: 'Google',                   date: '2024', category: 'ai'          },
  { id: 8, title: 'Python for Everybody',                        issuer: 'Coursera / U. of Michigan',date: '2023', category: 'ai'          },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
export type Testimonial = {
  id:           number
  name:         string
  role:         string
  organization: string
  avatar:       string          // initials fallback if no image
  avatarColor:  string          // bg color for initials avatar
  quote:        string
  relationship: 'colleague' | 'classmate' | 'professor' | 'client'
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Maria Santos',
    role: 'Project Partner',
    organization: 'University — PH',
    avatar: 'MS',
    avatarColor: '#059669',
    quote:
      "Mielle has a rare ability to bridge design thinking and engineering. On our capstone project he owned the entire backend architecture solo and still found time to help the rest of us debug frontend issues. The codebase he delivered was remarkably clean for a student project.",
    relationship: 'classmate',
  },
  {
    id: 2,
    name: 'Prof. Ramon Cruz',
    role: 'Network Systems Instructor',
    organization: 'University — PH',
    avatar: 'RC',
    avatarColor: '#7c3aed',
    quote:
      "One of the most technically thorough students I've supervised. His CyberOps capstone — Operation Phantom Ledger — was graduate-level work: proper MITRE ATT&CK mapping, realistic IR playbook, and Philippine regulatory alignment. It became a reference example for future cohorts.",
    relationship: 'professor',
  },
  {
    id: 3,
    name: 'James Reyes',
    role: 'Full-Stack Developer',
    organization: 'Freelance Collaborator',
    avatar: 'JR',
    avatarColor: '#0284c7',
    quote:
      "We collaborated on a client handyman platform under a tight deadline. Mielle took ownership of the Django REST backend from scratch — auth, orders, chat, the works. He communicates blockers early and writes code other people can actually maintain. I would work with him again without hesitation.",
    relationship: 'colleague',
  },
  {
    id: 4,
    name: 'Ana Lim',
    role: 'UI/UX Designer',
    organization: 'University — PH',
    avatar: 'AL',
    avatarColor: '#db2777',
    quote:
      "Working with Mielle on the React frontend was seamless. He took Figma designs and translated them pixel-perfect while also improving the component structure on his own. He's the kind of developer designers love — he asks the right questions before building, not after.",
    relationship: 'classmate',
  },
]
