---
name: Sifta Design System
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  touch-target: 44px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered for the blue-collar workforce, prioritizing utility, clarity, and reliability. The brand personality is industrious and dependable, bridging the gap between corporate HR requirements and field-level operational needs. 

The visual style follows **Functional Minimalism**. It avoids decorative flourishes in favor of high-contrast information density and unmistakable action cues. The emotional response is one of confidence and efficiency—ensuring that workers can clock in, check schedules, and manage profiles with zero friction, even in high-pressure environments.

## Colors
The palette is rooted in a professional Navy and Teal combination to project stability and modern tech-enablement.

- **Primary Navy (#1B263B):** Used for structural elements like sidebars, navigation headers, and primary typography to establish authority.
- **Primary Teal (#00ADB5):** Reserved for the "active" layer—buttons, links, and progress indicators—ensuring high visibility against the navy and light backgrounds.
- **Semantic Palette:** **Success Emerald** indicates positive states (Checked-in, Approved), while **Alert Amber** signals items requiring attention (Late, Pending).
- **Neutrals:** The background uses a clean **Neutral Light** to reduce eye strain, while **Neutral Dark** ensures WCAG-compliant legibility for body text.

## Typography
This design system utilizes **Plus Jakarta Sans** across all levels. It was chosen for its modern, geometric structure which remains highly legible even at small sizes on mobile devices.

- **Headlines:** Use Bold (700) or SemiBold (600) weights to create a clear visual hierarchy. Mobile headlines are scaled down to ensure content fits within limited horizontal space without excessive wrapping.
- **Body Text:** Standardized at 16px (md) for general interface text and 18px (lg) for long-form reading or important shift details to enhance readability in the field.
- **Labels:** Used for buttons, table headers, and status badges. These utilize slightly heavier weights and subtle letter spacing to differentiate them from standard body text.

## Layout & Spacing
The layout relies on a **8px square grid system**, ensuring all dimensions and white space are multiples of 8. 

- **Desktop:** A 12-column fluid grid with a maximum container width of 1280px. Gutters are fixed at 24px to provide ample breathing room between data-heavy columns.
- **Mobile:** A 4-column grid with 16px side margins. Crucially, all interactive elements (buttons, inputs, list items) must adhere to a minimum **touch target of 44px** to accommodate users who may be wearing gloves or using devices on the move.
- **Spacing Rhythm:** Use `lg` (24px) for major section spacing and `md` (16px) for internal component padding.

## Elevation & Depth
To maintain a clean, functional aesthetic, this design system uses **Tonal Layers** supplemented by low-contrast outlines.

- **Level 0 (Background):** Neutral Light (#F8F9FA).
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a 1px solid border in a subtle grey (10% opacity of Neutral Dark). This creates a "flat-stack" look that feels organized.
- **Level 2 (Interaction/Floating):** Used for dropdowns and active modals. These utilize a soft, ambient shadow: `0px 4px 12px rgba(27, 38, 59, 0.08)`. The shadow is tinted with the Primary Navy to keep the depth feeling natural to the palette.

## Shapes
The shape language is defined as **Rounded Eight**. This 8px radius strikes a balance between professional discipline and modern approachability.

- **Standard Components:** Buttons, Input Fields, and Cards use the `rounded-md` (8px) base.
- **Large Components:** Modals and large dashboard containers use `rounded-lg` (16px).
- **Small Components:** Badges and Tooltips use `rounded-sm` (4px).

## Components
- **Buttons:** 
  - *Primary:* Filled Teal (#00ADB5) with White text. Bold weight.
  - *Secondary:* Outlined Navy (#1B263B) with 1px border.
  - *Sizing:* Minimum height 44px for mobile accessibility.
- **Status Chips:** 
  - Used for "Checked-in" or "Late". These use a light tinted background (15% opacity) of the semantic color with a high-contrast dark text of the same hue.
- **Input Fields:** 
  - White background, 1px border, 8px corner radius. Focus state uses a 2px Teal border.
- **Cards:** 
  - White surfaces used to group shift details, employee profiles, or timecards. Ensure 16px or 24px internal padding to prevent information density from feeling overwhelming.
- **Lists:**
  - High-row height (min 56px) for shift logs and rosters to ensure easy tapping on mobile. Use subtle dividers (1px) in Neutral Light.
- **Navigation:**
  - Sidebar utilizes Primary Navy (#1B263B). Active links are indicated with a Teal vertical bar on the left edge and a subtle background highlight.