# Technical Specification — Issue #9

## 1. Issue Overview

| Field | Value |
| --- | --- |
| Title | Inside the footer, when hover onto "Contact Us" nothing being displayed |
| Description | Hovering "Contact Us" in the footer shows nothing; expected descriptive text like the Cookie Policy link. |
| Labels | none (state: CLOSED, no milestone) |
| Priority | Low (cosmetic, already resolved) |

## 2. Problem Analysis

- Issue comments: owner asked `@claude fix it!`; the bot pushed branch `claude/issue-9-20260929-1925`, and PR #10 was merged (commit `246ea80`).
- Verified in `src/components/Footer.jsx` on `main`: the "Contact Us" `<Link to="/contact">` (lines 176-186) now has a hover tooltip identical in structure/styling to the Cookie Policy (165-175) and Privacy Policy (144-154) tooltips.
- Original root cause: the Contact Us link lacked the `group relative` tooltip `<div>` (`opacity-0 invisible group-hover:opacity-100 group-hover:visible`) that its siblings had.
- The bot's comment states lint, build, and browser checks were not run, so the fix is not yet verified.

## 3. Proposed Solution

No further code change is required to satisfy the issue. Remaining work is verification only.

Optional follow-ups noted while inspecting (not required by the issue):
- Terms of Service (155-164) uses a different tooltip pattern (`role="tooltip"`, no arrow, no `invisible`) than the other three links; it could be aligned.
- Tooltips appear only on `group-hover`, so keyboard focus and touch devices get nothing (`group-focus-visible:` could be added).

## 4. Step-by-Step Implementation

1. Verify build health — run `npm run lint` and `npm run build`.
2. Manual browser check — run `npm run dev`, hover each footer legal link, confirm Contact Us tooltip renders, is not clipped, and matches Cookie Policy.
3. Close out — no code changes if all checks pass; the issue is already closed.

## 5. Verification Strategy

### Unit Tests
- The repo has no test runner configured (see CLAUDE.md commands); none added.

### Integration Tests
- N/A.

### Manual Checks
- Hover "Contact Us" (desktop) → tooltip with contact text and arrow appears above the link.
- Move pointer away → tooltip hides.
- Click "Contact Us" → navigates to `/contact`.
- Narrow viewport (mobile width) → tooltip is not clipped off-screen when links wrap.
- Compare with Cookie Policy tooltip → same look and timing.

## 6. Files to Modify

| File Path | Nature of Change |
| --- | --- |
| `src/components/Footer.jsx` | None required (already fixed); optional consistency/a11y tweaks |

## 7. New Files to Create

| File Path | Purpose |
| --- | --- |
| — | None |

## 8. Existing Utilities to Leverage

| Utility | Benefit |
| --- | --- |
| Cookie Policy / Privacy Policy tooltip markup in `Footer.jsx` | Reference pattern for consistent styling |
| Tailwind `group` / `group-hover` | Existing hover mechanism; no JS needed |

## 9. Acceptance Criteria

- Hovering "Contact Us" displays explanatory text, consistent with Cookie Policy.
- `npm run lint` and `npm run build` pass.
- No regressions to other footer links or dark-mode handling (no `dark:` variants used).

## 10. Out of Scope

- Rewriting the Terms of Service tooltip, keyboard/touch accessibility, and adding a test framework, unless requested separately.
