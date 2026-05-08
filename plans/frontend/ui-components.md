# Frontend – UI Components

> This file defines the component library and design-system rules. The agent should consult it
> before creating any new component or modifying an existing one.

---

## What to put in this file

In this file, document the full catalogue of UI components so the agent reuses existing components
instead of building duplicates. Include:

- **Design system reference** – link to the Figma file, Storybook URL, or design-token file the
  agent must follow. If none exists yet, describe the visual language (colour palette, typography
  scale, spacing system, border radii, shadow levels).
- **Component catalogue** – a table listing each component name, its location in the codebase,
  its props/interface, and a one-line description of what it does (e.g., `VehicleCard`, `SearchBar`,
  `FilterPanel`, `PriceTag`, `ImageGallery`, `ContactButton`).
- **Component rules** – conventions the agent must follow when building a new component: file
  naming, folder location, whether to use TypeScript interfaces or PropTypes, whether to co-locate
  tests and styles, and when to split a component vs keep it in one file.
- **Accessibility requirements** – WCAG level to target, required ARIA attributes for interactive
  components, keyboard-navigation expectations, and colour-contrast minimums.
- **Icon and image guidelines** – which icon library is used, how icons should be imported, and
  the rules for image optimisation (formats, lazy loading, alt text).
- **Animation and motion** – whether transitions are allowed, which library to use, and any
  reduced-motion considerations.
