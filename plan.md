# Manasthali — Updated Fix Plan

> Previous plan items have been moved to **Done** because they are considered completed/superseded.  
> New work starts again from **Step 1** and is focused on end-to-end working functionality, fresh data updates, JSX cleanup, and inline styling.

---

## New Steps To Do

### Step 1 — Fix broken frontend/backend API contracts first
**Priority:** Critical  
**Area:** App-wide API calls

Current issue: several frontend calls still target old or missing routes, so core screens can fail even if backend logic exists.

**Fix:**
- Update `frontend/src/apis/Api.js`:
  - `BASIC_POST_ROUTE` must be `${BASE_URL}/posts`, not `${BASE_URL}/posts/posts`.
  - `SEND_NOTIFICATION` must be `${BASE_URL}/notifications`, not `${BASE_URL}/notifications/notifications`.
  - Keep post list constants as base routes only and append `/${userId}` at call sites.
- Update `frontend/src/components/Feed/post/Post.js`:
  - Create post should call `POST /posts`, not `POST /posts/posts`.
- Update `frontend/src/components/Feed/home/FeedHome.js`:
  - Like/unlike/comment/detail/share calls should use `/posts/:id/...`, not `/posts/posts/:id/...`.
- Add missing backend routes in `backend/routes/user.route.js`:
  - `POST /email` → `checkEmail`
  - `POST /username` → `checkUsername`
- Import `checkEmail` and `checkUsername` from `user.controller.js` in `user.route.js`.
- Update `frontend/src/components/Authentication/ResetPassword.js`:
  - Send `{ token, newPassword: password }` because backend reads `newPassword`, not `password`.
- Update story fetch call in `frontend/src/components/Feed/story/Story.js`:
  - Current code calls `GET /story/${user._id}`, but backend treats this as story ID.
  - Use `GET /story/stories/user/${user._id}` for current user's stories.
- Normalize comment detail/update/delete routes later if possible:
  - Current backend creates routes like `/comments/comments/:id` because router is mounted at `/comments` and inner routes also start with `/comments`.

**Acceptance check:** signup email/username validation, reset password, create post, like/unlike, comment, notification creation, and story fetch should no longer hit 404 because of wrong URLs.

---

### Step 2 — Fix post creation and feed refresh
**Priority:** Critical  
**Area:** Post creation, home feed, media upload

Current issue: post creation is still not fully reliable and new posts do not automatically refresh the home feed.

**Fix:**
- In `backend/controller/post.controller.js` → `createPost`:
  - Do not trust `userId` from request body. Use `req.user._id`.
  - For S3 uploads, store `file.location || file.path`, not only `file.path`.
  - Validate empty description/media clearly. Decide whether text-only posts are allowed.
  - Return the created post populated with `userId`, `likes`, and `comments` so the frontend can update immediately.
- In `frontend/src/components/Feed/post/Post.js`:
  - After successful post creation, clear the form and trigger feed refresh.
  - Either pass an `onPostCreated` callback from `Feed.js` or switch to a shared `refreshFeed` state/event.
- In `backend/controller/post.controller.js`:
  - `getCommunityPosts` should guard missing user and missing community before reading `community._id`.
  - Return `200` with `posts: []` for empty feeds instead of treating empty data as an error.
  - Sort posts by latest first using `.sort({ createdAt: -1 })`.

**Acceptance check:** user creates a post, returns to home/feed, and the new post appears without manual browser refresh.

---

### Step 3 — Fix like, unlike, comment, and share end-to-end
**Priority:** Critical  
**Area:** Feed interactions

Current issue: like/comment/share UI does not consistently update backend + frontend + notifications.

**Fix:**
- In post like/unlike backend:
  - Use `req.user._id`, not `req.body.userId`.
  - Return updated `likes` array and `likeCount`.
- In `FeedHome.js`:
  - Remove `localStorage` as the source of truth for likes.
  - Use optimistic UI only with rollback if the API fails.
  - Compare IDs safely because backend may return ObjectIds or populated user objects.
- Fix comment submit flow:
  - Current comment notification uses `postId.userId`, but `postId` is only a string.
  - Find the current post object first, then use `post.userId._id || post.userId` as receiver.
  - After comment success, append the returned comment or refetch that post.
  - Render comments inside the modal; currently the modal opens but comment list area is empty.
- Fix notification payload:
  - Backend expects `receiver_id`, `notification_type`, and `sender_id`.
  - Frontend currently sends `userId` in some places. Replace with `receiver_id`.
- Implement share button in `FeedHome.js`:
  - Add `onClick={() => handleShare(post)}`.
  - Call `POST /posts/:id/share`.
  - Update `shares` count in local state after success.
  - Render shared post reference clearly if `shared_post_id` exists.
- In `backend/controller/comment.controller.js`:
  - `getCommentDetails` should populate `userId`, not `user_id`.
  - `deleteComment` currently decrements `post.comment_count`, but `postSchema` has no `comment_count`. Remove this or add the schema field intentionally.

**Acceptance check:** like count, unlike state, comment count, comment list, share count, and notification records update correctly on the same screen without stale data.

---

### Step 4 — Fix stories end-to-end
**Priority:** High  
**Area:** Stories upload/view/like/comment/view count

Current issue: story fetch is using the wrong endpoint, story media rendering is incorrect for S3 URLs/arrays, and the UI only handles a very limited current-user story flow.

**Fix:**
- In `Story.js`:
  - Fetch current user's stories from `/story/stories/user/:userId`.
  - For the story strip, also fetch all stories from `/story/stories` if stories from other users should be visible.
  - Display `story.media?.[0]` or the direct media URL. Do not prefix S3 URLs with `BASE_URL`.
  - After upload, update state immediately or refetch stories.
- In `backend/controller/story.controller.js`:
  - Use `req.user._id` instead of trusting `userId` from body.
  - Validate that a media file exists before saving.
  - Keep `media` shape consistent: either always array or always string.
  - Populate `userId` with `username profile_picture`, not `name email`.
  - Add 24-hour story filtering if this is intended to behave like social-media stories.
- Add frontend actions if required:
  - like story
  - comment on story
  - record story view

**Acceptance check:** upload story → story ring updates → story opens and shows correct image → view count/like/comment update if those actions are exposed.

---

### Step 5 — Fix profile, profile settings, and global user data refresh
**Priority:** High  
**Area:** Profile screen, settings screen, Redux user state

Current issue: profile updates are saved in backend but not consistently reflected across `Feed`, profile screen, right-side profile image, settings screen, followers/following, and chat lists.

**Fix:**
- Use one user source of truth:
  - After every profile update, dispatch `updateUserProfile(response.data.user)`.
  - Also update `Feed.js` `profileData` or refetch it after setting changes.
- In `ProfileSetting.js`:
  - After updating contact, DOB, gender, bio, or profile picture, update Redux user state.
  - Clear/reset the specific form input after success if needed.
- In `Profile.js`:
  - Posts count currently reads `user.posts`, but `User` model has no `posts` field.
  - Fetch posts from `GET /posts/getUserPosts/:userId` and show count from that response.
  - `showPosts` toggles state but does not render posts. Add rendering or remove the toggle.
  - Profile photo upload handlers exist but no visible UI calls them. Either add upload UI or remove dead handlers.
- In `App.js`:
  - `/profile` currently renders `ProfileSetting`, not the actual profile view. Rename route to `/settings` or render the correct profile component.
- In delete account flow:
  - Only delete if the user typed the required confirmation value, e.g. `yes`.
  - After delete, sign out and navigate to `/signin`.

**Acceptance check:** update profile picture/bio/contact → header profile image, profile page, settings page, feed cards, and chat user card should show updated data without manual refresh.

---

### Step 6 — Fix friends, followers, following, DM list, and chat refresh
**Priority:** High  
**Area:** Find friends, direct chat, group chat

Current issue: follow/unfollow updates only the local list where the action happened. Other screens like profile counts and DM list can stay stale.

**Fix:**
- After follow/unfollow:
  - Refetch following/followers where needed.
  - Refresh DM list because DM list depends on followers/following.
  - Refresh profile counts.
- In direct chat:
  - Backend `getMessages` should return `200` with `messages: []` for empty conversations instead of `404`.
  - Keep one stable socket connection per logged-in user and clean up listeners with `socket.off(...)`.
- In group chat backend:
  - Protect `POST /groups/create` with `auth`; currently route is public while controller expects `req.user` for `createdBy`.
  - Compare ObjectIds using `.some(id => id.toString() === req.user._id.toString())` instead of relying on `.includes()`.
  - `getGroupMessages` must check that the current user is a group member before returning messages.
  - Sort group messages oldest to newest using `.sort({ createdAt: 1 })`.
- In group chat frontend:
  - Refetch joined groups after join/leave.
  - Ensure newly sent group messages appear in correct chronological order.

**Acceptance check:** follow a user → they appear in chat list; unfollow → list/counts update; join group → group appears in group chat; group messages load and send in correct order.

---

### Step 7 — Fix notifications read state and sender display
**Priority:** Medium  
**Area:** Notification screen

Current issue: notifications can be fetched but cannot be marked as read from the route/UI, and sender is shown as a raw ID.

**Fix:**
- In `backend/routes/notification.route.js`:
  - Add route for `markNotificationAsRead`, e.g. `PATCH /:id/read`.
  - Import `markNotificationAsRead` from controller.
- In `backend/controller/notification.controller.js`:
  - Populate `sender_id` with `username profile_picture` in `getUserNotifications`.
  - Sort newest first.
- In `Notification.js`:
  - Show sender username/profile picture instead of raw sender ID.
  - Add click/action to mark as read.
  - Update local state after read success.

**Acceptance check:** like/comment creates notification → receiver sees readable notification → click marks it read and UI style changes immediately.

---

### Step 8 — Fix signup, OTP, quiz, and auth refresh state
**Priority:** Medium  
**Area:** Authentication and onboarding

Current issue: signup validation routes are missing, regular OTP expiry is not enforced, and after quiz submission the Redux user can remain stale.

**Fix:**
- Register `/users/email` and `/users/username` as mentioned in Step 1.
- In regular signup:
  - Save `otpExpiresAt` when OTP is generated.
  - In `verifyOtp`, check expiry and clear `otpExpiresAt` after success.
- In quiz flow:
  - Backend already returns `personality_type`; frontend should update Redux user with this value or refetch `/users/:id` after submit.
  - Navigate to feed only after local user state has the updated personality type.
- Add auth persistence if required:
  - Store token/user in `localStorage` or handle refresh cleanly by redirecting to sign-in.

**Acceptance check:** signup → email/username validation works → OTP expires correctly → quiz updates user personality → feed does not redirect back to quiz after refresh/state changes.

---

### Step 9 — Convert React component files to `.jsx` where JSX is used
**Priority:** Medium  
**Area:** Frontend file structure

Current issue: most React component files contain JSX but still use `.js`. Vite supports this, but `.jsx` is cleaner and easier to identify.

**Fix:**
- Rename component files that return JSX from `.js` to `.jsx`.
- Keep non-JSX utility/store/API files as `.js` or `.ts` as appropriate.
- Update all imports after renaming.
- Suggested examples:
  - `App.js` → `App.jsx`
  - `Feed.js` → `Feed.jsx`
  - `FeedHome.js` → `FeedHome.jsx`
  - `Story.js` → `Story.jsx`
  - `Post.js` → `Post.jsx`
  - `ChatList.js` → `ChatList.jsx`
  - `GroupChat.js` → `GroupChat.jsx`
  - Auth, Quiz, Profile, Admin components → `.jsx`
- Keep `main.tsx` as-is unless the project wants a pure JS setup.

**Acceptance check:** frontend builds after rename and all imports resolve correctly.

---

### Step 10 — Move styling inline / colocated inside component files
**Priority:** Medium  
**Area:** Frontend styling standard

Current issue: styling is split into many `*.styles.ts` files. Requested standard is no additional styling files and inline/component-local styling.

**Fix:**
- For every component importing `* as styles from "./X.styles"`:
  - Move the style objects into the same `.jsx` component file.
  - Remove the external `*.styles.ts` file after migration.
- Keep styling in one of these formats only:
  - Direct inline JSX style: `style={{ padding: 16, borderRadius: 12 }}`
  - Component-local object in the same file:
    ```jsx
    const styles = {
      card: {
        padding: 16,
        borderRadius: 12,
      },
    };
    ```
- Do not create new CSS or style files.
- Remove custom Bootstrap dependency usage where the same styling is already handled inline.
- Keep third-party library CSS only if the library requires it and replacement is not practical, e.g. toast styles.
- Review `frontend/src/utils/styleUtils.ts`; if global injected styles are not required, remove it and keep styles inside components.

**Acceptance check:** no component depends on `*.styles.ts`; UI still looks the same after migration; no new CSS/styling files are added.

---

### Step 11 — Add screen-level data refresh rules
**Priority:** Medium  
**Area:** Updated data across every screen

Current issue: many operations update backend but only partially update frontend state.

**Fix rules:**
- After create post → refresh feed and profile post count.
- After like/unlike → update that post on current feed and profile post list.
- After comment → update comment count and comment list.
- After share → update share count and show shared post.
- After story upload/delete/like/comment/view → refresh story strip and viewer state.
- After profile setting update → refresh Redux user, feed header, profile page, post cards, and chat user display.
- After follow/unfollow → refresh find friends, profile counts, and DM list.
- After group join/leave → refresh group list and group chat list.
- After notification read → update notification list immediately.

**Acceptance check:** user should not need browser refresh after any create/update/delete action.

---

### Step 12 — Execute final E2E verification checklist
**Priority:** Final QA gate  
**Area:** Full app regression

Run this checklist after Steps 1–11:

1. Signup → verify OTP → sign in.
2. Submit quiz → user gets personality → feed opens.
3. Create post with image → feed updates.
4. Create text-only post if supported → feed updates, or validation message appears if not supported.
5. Like/unlike post → count and icon update.
6. Add comment → count and modal list update.
7. Share post → share count updates and shared post is visible.
8. Upload story → story ring updates → story opens with correct image.
9. Like/comment/view story if UI exposes these actions.
10. Open profile → followers/following/post counts are correct.
11. Update profile picture/bio/contact/DOB/gender → every screen shows fresh data.
12. Follow user → profile count and DM list update.
13. Send direct message → receiver gets real-time message.
14. Join group → group appears in group chat.
15. Send group message → members receive it in real time.
16. Like/comment notification appears for receiver.
17. Mark notification as read → read style updates.
18. Delete account → user signs out and cannot access protected screens.
19. Refresh browser on protected screens → app handles auth state cleanly.
20. Run frontend build and backend start smoke test.

---

## Done ✅ — Previous Plan Items Moved Here

The following work was already listed in the previous `plan.md` and is now treated as done/superseded:

- Backend critical route ordering fixes for user/story routes.
- Backend double-prefix cleanup for post and notification routes.
- Backend controller crash fixes around comments, notifications, communities, groups, admin login, and Google OAuth.
- Socket.IO chat event alignment and private room join flow.
- Group chat URL and response-shape fixes.
- JWT expiry and JWT payload standardization.
- Sensitive fields removed from sign-in response.
- Follow/unfollow security updated to use authenticated user.
- CORS moved to environment-based frontend origin.
- Admin signup, mental coach, and badge route protection work.
- Forgot/reset password backend security fixes.
- Notification query/read logic fixes from earlier plan.
- Story controller fixes from earlier plan.
- Badge/user schema fixes from earlier plan.
- Duplicate mental coach route cleanup.
- Backend route registration/startup cleanup from earlier plan.
- Post no-community guard and status-code cleanup.
- Frontend route protection and earlier story/profile/feed bug fixes.
- Debounce fixes in group/friend search.
- Per-post comment state fix in feed.
- Admin and profile toast cleanup from earlier plan.
- Dead code/debug cleanup from earlier plan.
- Vite migration, environment config, asset alias, README update, and previous CSS-to-style-object migration.

---

## Notes From Current Inspection

- This plan is based on static inspection of the uploaded codebase. Runtime testing was not executed because dependencies/environment variables/database/S3 credentials are not available inside the uploaded ZIP.
- Highest risk areas are API route mismatches, post/story media URL handling, stale frontend state after mutations, and notification payload mismatch.
- Do Step 1 first. Many downstream screens cannot be tested properly until route contracts are aligned.