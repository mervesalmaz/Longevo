# Longevo design system — how to build with it

Longevo is a **Tailwind CSS** component library (shadcn-style, built on Radix UI and
Base UI). You style by composing library components and adding Tailwind utility classes —
there is no separate theme-provider or style-prop API.

## Setup

No provider wrapper is required. All theming is delivered as CSS custom properties defined
on `:root` (light) and `.dark` (dark) in the shipped `styles.css`. Every color utility below
resolves to `hsl(var(--token))`, so components are correctly themed as long as `styles.css`
is loaded. **For dark mode, add `class="dark"` to an ancestor element** — the tokens flip
automatically.

Components accept a `className` prop that is merged with their internal classes (via
`clsx` + `tailwind-merge`), so your utilities always win over defaults.

## The styling idiom — use these semantic token utilities, never raw hex

Color utilities are backed by design tokens. Prefer them over literal colors:

| Utility family | Use for |
|---|---|
| `bg-primary` / `text-primary-foreground` | primary actions, emphasis (near-black in light, near-white in dark) |
| `bg-secondary` / `text-secondary-foreground` | secondary surfaces and buttons |
| `bg-muted` / `text-muted-foreground` | subtle backgrounds, secondary/help text |
| `bg-accent` / `text-accent-foreground` | hover/active surfaces |
| `bg-destructive` / `text-destructive-foreground` | destructive actions, errors |
| `bg-card` / `text-card-foreground`, `bg-popover` / `text-popover-foreground` | card & popover surfaces |
| `bg-background` / `text-foreground` | page surface & default text |
| `border-border`, `border-input`, `ring-ring` | borders, input borders, focus rings |
| `bg-longevo-green` (`#00AA6C`) | **the brand accent** — ratings, verified badges, key CTAs |

Radius: `rounded-md` / `rounded-lg` (from `--radius`). Typography: base `text-sm`/`text-base`,
`font-medium`/`font-semibold`, muted copy via `text-muted-foreground`.

Interactive components (`Button`, `Badge`, `Tabs`) expose `variant` (and some a `size`) prop —
use those for the built-in looks rather than re-styling: e.g. `<Button variant="outline" size="sm">`,
`<Badge variant="secondary">`. For the brand accent on a badge:
`<Badge className="border-transparent bg-longevo-green text-white">Verified</Badge>`.

## Where the truth lives

- `styles.css` — the token definitions and utility layer (read it before choosing colors).
- `components/<group>/<Name>/<Name>.d.ts` — the exact prop contract for each component.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage notes.
- Compound components ship as parts: e.g. `Card` + `CardHeader`/`CardTitle`/`CardDescription`/
  `CardContent`/`CardFooter`; `Table` + `TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell`;
  `Dialog`, `AlertDialog`, `Sheet`, `Select`, `DropdownMenu`, `Tabs` each with their sub-parts.
  Overlays (`Dialog`, `AlertDialog`, `Sheet`) render open via their `*Content` part inside the root.

## One idiomatic example

```tsx
<Card className="w-[340px]">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Helios Longevity Clinic</CardTitle>
      <Badge className="border-transparent bg-longevo-green text-white">Verified</Badge>
    </div>
    <CardDescription>Zurich · Regenerative medicine</CardDescription>
  </CardHeader>
  <CardContent className="text-sm text-muted-foreground">
    Comprehensive biological-age testing and personalized longevity protocols.
  </CardContent>
  <CardFooter className="justify-between">
    <span className="text-sm font-medium">4.8 · 214 reviews</span>
    <Button size="sm">View clinic</Button>
  </CardFooter>
</Card>
```
