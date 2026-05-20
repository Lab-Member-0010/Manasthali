# Manasthali — Fix Plan

> Issues are ordered by severity. Work top-to-bottom within each phase.
> ✅ = already fixed in earlier sessions | 🔧 = needs work

---

## Phase 1 — Critical crashes (backend routes & controllers)

### 1.1 Route ordering — `routes/user.route.js` 🔧
`GET /:id` is registered before all named routes (`/dmlist/:id`, `/get-community-users/:id`, `/get-all-users-except/:id`, etc.), making every specific GET route permanently unreachable.
**Fix:** Move `router.get("/:id", auth, getUserById)` to the very end of the file.

### 1.2 Route ordering — `routes/story.route.js` 🔧
`GET /:id` shadows every `/stories/*` sub-route. Same pattern as above.
**Fix:** Move `router.get('/:id', auth, getStoryByID)` to the end.

### 1.3 Double route prefix — `routes/post.route.js` 🔧
Router is mounted at `/posts` in `app.js`, but every route inside is already prefixed with `/posts`. All post routes live at `/posts/posts/...`.
**Fix:** Remove `/posts` prefix from every route inside `post.route.js` (e.g., `'/posts'` → `'/'`, `'/posts/:id'` → `'/:id'`).

### 1.4 Double route prefix — `routes/notification.route.js` 🔧
Same issue. Routes mount at `/notifications/notifications` instead of `/notifications`.
**Fix:** Remove inner `/notifications` prefix from route definitions.

### 1.5 `controller/comment.controller.js` — global `request`/`response` used instead of `req`/`res` 🔧
`updateComment` and `getCommentDetails` reference the module-level `request`/`response` imports from Express instead of the `req`/`res` function parameters. Both crash on every call.
**Fix:** Replace every `request.` and `response.` inside those two functions with `req.` and `res.`. Remove the import.

### 1.6 `controller/notification.controller.js` — `receiver_id` undefined 🔧
`sendNotification` references `receiver_id` which is never destructured. Body has `userId`, but the field name in the model is `receiver_id`.
**Fix:** Destructure `receiver_id` from `req.body` (or rename the body field to match).

### 1.7 `controller/community.controller.js` — `Group` not imported 🔧
`getGroupsInCommunity` calls `Group.find(...)` but only `Community` is imported.
**Fix:** Add `import { Group } from '../model/group.model.js'`.

### 1.8 `controller/group.controller.js` — `createdBy` missing from schema, null-crash on update/delete 🔧
`updateGroup` and `deleteGroup` access `group.createdBy` which is not in `groupSchema`. Result: always crashes with TypeError.
**Fix (two parts):**
- Add `createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }` to `groupSchema`.
- Add `createdBy: req.user._id` when creating a group.
- Add null guard: `if (!group) return res.status(404).json(...)` before the auth check.

### 1.9 `controller/Admin.controller.js` — null crash on unknown username 🔧
`AdminLogin` accesses `admin.token` before checking if `admin` is null.
**Fix:** Add `if (!admin) return res.status(404).json({ error: 'Admin not found' })`.

### 1.10 Google OAuth — routes never mounted + `googleId` missing from User schema 🔧
`googleauth.routes.js` is never imported or `app.use()`'d in `app.js`. Also, `User` model has no `googleId` field, so every OAuth login creates a new orphaned user.
**Fix (two parts):**
- Add `import googleAuthRouter from './routes/googleauth.routes.js'` and `app.use('/auth', googleAuthRouter)` in `app.js`.
- Add `googleId: { type: String }` to `userSchema`.

---

## Phase 2 — Chat system (see Phase 2 detail below)

### 2.1 Socket.IO event name mismatches 🔧 *(fixed in this session)*
Frontend and backend use different event names for every real-time event. Zero messages are delivered in real time.

### 2.2 User never joins their own socket room (DMs not delivered) 🔧 *(fixed)*
Backend emits DMs to `io.to(receiverId)` but no code ever calls `socket.join(userId)`.

### 2.3 Group chat API URLs wrong in frontend 🔧 *(fixed)*
Frontend calls `/messages/send` and `/messages/:id` but the router mounts at `/groupchat`.

### 2.4 Group message response shape mismatch 🔧 *(fixed)*
Backend returns `{ data: messages }` but frontend reads `response.data.messages`.

---

## Phase 3 — Security

### 3.1 JWT tokens never expire 🔧
`jwt.sign({ payload: userId }, secretKey)` — no `expiresIn`.
**Fix:** Add `{ expiresIn: '7d' }` as the third argument.

### 3.2 JWT payload key mismatch (Google OAuth vs regular auth) 🔧
Regular auth signs `{ payload: userId }`. Google OAuth signs `{ id: user._id }`. Auth middleware decodes `decoded.payload`. Google users can never reach protected routes.
**Fix:** Standardise all `jwt.sign()` calls to use `{ payload: user._id }` and update auth middleware to use `decoded.payload`.

### 3.3 Password / OTP / resetToken returned in SignIn response 🔧
Full user document is returned including `password`, `otp`, `resetToken`.
**Fix:** Use `.select('-password -otp -resetToken -resetTokenExpiry')` in the SignIn query, or spread only the safe fields.

### 3.4 Follow/unfollow userId taken from request body 🔧
Any authenticated user can follow/unfollow on behalf of any other user.
**Fix:** Use `req.user._id` from auth middleware instead of `req.body.userId`.

### 3.5 CORS is fully open 🔧
`app.use(cors())` allows all origins.
**Fix:** `app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))`.

### 3.6 Admin signup is unauthenticated 🔧
Any request can create an admin account.
**Fix:** Add `auth` middleware to `POST /admin/signUp`, or add a secret-key check.

### 3.7 `/mental-coach/ask` has no auth 🔧
Anyone can consume Gemini API quota.
**Fix:** Add `auth` middleware to the route.

### 3.8 Badge routes have no auth 🔧
`getUserBadges` and `getTodayBadge` are unprotected.
**Fix:** Add `auth` middleware.

### 3.9 Email enumeration in `forgotPassword` 🔧
Returns HTTP 404 when the email is not found, revealing account existence.
**Fix:** Always return 200 with `"If this email exists, a reset link has been sent."`.

### 3.10 `resetPassword` validator/controller field name mismatch 🔧
Validator checks `newPassword`; controller reads `password`. Password is always `undefined`.
**Fix:** Change `const { token, password } = req.body` → `const { token, newPassword: password } = req.body`.

---

## Phase 4 — Logic bugs

### 4.1 `controller/notification.controller.js` — `getUserNotifications` queries wrong field 🔧
Queries `sender_id: userId` instead of `receiver_id: userId`. Users see notifications they sent, not received.
**Fix:** Change `{ sender_id: userId }` → `{ receiver_id: userId }`.

### 4.2 `controller/notification.controller.js` — `markNotificationAsRead` missing `return` 🔧
After the 400 response, execution continues and crashes on `null.read_status = true`.
**Fix:** Add `return` before the 400 response.

### 4.3 `controller/story.controller.js` — multiple bugs 🔧
- `getStoryByID`: checks `if (!storyId)` instead of `if (!story)`.
- `viewStory`: uses `req.params.id` for both `storyId` AND `userId`.
- `CommentStory`: pushes `userId, text` as two separate values instead of `{ userId, text }`.
- `uploadStory`: uses `req.file.filename` (Cloudinary public_id) instead of `req.file.path` (Cloudinary URL).
- `getUserStories`: function body is completely empty — every call hangs forever.

### 4.4 `model/badge.model.js` — missing `userId` field 🔧
All badge queries and creates reference `userId` which is not in the schema. All badge data is silently lost.
**Fix:** Add `userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }` to `badgeSchema`.

### 4.5 `model/user.model.js` — missing `otpExpiresAt` field 🔧
Google OAuth sets `user.otpExpiresAt` on save, silently dropped. OTP expiry is never enforced.
**Fix:** Add `otpExpiresAt: { type: Date }` to `userSchema`.

### 4.6 `app.js` — duplicate `mentalCoachRouter` mount 🔧 *(fixed in this session)*
Same router at both `/mentalCoach` and `/mental-coach`.
**Fix:** Remove one of the two `app.use()` lines.

### 4.7 `app.js` — routes registered inside DB connection callback 🔧
If DB connection is slow or fails, zero routes are registered with no error feedback.
**Fix:** Register routes unconditionally; handle DB failure with a startup check that exits the process.

### 4.8 `controller/post.controller.js` — crashes when user has no community 🔧
`Community.findOne(...)` returns `null` for users without a personality type. `community._id` crashes immediately.
**Fix:** Add `if (!community) return res.status(400).json({ error: 'Take the personality quiz first' })`.

### 4.9 Wrong HTTP status codes 🔧
`getPostDetails` and `deletePost` both return 201 instead of 200 (201 = Created).
**Fix:** Change to `res.status(200)`.

---

## Phase 5 — Frontend bugs

### 5.1 `Story.js` — broken template literal 🔧
```js
// Wrong — double quotes, not backticks:
await axios.post("${BASE_URL}/story/stories", ...)
// Fix:
await axios.post(`${BASE_URL}/story/stories`, ...)
```

### 5.2 `ProfileSetting.js` — wrong Redux selector 🔧
`state.UserSlice?.user` → should be `state.user?.user`.

### 5.3 `Profile.js` — `updateProfile` prop never passed from `Feed.js` 🔧
`handleFollowToggle` calls `updateProfile(user)` but `Feed.js` only passes `updateProfilePicture`. Crashes on every follow/unfollow.
**Fix:** Either pass `updateProfile` from `Feed.js` or remove the call from `Profile.js`.

### 5.4 `Profile.js` — profile picture upload has no `Authorization` header 🔧
`handleProfilePicUpload` omits the JWT header on the PUT request.
**Fix:** Add `headers: { Authorization: 'Bearer ${token}', 'Content-Type': 'multipart/form-data' }`.

### 5.5 `Profile.js` — `togglePosts` mutates state to boolean 🔧
`setPosts((prev) => !prev)` converts the array to `true`/`false`, breaking any subsequent `.map()`.
**Fix:** Manage post visibility with a separate boolean state (`const [showPosts, setShowPosts] = useState(false)`).

### 5.6 `Profile.js` — `"/default_profile.jpg"` 404 in Vite 🔧
File is in `assets/`, not `public/`. Use the imported `defaultUser` variable instead of the raw string path.

### 5.7 `Story.js` — `"./default_profile.jpg"` 404 in Vite 🔧
Same issue. Import from `@assets/default_profile.jpg` or use `/user.png` from `public/`.

### 5.8 `App.js` — `/profile` and `/notifications` routes unprotected 🔧
Both routes access Redux user state directly. Unauthenticated access crashes immediately.
**Fix:** Wrap both with `<Auth>`.

### 5.9 `Signin.js` — link to `/Signup` (capital S) 🔧
React Router v6 is case-sensitive. Route is defined as `/signup`.
**Fix:** Change to `/signup`.

### 5.10 `communityAdmin.js` — `useEffect` missing dependency array (infinite loop) 🔧
No `[]` means the effect runs after every render, triggering infinite fetches.
**Fix:** Add `[]` as the second argument.

### 5.11 `Group.js` and `FindFriend.js` — debounce recreated every render 🔧
`debouncedSearch` is defined inside the component without `useCallback`, so a new debounce instance is created every render, making debouncing non-functional.
**Fix:** Wrap with `useCallback(debounce(...), [])` or move debounce outside the component.

### 5.12 `Groups.js` (Admin) — form field name mismatch 🔧
Input binds `value={formData.group_name}` but state key is `name`. Input always renders blank.
**Fix:** Change to `value={formData.name}`.

### 5.13 `FeedHome.js` — `newComment` shared across all posts 🔧
A single string controls every post's comment box. Text typed in one post submits for another.
**Fix:** Use per-post comment state (e.g., `const [comments, setComments] = useState({})` keyed by post ID).

### 5.14 `AdminLogin.js` — hardcoded `username: "admin"` 🔧
Admin login always sends `"admin"` regardless of what was typed.
**Fix:** Add a username input field and bind it to state.

### 5.15 `ProfileSetting.js` — `toast.success(message)` shows empty string 🔧
`setMessage(...)` is async but `toast.success(message)` fires before state update.
**Fix:** Pass the string directly: `toast.success("Profile picture updated successfully!")`.

---

## Phase 6 — Dead code / cleanup

| File | Issue |
|---|---|
| `middleware/socket.js` | Orphaned file — references `io` from nowhere, never imported. Delete it. |
| `model/mentalCoach.model.js` | Defined but never imported or used by the controller. |
| `controller/community.controller.js` | `getAllCommunities` and `getCommunities` are identical. Remove one. |
| `UserSlice.js` | `likedPosts: {}` initial state never read or written. Remove it. |
| `FeedHome.js` | `emojiPickerVisible` state never read in JSX. Remove it. |
| `Profile.js` | `handleFileChange` and `handleProfilePicUpload` defined but no UI calls them. |
| `Profile.js` | `console.log(filteredUsers)` left in render. Remove it. |
| `Home.js` | `InfoIcon` imported but unused. |
| `Home.js` | `handleAboutToggle` and About Modal unreachable — no trigger button. |
| `UserSlice.js` | `console.log(action.payload)` in `setUser` reducer leaks auth token. Remove it. |
| `FeedHome.js` | Multiple `console.log` debug statements. Remove them. |
| `MentalCoach.js` | Local `isLoggedIn` state always true — `state.user` is never null. Remove the local state and effect. |

---

## Phase 7 — tsconfig `@assets` alias (TypeScript path)

The Vite alias `@assets` resolves correctly at build time, but `tsc -b` will fail because `tsconfig.app.json` has no matching `paths` entry.
**Fix:** Add to `tsconfig.app.json` compilerOptions:
```json
"paths": {
  "@/*": ["./src/*"],
  "@assets/*": ["../assets/*"]
}
```

---

## Done ✅ (fixed in previous sessions)

- All frontend backend URLs moved to `VITE_API_URL` env var
- CRA → Vite migration (vite.config.ts, tsconfig, index.html, main.tsx)
- All CSS files removed, converted to TypeScript `React.CSSProperties` style objects
- `assets/` alias added to vite.config.ts
- `backgroundImage` strings converted to Vite-processed asset imports
- Backend `.env` and `.env.example` created with all required variables
- Backend `app.js` Socket.IO CORS moved to `process.env.FRONTEND_URL`
- Google OAuth callback URL moved to `process.env.GOOGLE_CALLBACK_URL`
- Backend `.gitignore` created
- README.md rewritten for GitHub
