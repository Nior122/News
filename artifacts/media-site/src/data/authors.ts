export interface AuthorProfile {
  slug: string;
  name: string;
  title: string;
  bio: string;
  longBio: string;
  experience: string;
  expertise: string[];
  social?: {
    twitter?: string;
    linkedin?: string;
  };
}

export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  "maya-chen": {
    slug: "maya-chen",
    name: "Maya Chen",
    title: "Senior Tech & AI Writer",
    bio: "Covering the intersection of AI and everyday technology for over 8 years.",
    longBio:
      "Maya Chen has spent over eight years at the frontlines of consumer technology journalism, reporting from CES, Google I/O, and Apple events. Her work focuses on making sense of complex AI features and mobile technology for everyday readers. Before joining Scrolltek, she was a contributing editor at two major tech publications and holds a degree in Computer Science from UC Berkeley.",
    experience: "8+ years in tech journalism",
    expertise: ["Artificial Intelligence", "Smartphones", "Google", "Apple", "Consumer Tech", "AI Features"],
    social: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  "james-okafor": {
    slug: "james-okafor",
    name: "James Okafor",
    title: "Tech & Culture Writer",
    bio: "Writing at the crossroads of technology and culture since 2018.",
    longBio:
      "James Okafor explores how digital tools and platforms reshape society, identity, and culture. His reporting digs into the human stories behind trending technology — from the social psychology of meme culture to the cultural implications of Android's global dominance. James has a background in cultural studies and has contributed to leading tech and culture publications worldwide.",
    experience: "6+ years in tech and culture journalism",
    expertise: ["Android", "Tech Culture", "Social Media", "Digital Society", "Internet Culture", "Gadgets"],
    social: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  "sofia-reyes": {
    slug: "sofia-reyes",
    name: "Sofia Reyes",
    title: "Lifestyle & Culture Editor",
    bio: "Exploring wellness, digital culture, and how technology shapes the way we live.",
    longBio:
      "Sofia Reyes writes about the softer — but equally important — side of our digital lives. Her work examines how social media affects our attention spans, why digital detoxing is becoming a modern necessity, and the lifestyle shifts happening at the intersection of wellness and technology. She brings a thoughtful, research-backed perspective to topics that touch millions of people daily.",
    experience: "5+ years in lifestyle and culture writing",
    expertise: ["Lifestyle", "Digital Wellness", "Culture", "Social Media", "Mental Health", "Work-Life Balance"],
    social: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  "liam-park": {
    slug: "liam-park",
    name: "Liam Park",
    title: "Mobile & On-Device AI Specialist",
    bio: "Former software engineer turned mobile writer — obsessed with squeezing every bit of performance from your devices.",
    longBio:
      "Liam Park spent five years as a mobile software engineer before pivoting to tech journalism. That technical background gives him an edge when covering on-device AI, battery optimization, and the hidden capabilities most users never discover. His practical, no-fluff approach to phone tips has made him one of the most trusted voices for readers who want real results from their devices.",
    experience: "4 years writing + 5 years software engineering",
    expertise: ["On-Device AI", "Android", "iPhone", "Battery Optimization", "Mobile Apps", "Privacy"],
    social: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  "anya-patel": {
    slug: "anya-patel",
    name: "Anya Patel",
    title: "AI Tools & Productivity Writer",
    bio: "Testing AI productivity tools so you don't have to — with thousands of hours logged across ChatGPT, Claude, Gemini, and beyond.",
    longBio:
      "Anya Patel is Scrolltek's resident expert on AI tools and productivity systems. She has spent thousands of hours hands-on with virtually every major AI assistant and productivity platform, translating dense capabilities into practical advice anyone can apply. Her work is grounded in real-world workflows, not hype — and her comparisons are trusted by professionals and curious beginners alike.",
    experience: "5+ years covering AI tools and productivity",
    expertise: ["ChatGPT", "Claude", "Gemini", "AI Tools", "Productivity Systems", "Automation", "Freelancing"],
    social: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  "scrolltek-editorial": {
    slug: "scrolltek-editorial",
    name: "Scrolltek Editorial",
    title: "Editorial Team",
    bio: "The Scrolltek editorial team covers breaking stories and collaborative features across all categories.",
    longBio:
      "The Scrolltek Editorial team is a group of experienced journalists, researchers, and digital media specialists working together to deliver accurate, timely, and engaging coverage across Tech, Culture, Lifestyle, AI Tools, Phone Tips, Productivity, and Trending topics. Every piece published under this byline has been reviewed, fact-checked, and edited to Scrolltek's editorial standards.",
    experience: "Combined 30+ years of editorial experience",
    expertise: ["Tech", "Culture", "Lifestyle", "AI Tools", "Phone Tips", "Productivity", "Trending"],
    social: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
};

export function getAuthorProfile(slug: string): AuthorProfile | null {
  return AUTHOR_PROFILES[slug] ?? null;
}

export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
