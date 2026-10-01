# Plan: `src/components/` review fixes

Source: three parallel reviews of `src/components/` (coding standards, performance, security).
Scope: files in `src/components/`, their importers (for the export change), and one new util file.
Do NOT touch: `src/context/*`, `src/contexts/*`, `src/data/*`, `index.css`, provider order in `App.jsx`.

## Global rules for this change

- Keep the existing `dark:` classes as they are. The rules file conflicts with the codebase here, and that decision is deferred to the user (see "Out of scope").
- Do not add new dependencies.
- Do not reformat files you aren't otherwise changing. Keep each file's existing quote and semicolon style.
- Each step must leave `npx eslint src/components` clean and `npm run build` passing.

## Step 1: Named exports (standards)

- Change all 10 components from `export default X` to `export const X = ...`.
- Update importers to `import { X } from ...`:
  - `src/App.jsx`: Layout, ScrollToTop, ProtectedRoute
  - `src/pages/Home.jsx`: Hero, JobsSection, CompaniesSection
  - `src/pages/Jobs.jsx`: RefreshButton, ConfirmationModal
  - `src/pages/JobDetail.jsx`: ConfirmationModal
  - `src/pages/AppliedJobs.jsx`: ConfirmationModal
  - `Layout.jsx`: Navbar, Footer
- Grep `src` afterwards for any remaining default import of a component.

## Step 2: New shared pieces

- `src/utils/slugify.js`: `export const getCompanyPath = (name) => \`/companies/${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}\``.
  - Use it in `CompaniesSection.jsx` and in `src/pages/Companies.jsx:269`, replacing the duplicated logic.
- `src/components/CompanyLogo.jsx`: named export `CompanyLogo({ src, name, imgClassName, fallbackClassName })`.
  - `const [failed, setFailed] = useState(false)`.
  - Render `<img>` only when `!failed` and the src is safe. Otherwise render the initial-letter fallback.
  - Guard the initial with `typeof name === 'string' ? name.charAt(0) : '?'`.
  - Image attributes: `loading="lazy" decoding="async" referrerPolicy="no-referrer" alt={\`${name} logo\`}`, `onError={() => setFailed(true)}`.
  - Safe-src check (module-level helper): accept a string that starts with `/` but not `//`, or starts with `https://`. Anything else counts as failed.
  - This replaces the DOM-mutating `onError` in CompaniesSection and JobsSection.

## Step 3: JobsSection.jsx

- Remove the unused `useNavigate` import and the `navigate` variable. This clears the lint error.
- Move to module scope: `CATEGORIES`, `SORT_FILTERS`, `JOBS_PAGE_SIZE = 6`, `formatSalary`, `getTimeAgo`.
  - `getTimeAgo` must return `'Just now'` when diff < 1h, and clamp negatives to that.
- Replace the magic number 6 everywhere: initial state, increment, and skeleton. Build the skeleton with `Array.from({ length: JOBS_PAGE_SIZE }, (_, i) => i)`.
- Category and filter click handlers must also `setDisplayCount(JOBS_PAGE_SIZE)`. Do this in the handler, not in an effect.
- The 'Recent' sort compares ISO strings directly instead of creating `new Date` in the comparator.
- Remove the dead `style={{ animationDelay }}` from the card and the skill tags. Remove the now-unused `index` and `tagIndex` params.
- Remove `backdrop-blur-xl` from the opaque card (`bg-white`). Change the card's `transition-all` to `transition-[transform,box-shadow,border-color]`.
- Use `<CompanyLogo>` for the logo.
- `to={\`/jobs/${encodeURIComponent(job.id)}\`}`.
- "Apply Now" inside the Link: change the outer `<div>` to a `<span className="... inline-block">`, so there is no block element pretending to be a button.

## Step 4: CompaniesSection.jsx

- Module-level `INDUSTRY_GRADIENTS` map, `DEFAULT_GRADIENT`, and `FEATURED_COMPANIES_COUNT = 8`.
- Compute the gradient once per card.
- `useMemo` for `companiesWithJobCounts`. Build a `Map` of company name to count in a single pass over `jobs`. Dependencies are `[companies, jobs]`.
- Remove the dead `style={{ animationDelay }}` on the card and on the stars. Drop the unused `index`.
- Remove `backdrop-blur-xl` from the opaque card. Remove the redundant `cursor-pointer`.
- Use `<CompanyLogo>` and `getCompanyPath`.
- Stars get `aria-hidden="true"`.
- Fix the indentation of the `.map` body.

## Step 5: ConfirmationModal.jsx

- Move `TYPE_STYLES` to module scope, keyed by `info | warning | danger | success`, with fallback `TYPE_STYLES[type] ?? TYPE_STYLES.info`. Delete `getTypeStyles`.
- Keep `onClose` in a ref (`onCloseRef.current = onClose` in an effect with no deps).
- The main effect depends only on `[isOpen]`:
  - `if (!isOpen) return`.
  - Save the previous `document.body.style.overflow`, set it to hidden, and restore the saved value on cleanup.
  - Add or remove the Escape listener, which calls `onCloseRef.current()`.
- Accessibility:
  - The modal container gets `role="dialog" aria-modal="true" aria-labelledby={titleId}`, using `useId`.
  - The `<h3 id={titleId}>` holds the title.
  - The backdrop gets `aria-hidden="true"`.
  - Focus the cancel button on open, using a ref.
- Confirm handler: `try { onConfirm() } finally { onClose() }`.
- Backdrop: drop `backdrop-blur-sm` and use `bg-black/60`.
- Hooks must run before the `if (!isOpen) return null`. Keep hook order valid.

## Step 6: Navbar.jsx

- Add module-level configs:
  - `NAV_LINKS` (Find Jobs, Companies).
  - `ROLE_MENUS` keyed by role: `{ to, label, iconPath, countKey? }` for job seeker (Profile, Applied Jobs with `totalAppliedJobs`, Saved Jobs with `totalSavedJobs`), employer (Post New Job, My Job Postings with `totalPostedJobs`), and admin (Company Management, Employer Management, Contact Messages).
  - Keep the existing icon paths and badge colors.
- Add a small internal `MenuIcon({ path })` component in the same file for the repeated SVG wrapper.
- Render desktop links, the dropdown items, AND the mobile menu from these configs. Mobile must now show the role links and counts, which closes a functional gap.
- Use one `handleLogout` for both desktop and mobile. It calls `logout()`, closes both menus, and navigates to `/` with replace.
- Make "Find Jobs" and "Companies" use the same inactive class (`text-gray-700 dark:text-gray-300`).
- Change the brand `<h1>` to `<span>`, because Hero already renders the page's `<h1>`.
- Accessibility:
  - User-menu button: `aria-haspopup="menu"`, `aria-expanded={showUserMenu}`.
  - Hamburger: `aria-label="Toggle navigation menu"`, `aria-expanded={isMenuOpen}`, and the icon switches to an X when open.
  - Mobile theme button: `aria-label="Toggle theme"`.
- Close the dropdown on an outside `mousedown`, using a ref on the wrapper. Close it on Escape. Close both menus when `location.pathname` changes. Use effects with cleanup.
- Safe strings: add a module-level `toText = (v) => (typeof v === 'string' ? v : '')`. Use it for `user.name`, `email`, `company` and `title`. The initial becomes `toText(user.name).charAt(0).toUpperCase()`.
- Performance: change the nav `backdrop-blur-xl` to `backdrop-blur-md` and the background to `bg-white/90 dark:bg-gray-900/90`. Change `transition-all` to `transition-colors`, and `shadow-2xl` to `shadow-lg`.

## Step 7: Footer.jsx

- Add module-level `SOCIAL_LINKS` (`{ label, href, hoverClass, iconPath }`), `SEEKER_LINKS`, `EMPLOYER_LINKS`, and `LEGAL_LINKS` (`{ label, to, tooltip }`). Map over them.
- Social `<a>` tags get `aria-label={label}`. Keep `target="_blank" rel="noopener noreferrer"`.
- Use one internal `TooltipLink` for Privacy, Cookie and Contact, so the tooltip markup is identical, including `invisible` and the arrow.
- Terms of Service has no page. Render it as a non-interactive `<span>` with the same tooltip styling. Remove the `<a>` with no href.
- Employer links: "Post a Job" goes to `/post-job`. ProtectedRoute already redirects to login. "Browse Candidates" stays `/login`.
- Copyright year: module-level `CURRENT_YEAR = new Date().getFullYear()`.
- Tooltip `transition-all` becomes `transition-opacity`.
- Wrap the export in `memo` (`export const Footer = memo(function Footer() {...})`). It is static, but it re-renders on every route change.

## Step 8: Hero.jsx

- Wrap the inputs and the button in `<form onSubmit={handleSearch}>`. `handleSearch(e)` calls `e.preventDefault()`. The button gets `type="submit"`. Delete `handleKeyPress` (the deprecated `onKeyPress`).
- Rename state to `searchQuery` and `locationQuery`. Trim both before setting params.
- Inputs: add `aria-label`s and `maxLength={100}`.
- Module-level `INPUT_CLASS` constant for the duplicated input className.
- Module-level `STATS` array for the 3 stat cards, then map over it.
- Inline styles: replace `style={{ animationDelay: '1s' }}` and `'2s'` with `[animation-delay:1s]` and `[animation-delay:2s]`.
- Performance: remove `animate-pulse` from the `bg-clip-text` "Dream Job" text span. Keep it on the glow. Add `motion-reduce:animate-none` to the pulsing blobs and the glow.

## Step 9: RefreshButton.jsx

- Compute `const cacheAgeLabel = formatCacheAge()` once per render.
- Store the visual-feedback timeout in a ref and clear it on unmount.
- In the catch: `toast.error('Failed to refresh data')` from `react-toastify`, and `console.error` only `error?.message`.
- Button: `aria-label="Refresh data"`. Collapse the multi-line template className into a single line.

## Step 10: ProtectedRoute.jsx

- Default-deny:
  - Module-level `KNOWN_ROLES = ['ROLE_JOB_SEEKER', 'ROLE_EMPLOYER', 'ROLE_ADMIN']`.
  - If `allowedRoles` is not a non-empty array, or the user's role is not in `KNOWN_ROLES`, or not in `allowedRoles`, redirect.
  - Every current route passes `allowedRoles`, so there is no behavior change.
- Role fallback: module-level `ROLE_HOME = { ROLE_JOB_SEEKER: '/jobs', ROLE_EMPLOYER: '/employer/jobs', ROLE_ADMIN: '/admin' }`. Redirect a role mismatch to `ROLE_HOME[user.role] ?? '/'`. This matches routing-and-roles.md.
- Spinner: `role="status" aria-label="Loading"`.
- Add a one-line comment that client-side guards are UX only, not a security boundary, because the role comes from localStorage.

## Step 11: ScrollToTop.jsx

- Replace the two restating comments with one comment explaining why: React Router does not reset scroll on navigation.

## Verification

1. `npx eslint src/components src/utils src/App.jsx src/pages/Home.jsx src/pages/Jobs.jsx src/pages/JobDetail.jsx src/pages/AppliedJobs.jsx src/pages/Companies.jsx` must report no new errors in touched files.
2. `npm run build` must succeed.
3. `grep -rn "export default" src/components` must return nothing.
4. `grep -rn "style={{" src/components` must return nothing.

## Out of scope (report back, don't do)

- `dark:` versus coding-standards rule (about 905 uses). This needs a user decision: amend the rule, or rewrite.
- Memoizing context values and functions in `JobsDataContext`, `CompaniesContext` and `ThemeContext` (the top perf lever), and removing debug logs there.
- AuthContext: validate the restored user shape, whitelist fields in `updateProfile` (role mass-assignment), add a cross-tab logout `storage` listener, and handle the plaintext passwords in `registeredUsers`.
- ErrorBoundary: needs a class component or a new dependency, both of which conflict with the standards.
- Duplicated `formatSalary` and `getTimeAgo` in 8 pages.
- `Login.jsx` `from` path hardening, a CSP meta tag, and Prettier config.
