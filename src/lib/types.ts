export type Role = "brand" | "creator";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
  company?: string | undefined;
  niche?: string | undefined;
  location?: string | undefined;
  bio?: string | undefined;
  platforms?: ("TikTok" | "Instagram" | "YouTube")[];
  rate?: number | undefined;
  followers?: number | undefined;
  verified?: boolean;
  authId?: string;
}

export type CampaignStatus = "draft" | "open" | "in_progress" | "closed";

export interface Campaign {
  id: number;
  userId: number;
  title: string;
  description: string;
  niche: string;
  platform: "TikTok" | "Instagram" | "YouTube" | "Both";
  budget: number;
  deliverables: string;
  deadline: string;
  status: CampaignStatus;
  createdAt: string;
  workspaceId?: string;
  clientBrandId?: string | undefined;
}

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Application {
  id: number;
  campaignId: number;
  creatorId: number;
  pitch: string;
  rate: number;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Store {
  users: User[];
  campaigns: Campaign[];
  applications: Application[];
  messages: Message[];
  notifications: Notification[];
}
