import type { Role, Store } from "./types";

export type AppPath =
  | "/app"
  | "/app/campaigns"
  | "/app/campaigns/new"
  | "/app/manage"
  | "/app/applications"
  | "/app/ai-match"
  | "/app/talent"
  | "/app/earnings"
  | "/app/billing"
  | "/app/messages"
  | "/app/notifications"
  | "/app/settings"
  | "/app/profile"
  | "/app/workspaces";

export interface NavItem {
  to: AppPath;
  label: string;
  icon: string;
  badge?: number;
}

/** Sidebar items per role — mirrors NAV_ITEMS from the prototype. */
export function navItems(role: Role, store: Store, userId: number): NavItem[] {
  const unread = store.messages.filter((m) => m.receiverId === userId && !m.isRead).length;
  const notifs = store.notifications.filter((n) => n.userId === userId && !n.read).length;
  if (role === "brand") {
    const mine = store.campaigns.map((c) => c.id);
    const pending = store.applications.filter((a) => mine.includes(a.campaignId) && a.status === "pending").length;
    return [
      { to: "/app", label: "Home", icon: "⊞" },
      { to: "/app/ai-match", label: "AI Creator Match", icon: "🤖" },
      { to: "/app/manage", label: "Manage Work", icon: "📋", badge: pending },
      { to: "/app/campaigns/new", label: "Post a Campaign", icon: "＋" },
      { to: "/app/talent", label: "Talent Pool", icon: "🎯" },
      { to: "/app/messages", label: "Messages", icon: "💬", badge: unread },
      { to: "/app/notifications", label: "Notifications", icon: "🔔", badge: notifs },
      { to: "/app/billing", label: "Billing", icon: "💳" },
      { to: "/app/settings", label: "Settings", icon: "⚙️" },
      { to: "/app/profile", label: "Profile", icon: "👤" },
    ];
  }
  return [
    { to: "/app", label: "My Space", icon: "⊞" },
    { to: "/app/campaigns", label: "Browse Campaigns", icon: "🔍" },
    { to: "/app/applications", label: "My Applications", icon: "📄" },
    { to: "/app/earnings", label: "Earnings", icon: "💰" },
    { to: "/app/messages", label: "Messages", icon: "💬", badge: unread },
    { to: "/app/notifications", label: "Notifications", icon: "🔔", badge: notifs },
    { to: "/app/settings", label: "Settings", icon: "⚙️" },
  ];
}

/** Which role may open a page — mirrors ROUTE_ACCESS. "any" = any signed-in user. */
export const ROUTE_ACCESS: Record<AppPath, Role | "any"> = {
  "/app": "any",
  "/app/campaigns": "any",
  "/app/messages": "any",
  "/app/notifications": "any",
  "/app/settings": "any",
  "/app/profile": "any",
  "/app/campaigns/new": "brand",
  "/app/manage": "brand",
  "/app/ai-match": "brand",
  "/app/talent": "brand",
  "/app/billing": "brand",
  "/app/workspaces": "brand",
  "/app/applications": "creator",
  "/app/earnings": "creator",
};

export function canAccess(role: Role, path: AppPath) {
  const rule = ROUTE_ACCESS[path];
  return rule === "any" || rule === role;
}
