# Technical Specification — Issue #2

## 1. Issue Overview

| Field | Value |
| --- | --- |
| Title | Inside the footer, when hover onto "Cookie Policy" nothing being displayed |
| Description | Hovering "Cookie Policy" in the footer shows no text; expected descriptive text about the Cookie Policy. |
| Labels | none (state: CLOSED, no milestone, no comments) |
| Priority | Low (cosmetic, already resolved) |

## 2. Problem Analysis

- No issue comments or discussion; only a screenshot (not inspectable here).
- Verified in `src/components/Footer.jsx` on `main`: the "Cookie Policy" `<Link to="/cookie-policy">` (lines 165-175) already has a `group relative` hover tooltip with text ("We use cookies to keep you signed in, ... Click to read our full Cookie Policy.") and an arrow, styled like the Privacy Policy and Contact Us tooltips.
- Git history: commit `f3115f0` "Add hover tooltip to Cookie Policy footer link" introduced the tooltip, so the issue is already fixed.
- Route `cookie-policy` is registered in `src/App.jsx:141` and `src/pages/CookiePolicy.jsx` exists, so click navigation works.
- Not verified: rendering in a browser (no run performed during this analysis).

## 3. Proposed Solution

No code change required. Remaining work is verification only.

Optional follow-ups (not required by the issue):
- Terms of Service tooltip (lines 155-164) uses a different pattern (`role="tooltip"`, no arrow, no `invisible`) than the other three links; could be aligned.
- Tooltips show only on `group-hover`; keyboard focus and touch get nothing (`group-focus-visible:` could be added).

## 4. Step-by-Step Implementation

1. Verify build health — run `npm run lint` and `npm run build`.
2. Manual browser check — `npm run dev`, hover Cookie Policy in the footer, confirm tooltip appears, is not clipped, and text is readable.
3. Close out — no code changes if checks pass; issue is already closed.

## 5. Verification Strategy

### Unit Tests
- No test runner is configured (see CLAUDE.md commands); none added.

### Integration Tests
- N/A.

### Manual Checks
- Hover "Cookie Policy" → tooltip with cookie text appears above the link, fades in.
- Move pointer away → tooltip hides.
- Click link → navigates to `/cookie-policy`.
- Narrow viewport (mobile widths) → tooltip (w-64) not clipped off-screen.

## 6. Files to Modify

| File Path | Nature of Change |
| --- | --- |
| None | Already implemented in `src/components/Footer.jsx` |

## 7. New Files to Create

| File Path | Purpose |
| --- | --- |
| None | — |

## 8. Existing Utilities to Leverage

| Utility | Benefit |
| --- | --- |
| Tailwind `group` / `group-hover` tooltip pattern in `Footer.jsx` | Consistent with sibling footer links |

## 9. Acceptance Criteria

- Hovering "Cookie Policy" displays descriptive cookie text.
- Lint and build pass.
- No regressions on other footer links.

## 10. Out of Scope

- Rewriting `CookiePolicy.jsx` page content.
- Unifying all footer tooltips into a shared component.
- Keyboard/touch tooltip accessibility.
