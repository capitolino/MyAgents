# UX Reference Patterns

## Accessibility Checklist (WCAG 2.1 AA)

### Perceivable
- [ ] All images have meaningful `alt` text (decorative images: `alt=""`)
- [ ] Color is not the only way to convey information
- [ ] Text contrast ratio ≥ 4.5:1 (normal text), ≥ 3:1 (large text ≥18pt or 14pt bold)
- [ ] UI component contrast ratio ≥ 3:1 against adjacent colors
- [ ] No content flashes more than 3 times per second
- [ ] Videos have captions; audio has transcripts

### Operable
- [ ] All functionality accessible via keyboard alone
- [ ] No keyboard traps — user can always navigate away
- [ ] Focus visible at all times (never `outline: none` without alternative)
- [ ] Focus order is logical (matches visual/reading order)
- [ ] Touch targets ≥ 44×44 CSS pixels
- [ ] Skip navigation link for screen reader users

### Understandable
- [ ] Page language declared (`<html lang="en">`)
- [ ] Labels on all form inputs (`<label>` or `aria-label`)
- [ ] Error messages identify the field and explain how to fix
- [ ] Required fields marked (not just by color)
- [ ] No unexpected context changes on focus/input

### Robust
- [ ] Valid HTML (no duplicate IDs)
- [ ] ARIA roles used correctly — prefer native HTML elements first
- [ ] Dynamic content updates announced with `aria-live` where appropriate

---

## Semantic HTML Quick Reference

| Use case | Correct element |
|----------|----------------|
| Navigation links | `<nav>` |
| Main page content | `<main>` |
| Page sections | `<section aria-labelledby="...">` |
| Standalone content | `<article>` |
| Complementary content | `<aside>` |
| Clickable action | `<button>` (never `<div onclick>`) |
| Page-level heading | `<h1>` (one per page) |
| Dialog/modal | `<dialog>` or `role="dialog"` with `aria-modal="true"` |
| Alert messages | `role="alert"` (for urgent) or `aria-live="polite"` |

---

## UX Patterns

### Forms
```
Good form pattern:
  <label for="email">Email address <span aria-hidden="true">*</span></label>
  <input id="email" type="email" required aria-describedby="email-error" />
  <span id="email-error" role="alert">Please enter a valid email address</span>

Rules:
- Validate on blur, not on each keystroke
- Show inline errors next to the field, not just at top
- Never clear fields on validation error
- Disable submit only after first submit attempt, not before
```

### Loading States
```
- Show skeleton screens for content (better than spinners for layouts)
- Show progress for operations > 1s
- Disable interactive elements during async operations
- For long operations, show estimated progress or "Still working..."
```

### Empty States
```
- Always provide an empty state message (never a blank white area)
- Explain WHY it's empty + what the user can do
- Example: "No invoices yet. Create your first invoice →"
```

### Error Messages
```
❌ "An error occurred"
❌ "Invalid input"
✅ "Email address is already registered. Sign in instead?"
✅ "Password must be at least 8 characters and include a number"
```

### Destructive Actions
```
- Always confirm before delete/irreversible actions
- Use red/danger color for destructive buttons
- Default focus on the safe option (Cancel), not the destructive one
- Explain consequences: "This will permanently delete 3 invoices"
```

---

## Responsive Design

### Breakpoints (mobile-first)
```css
/* Base: mobile (< 640px) */
/* sm: 640px+ */
/* md: 768px+ */
/* lg: 1024px+ */
/* xl: 1280px+ */
```

### Touch targets
- Minimum 44×44px for all interactive elements
- Add padding to small elements rather than increasing font size
- Spacing between targets ≥ 8px

### Common responsive patterns
- **Stack on mobile**: multi-column layouts become single column
- **Off-canvas navigation**: sidebar becomes drawer on mobile
- **Priority+**: show primary actions, hide secondary behind "more"
- **Table → cards**: wide tables become card lists on mobile

---

## Component Design Principles

### Spacing scale
Use a consistent 4px or 8px base grid. Avoid arbitrary pixel values.
```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128
```

### Typography scale
Define named scales, not arbitrary sizes:
- `text-xs` (12px) — captions, labels
- `text-sm` (14px) — secondary text
- `text-base` (16px) — body (minimum readable size)
- `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px) — headings

### Color tokens
Avoid hardcoded colors. Use semantic tokens:
```
--color-primary, --color-primary-hover
--color-danger, --color-danger-hover
--color-text, --color-text-muted
--color-bg, --color-bg-surface, --color-bg-overlay
--color-border
```
