import type { Store } from "./types";

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

// Demo data so every screen has something to show. Demo password for all: "demo1234".
export const SEED: Store = {
  users: [
    { id: 1, name: "Nile Cosmetics", email: "brand@demo.com", password: "demo1234", role: "brand", company: "Nile Cosmetics", location: "Egypt" },
    { id: 2, name: "Salma Hassan", email: "creator@demo.com", password: "demo1234", role: "creator", niche: "Beauty", location: "Egypt", bio: "Beauty & skincare reels for Gen Z in Cairo.", platforms: ["TikTok", "Instagram"], rate: 4000 },
    { id: 3, name: "Omar Fathy", email: "omar@demo.com", password: "demo1234", role: "creator", niche: "Tech", location: "Egypt", bio: "Unboxings and honest gadget reviews.", platforms: ["YouTube", "TikTok"], rate: 3800 },
    { id: 5, name: "Nour Adel", email: "nour@demo.com", password: "demo1234", role: "creator", niche: "Fashion", location: "Egypt", bio: "Street style, outfit transitions and sneaker reviews around Cairo.", platforms: ["Instagram", "TikTok"], rate: 5000 },
    { id: 6, name: "Karim Said", email: "karim@demo.com", password: "demo1234", role: "creator", niche: "Fitness", location: "Egypt", bio: "Gym routines, workout POVs and healthy lifestyle tips.", platforms: ["YouTube", "Instagram"], rate: 4500 },
    { id: 4, name: "Cairo Kicks", email: "kicks@demo.com", password: "demo1234", role: "brand", company: "Cairo Kicks", location: "Egypt" },
  ],
  campaigns: [
    { id: 1, userId: 1, title: "Summer glow serum launch", description: "Show your morning routine featuring our new vitamin C serum. Natural light, honest reaction.", niche: "Beauty", platform: "TikTok", budget: 4500, deliverables: "2 TikTok videos (30–45s)", deadline: daysAhead(14), status: "open", createdAt: daysAgo(2) },
    { id: 2, userId: 1, title: "Ramadan gift box unboxing", description: "Unbox our limited Ramadan gift set and share your favourite piece.", niche: "Lifestyle", platform: "Instagram", budget: 3000, deliverables: "1 Reel + 3 Stories", deadline: daysAhead(21), status: "open", createdAt: daysAgo(5) },
    { id: 3, userId: 4, title: "Street style sneaker drop", description: "Style our new runners three ways around Downtown Cairo.", niche: "Fashion", platform: "Both", budget: 6000, deliverables: "1 Reel + 1 TikTok", deadline: daysAhead(10), status: "open", createdAt: daysAgo(1) },
    { id: 4, userId: 4, title: "Gym day in our trainers", description: "Full workout POV wearing our training line.", niche: "Fitness", platform: "YouTube", budget: 5200, deliverables: "1 YouTube Short", deadline: daysAhead(30), status: "in_progress", createdAt: daysAgo(12) },
    { id: 5, userId: 1, title: "Eid skincare bundle", description: "", niche: "Beauty", platform: "Instagram", budget: 0, deliverables: "", deadline: daysAhead(40), status: "draft", createdAt: daysAgo(3) },
  ],
  applications: [
    { id: 1, campaignId: 1, creatorId: 2, pitch: "My audience is 80% women 18–28 who love skincare — perfect fit!", rate: 4000, status: "pending", createdAt: daysAgo(1) },
    { id: 2, campaignId: 3, creatorId: 2, pitch: "I can do a fun three-outfit transition.", rate: 5500, status: "accepted", createdAt: daysAgo(1) },
    { id: 3, campaignId: 1, creatorId: 3, pitch: "I'd love to try a male-skincare angle.", rate: 3800, status: "pending", createdAt: daysAgo(0.5) },
    { id: 4, campaignId: 2, creatorId: 5, pitch: "Unboxing reels are my thing.", rate: 2800, status: "accepted", createdAt: daysAgo(4) },
  ],
  messages: [
    { id: 1, senderId: 4, receiverId: 2, body: "Loved your proposal! When can you shoot?", isRead: false, createdAt: daysAgo(0.3) },
    { id: 2, senderId: 2, receiverId: 1, body: "Hi! Is the serum suitable for oily skin?", isRead: false, createdAt: daysAgo(0.6) },
  ],
  notifications: [
    { id: 1, userId: 2, title: "Proposal accepted", body: "Cairo Kicks accepted your proposal for “Street style sneaker drop”.", read: false, createdAt: daysAgo(1) },
    { id: 2, userId: 1, title: "New proposal", body: "Omar Fathy applied to “Summer glow serum launch”.", read: false, createdAt: daysAgo(0.5) },
  ],
};
