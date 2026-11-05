<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## UpCreator structure
- Signed-in screens live under `src/routes/app.*` with `app.tsx` as the guarded sidebar layout; role rules are centralised in `src/lib/nav.ts` (ROUTE_ACCESS) so the sidebar and guards never disagree.
- App data uses Lovable Cloud through the typed store adapter; keep numeric domain profile IDs mapped to auth UUIDs so existing screens remain compatible without exposing credentials.
- Marketplace roles live in protected user_roles; workspace membership and record ownership are enforced by database policies, not browser role checks, to prevent cross-account access.
- Account registration and role/workspace onboarding are separate steps; role assignment is a one-time validated database operation so editable auth metadata never grants privileges.
- Seed records remain test fixtures only; real sessions start with persisted account data and never import local demo passwords or achievements.
- Localization is owned by the shared I18nProvider and translation dictionary; use logical layout utilities and localized display formatters so switching language never changes stored data or role rules.
- Creator ranking and the rules that narrow it (score, name search, platform, niche, rate cap, sorting) are pure functions in `src/lib/match.ts`; route files only render their output so the rules stay testable without a browser.
- Achievement badges (verified check, Top Rated, Rising Star, Proven Partner, Active Hirer) are pure rules in `src/lib/badges.ts` rendered via `VerifiedBadge`/`BadgePill` from `src/components/uc/ui.tsx`; thresholds live as exported constants, not inline numbers.
