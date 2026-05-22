# Manasthali — TSX + Tailwind Migration Plan

> The previous bug-fix plan (Steps 1–11) is complete. Step 12 of that plan was a manual E2E run that requires a live backend/database/S3.
>
> This new plan converts the frontend from `.jsx` files with inline `style={{}}` / `const styles = {…}` objects to `.tsx` files that style themselves with Tailwind utility classes via `className`, matching this reference style:
>
> ```tsx
> import { useState, type ReactElement } from "react";
> import { Outlet } from "react-router-dom";
>
> export default function AppShell(): ReactElement {
>   const [sidebarOpen, setSidebarOpen] = useState(false);
>   return (
>     <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
>       …
>     </div>
>   );
> }
> ```
>
> **End state:** no `style={{}}` props, no `const styles` objects, no `*.styles.*` files, no Bootstrap CSS imports, no `styleUtils.ts`. All styling lives in Tailwind `className` strings inside `.tsx` files. The only stylesheet is `src/index.css` containing the three `@tailwind` directives plus any unavoidable global keyframes via Tailwind's `@layer`.

---

## Current state (baseline)

- `frontend/src/` contains **29 `.jsx`** component files, **1 `.tsx`** entry (`main.tsx`), 4 plain `.js` (api/redux/utils), plus `utils/styleUtils.ts`.
- **27 components** use `const styles = { … }` + `style={styles.X}` for layout/colors.
- **10 components** still embed raw inline `style={{ … }}` props.
- **7 components** import `bootstrap/dist/css/bootstrap.min.css` and use class names like `btn`, `form-control`, `container`.
- Global CSS (reset + keyframes `animate`, `fallIn`) is injected at runtime from `src/utils/styleUtils.ts` via `injectGlobalStyles(...)`.
- TypeScript is already configured (`tsconfig.app.json`, `@types/react`, `@types/react-dom`, `@types/node`, `typescript@5.7`). `allowJs: true` and `jsx: "react-jsx"` are already set, so `.tsx` files compile out of the box.
- Tailwind is **not** installed. No `tailwind.config.*`, no `postcss.config.*`.

---

## Step 1 — Install and configure Tailwind CSS

**Priority:** Critical (gate for every later step)
**Area:** Build tooling

**Fix:**
- Add deps: `tailwindcss`, `postcss`, `autoprefixer` as dev dependencies in `frontend/package.json`.
- Create `frontend/tailwind.config.js` with:
  - `content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"]`
  - `theme.extend.keyframes` for `animate` (rotateY 0→360deg) and `fallIn` (translateY -200px → 0), mirroring the keyframes currently in `styleUtils.ts`.
  - `theme.extend.animation`: `{ "rotate-logo": "animate 5s infinite ease-in-out", "fall-in": "fallIn 1.5s ease-in-out" }`.
- Create `frontend/postcss.config.js` exporting `{ plugins: { tailwindcss: {}, autoprefixer: {} } }`.
- Create exactly **one** stylesheet `frontend/src/index.css` containing:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
  This is the only allowed CSS file in the repo.
- Import `./index.css` once at the top of `src/main.tsx`.
- Remove `injectGlobalStyles(...)` call from `main.tsx`; remove the `@keyframes` blob — those animations now live in `tailwind.config.js`.

**Acceptance:** `npx vite build` succeeds; a basic Tailwind class like `bg-slate-950` renders correctly in the running app.

---

## Step 2 — Tighten TypeScript config for `.tsx` migration

**Priority:** High
**Area:** `tsconfig.app.json`

**Fix:**
- Keep `allowJs: true` during migration so `.js` Redux/API files keep working.
- Add `"strict": false` (already set) but enable `"noImplicitAny": true` and `"strictNullChecks": true` so converted components surface obvious type issues without forcing every legacy file to be perfect.
- Ensure `"jsx": "react-jsx"` (already set) — no `import React from "react"` needed in new `.tsx` files; import `type ReactElement` directly when annotating return types.

**Acceptance:** `npx tsc -b` runs without new errors against the current code.

---

## Step 3 — Rename every component file `.jsx` → `.tsx`

**Priority:** Critical
**Area:** All component files under `frontend/src/components/**` and `frontend/src/App.jsx`

**Fix — file list (29 renames):**
- `src/App.jsx` → `src/App.tsx`
- `components/Authentication/Signin.jsx`, `Signup.jsx`, `ForgetPassword.jsx`, `ResetPassword.jsx`, `Verifyotp.jsx` → `.tsx`
- `components/Authorization/Auth.jsx` → `.tsx`
- `components/Home/Home.jsx` → `.tsx`
- `components/Admin/Admin.jsx`, `AdminLogin.jsx`, `Community/communityAdmin.jsx`, `Groups/Groups.jsx` → `.tsx`
- `components/Quiz/Quiz.jsx`, `QuizGetStarted.jsx`, `personality.jsx` → `.tsx`
- `components/Feed/Feed.jsx`, `Find-friend/FindFriend.jsx`, `Mental-Coach/MentalCoach.jsx`, `challenge/Challenege.jsx`, `chat/ChatList.jsx`, `community/community.jsx`, `group-chat/GroupChat.jsx`, `group/Group.jsx`, `home/FeedHome.jsx`, `notification/Notification.jsx`, `post/Post.jsx`, `profile/Profile.jsx`, `profile/ProfileSetting.jsx`, `story/Story.jsx` → `.tsx`

**Per-file edits during rename:**
- Replace the default-function/arrow signature with the reference pattern, e.g.
  ```tsx
  import { useState, type ReactElement } from "react";
  export default function Signin(): ReactElement { … }
  ```
- For child components that receive props, define a local `type Props = { … }` immediately above the component.
- Annotate `useState<T>(...)` generics where the inferred type would be `never[]` or `null`.
- Annotate event handlers: `(e: React.ChangeEvent<HTMLInputElement>) => …`, `(e: React.FormEvent<HTMLFormElement>) => …`.
- Type Redux selectors as `useSelector((state: RootState) => …)` — export `RootState` from `redux-config/store.js` (convert it to `store.ts` in this step to expose `RootState` / `AppDispatch`).
- Drop unused `import React from "react"` since `jsx: react-jsx` is in effect.

**Acceptance:** `find src -name "*.jsx"` returns nothing; `npx tsc -b` reports zero new errors.

---

## Step 4 — Replace `const styles = {}` and `style={{}}` with Tailwind `className`

**Priority:** Critical
**Area:** Every converted `.tsx` file

**Conversion rules:**
- Delete every `const styles = { … }` block at the top of a component.
- Remove every `style={styles.foo}` and every inline `style={{ … }}` prop.
- Reconstruct the same visual output using Tailwind utility classes inside `className="…"`:
  - Layout: `flex`, `grid`, `gap-*`, `items-*`, `justify-*`, `flex-col`, `flex-1`, `min-h-0`.
  - Spacing: `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`.
  - Sizing: `w-*`, `h-*`, `max-w-*`, `min-h-screen`.
  - Color: `bg-slate-950`, `text-slate-100`, `text-white`, `bg-blue-600`, `border-slate-700`, etc.
  - Typography: `text-sm`, `text-lg`, `font-medium`, `font-bold`, `tracking-tight`.
  - Effects: `rounded-md`, `rounded-full`, `shadow`, `backdrop-blur`, `ring-2`, `ring-sky-400/60`.
  - Responsive: `md:p-6`, `lg:flex-row`.
  - State variants: `hover:bg-blue-700`, `focus:outline-none`, `focus:ring-2`, `disabled:opacity-50`.
- For background images that previously used `url(${sporeGif})` in a style object, keep the `import sporeGif from "@assets/spore.gif"` and apply via a tiny inline style only when no Tailwind equivalent exists, e.g. `style={{ backgroundImage: \`url(${sporeGif})\` }}` together with Tailwind classes for `bg-cover bg-center bg-fixed`. (This is the **single allowed exception** for inline `style` — dynamic asset URLs that cannot be expressed in a class.)
- For the rotating admin logo, replace `className="rotating-logo-admin"` with `className="animate-rotate-logo"` (mapped in `tailwind.config.js`).
- For the falling logo, replace `className="site-logo-admin"` with `className="animate-fall-in"`.
- Replace Bootstrap utility classes used inline (`btn btn-primary`, `form-control`, `container py-4`, `row`, `col-md-6`, `text-center`, `mb-4`) with Tailwind equivalents (`rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700`, `w-full rounded border border-slate-300 px-3 py-2`, `mx-auto max-w-4xl py-4`, `flex flex-wrap -mx-2`, `w-full md:w-1/2 px-2`, `text-center`, `mb-4`).
- Use the same Tailwind class for the same visual role across files so the design stays consistent (extract repeating patterns into a small local constant inside the file if the same string repeats more than three times — keep it inside the `.tsx`, not in an external module).

**Acceptance:** `grep -rn "const styles = {" src` and `grep -rn "style={{ " src` together return **at most** the dynamic-background-image exceptions documented above, and nothing else.

---

## Step 5 — Drop Bootstrap and `styleUtils.ts`

**Priority:** High
**Area:** Dependencies and globals

**Fix:**
- Remove every `import "bootstrap/dist/css/bootstrap.min.css"` (currently in `Home.jsx`, `AdminLogin.jsx`, `Signin.jsx`, `Signup.jsx`, `Verifyotp.jsx`, `QuizGetStarted.jsx`, `FeedHome.jsx`).
- Uninstall `bootstrap`, `bootstrap-icons`, and `react-bootstrap` from `frontend/package.json` (`react-bootstrap` is listed but unused; confirm no remaining imports before removing).
- Delete `src/utils/styleUtils.ts`. Its only consumer is `main.tsx` and that import is removed in Step 1.
- If a Bootstrap-only icon was relied on, swap to `@mui/icons-material` (already installed) or `react-icons` (already installed).

**Acceptance:** `grep -rn "bootstrap" src` returns zero hits; `frontend/src/utils/styleUtils.ts` no longer exists; `npm install && npx vite build` succeeds.

---

## Step 6 — Convert remaining plain `.js` source files where they touch types

**Priority:** Medium
**Area:** `redux-config/`, `apis/`

**Fix:**
- Rename `redux-config/store.js` → `store.ts` and export `export type RootState = ReturnType<typeof store.getState>` and `export type AppDispatch = typeof store.dispatch`.
- Rename `redux-config/UserSlice.js` → `UserSlice.ts` and define a `UserState` interface (`user: User | Record<string, never>`, `token: string | null`, `message: string`, `isLoggedIn: boolean`).
- Optionally rename `apis/Api.js` → `Api.ts` and type the exported route constants as `const … = { … } as const`.
- Update every importer to match the new file names (no extension change usually needed with Vite, but update IDE-resolvable imports if any include `.js`).

**Acceptance:** `npx tsc -b` passes; Redux selectors in components now infer their state type from `RootState` instead of `any`.

---

## Step 7 — Lint pass and dead-code cleanup

**Priority:** Medium
**Area:** Project-wide hygiene

**Fix:**
- Remove unused imports surfaced by TypeScript after Steps 3–6 (e.g. `useDispatch` left over where only `useSelector` is needed).
- Ensure every `useEffect` dependency list is honest; TypeScript's `react-hooks` rule (if ESLint is added) catches most.
- Delete any `// @ts-ignore` comments that are no longer required.
- Remove leftover commented-out style code from the pre-migration `*.styles.ts` era.

**Acceptance:** No unused-import warnings during `vite build`; no dead style blocks.

---

## Step 8 — Final build + visual smoke test

**Priority:** Final gate
**Area:** Whole frontend

**Checklist:**
- `npm install` (after Tailwind/PostCSS added, Bootstrap removed).
- `npx tsc -b` — zero errors.
- `npx vite build` — production bundle succeeds.
- `npm run dev` — load each top-level route and confirm:
  1. `/` Home — background, copy, admin-login button visible.
  2. `/signin` and `/signup` — form fields, validation styling, password toggle.
  3. `/verify-otp`, `/forgot-password`, `/reset-password` — same layout as before.
  4. `/quiz`, `/personality` — quiz container, progress, result screen.
  5. `/feed` shell — sidebar, topbar, post composer, feed cards, story strip.
  6. Profile, profile settings (incl. delete-account confirmation).
  7. Find Friends list, follow/unfollow buttons, hover states.
  8. Direct chat list + chat window — message bubbles styled.
  9. Group chat list + window — same as above.
  10. Notifications list — sender chip, read/unread styling.
  11. Admin login + admin dashboard.
- Confirm in DevTools that **no stylesheet other than the Tailwind output is loaded** (no `bootstrap.min.css`, no inline `<style id="manasthali-global-styles">`).

**Acceptance:** All screens render with Tailwind only; build artifacts contain a single CSS bundle.

---

## Constraints / Rules during migration

- **Allowed style sources:** Tailwind `className` strings in `.tsx`, the single `src/index.css` containing only `@tailwind` directives, and the keyframe definitions inside `tailwind.config.js`.
- **Disallowed:** any new `.css`, `.scss`, `.styles.ts`, `.module.css`, CSS-in-JS object, or `style={{}}` prop except the documented dynamic-background-image exception.
- **Naming:** keep current PascalCase component names; the only file change is the extension.
- **Imports:** prefer named imports for hooks/types (`import { useState, type ReactElement } from "react"`); avoid `import React from "react"` unless `React.X` is referenced.

---

## Done ✅ — Previous Plan Items (archived)

The full bug-fix plan (former Steps 1–11 — API contracts, post/comment/share/story/notification flows, OTP/quiz, `.js` → `.jsx` renames, inlining of `*.styles.ts` files, screen-level refresh rules) has been completed and verified in code. Step 12 of that plan was a manual E2E run requiring a live backend/database/S3 and is independent of this migration.
