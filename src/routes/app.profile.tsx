import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, BadgeCriteria, BadgePill, Field, PageHeader, VerifiedBadge, btnPrimary, inputCls } from "@/components/uc/ui";
import { JOB_SUCCESS_MIN, brandBadges, creatorBadges, jobSuccess } from "@/lib/badges";
import { useI18n } from "@/lib/i18n";
import { profileCompletion } from "@/lib/profile";
import { useApp } from "@/lib/store";
import type { User } from "@/lib/types";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — UpCreator" }, { name: "description", content: "Edit your UpCreator public profile and see your badges." }, { property: "og:title", content: "Profile — UpCreator" }, { property: "og:description", content: "Edit your UpCreator public profile and see your badges." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ProfilePage,
});

const NICHES = ["Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Lifestyle", "Gaming", "Education", "Other"];
const PLATFORMS = ["TikTok", "Instagram", "YouTube"] as const;

function ProfilePage() {
  const { user } = useApp();
  if (!user) return null;
  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: User }) {
  const { t } = useI18n();
  const { store, update } = useApp();
  const [f, setF] = useState<User>(user);
  const isCreator = user.role === "creator";
  const set = (k: keyof User) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: ["rate", "followers"].includes(k) ? (e.target.value === "" ? undefined : Number(e.target.value)) : e.target.value }));
  const togglePlat = (p: (typeof PLATFORMS)[number]) =>
    setF((x) => ({ ...x, platforms: x.platforms?.includes(p) ? x.platforms.filter((y) => y !== p) : [...(x.platforms ?? []), p] }));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    update((s) => ({ users: s.users.map((u) => (u.id === user.id ? { ...f, name: f.name.trim() } : u)) }));
    toast.success(t("Saved"));
  };
  const js = isCreator ? jobSuccess(user.id, store) : null;
  const badges = isCreator ? creatorBadges(user, store) : brandBadges(user, store);

  return (
    <>
      <PageHeader title="Profile" subtitle="Edit your public profile." />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={save} className="space-y-4 rounded-2xl border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input required className={inputCls} value={f.name} onChange={set("name")} /></Field>
            {isCreator ? (
              <Field label="Niche"><select className={inputCls} value={f.niche ?? ""} onChange={set("niche")}><option value="">—</option>{NICHES.map((n) => <option key={n} value={n}>{t(n)}</option>)}</select></Field>
            ) : (
              <Field label="Company"><input className={inputCls} value={f.company ?? ""} onChange={set("company")} /></Field>
            )}
            <Field label="Location"><input className={inputCls} value={f.location ?? ""} onChange={set("location")} /></Field>
            {isCreator && <Field label="Rate (EGP)"><input type="number" min={0} className={inputCls} value={f.rate ?? ""} onChange={set("rate")} /></Field>}
            {isCreator && <Field label="Followers"><input type="number" min={0} className={inputCls} value={f.followers ?? ""} onChange={set("followers")} /></Field>}
          </div>
          <Field label="Bio"><textarea rows={4} className={inputCls} value={f.bio ?? ""} onChange={set("bio")} /></Field>
          {isCreator && (
            <div>
              <span className="mb-1.5 block text-sm font-semibold">{t("Platforms")}</span>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button key={p} type="button" aria-pressed={!!f.platforms?.includes(p)} onClick={() => togglePlat(p)}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${f.platforms?.includes(p) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{t(p)}</button>
                ))}
              </div>
            </div>
          )}
          <button className={btnPrimary}>{t("Save changes")}</button>
        </form>
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} className="h-14 w-14 text-lg" />
              <div>
                <p className="flex items-center gap-1.5 font-bold">{user.name} {user.verified && <VerifiedBadge />}</p>
                <p className="text-xs text-muted-foreground">{t("Profile complete")}: <bdi>{profileCompletion(user)}%</bdi></p>
              </div>
            </div>
            <p className="mt-4 text-xs font-bold uppercase text-muted-foreground">{t("Your badges")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {js != null && js >= JOB_SUCCESS_MIN && <BadgePill badge={{ label: "Job Success", icon: "crown", tone: "brand" }} suffix={`${js}%`} />}
              {badges.map((b) => <BadgePill key={b.label} badge={b} />)}
              {!badges.length && !(js != null && js >= JOB_SUCCESS_MIN) && !user.verified && <span className="text-sm text-muted-foreground">{t("No badges yet")}</span>}
            </div>
          </div>
          <BadgeCriteria />
        </aside>
      </div>
    </>
  );
}
