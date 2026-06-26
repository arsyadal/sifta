---
name: Sifta Design System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3d4947'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
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
    letterSpacing: 0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is built on the philosophy of "Kepercayaan yang Ramah" (Friendly Trust). It targets a diverse Indonesian workforce—ranging from factory floors to retail counters—where digital literacy varies. The brand personality is approachable, professional, and reliable without being overly corporate or intimidating.

The design style follows a **Modern Professional** aesthetic with **Tactile** influences. It prioritizes high legibility, large touch targets for active environments, and a clear information hierarchy. By utilizing a "Mobile-First, Field-First" approach, the UI minimizes cognitive load through purposeful whitespace, solid color blocks, and a total avoidance of complex gradients or decorative elements that do not serve a functional purpose.

## Colors
The palette is rooted in a vibrant "Sifta Teal," a color that evokes stability and growth, widely trusted in the Indonesian tech landscape. 

- **Primary (Teal):** Used for main actions, active states, and brand presence.
- **Secondary (Amber):** Reserved for high-priority alerts, warnings, and secondary CTAs that require warmth and attention.
- **Success (Emerald):** Specifically for positive payroll status, successful clock-ins, and "On-Time" indicators.
- **Neutrals:** A deep Charcoal (#111827) is used for text to ensure maximum contrast against the Off-White (#F9FAFB) background, ensuring readability under various lighting conditions (e.g., bright factory floors or outdoor retail).

## Typography
This design system utilizes **Plus Jakarta Sans** for its friendly, open counters and modern Indonesian heritage. The scale is slightly larger than standard enterprise apps to accommodate field workers who may be viewing screens quickly or at arm's length.

- **Headlines:** Use Bold (700) or SemiBold (600) to create a clear "at-a-glance" summary of information.
- **Body:** Standardized at 16px for primary reading to ensure accessibility.
- **Labels:** Used for metadata like "Shift Time" or "Location Status," utilizing SemiBold (600) to differentiate from body text.

## Layout & Spacing
The layout uses a **Fluid Grid** system based on an 8px square rhythm. For mobile devices, a 4-column grid is used with 16px margins. For tablet and desktop admin views, a 12-column grid is employed.

- **Touch Targets:** All interactive elements (buttons, toggles, list items) must maintain a minimum height of 48px to accommodate one-handed use in busy environments.
- **Density:** The system prioritizes "Room to Breathe." Avoid packing more than three primary data points in a single card row.

## Elevation & Depth
This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a sense of physical hierarchy. 

- **Level 0 (Background):** #F9FAFB.
- **Level 1 (Cards/Surface):** White (#FFFFFF) with a very soft, diffused shadow (0px 2px 4px rgba(0,0,0,0.05)). This is used for shift cards and list items.
- **Level 2 (Floating/Active):** White (#FFFFFF) with a more pronounced shadow (0px 8px 16px rgba(0,0,0,0.08)). Used for bottom sheets, modals, and the primary "Clock-In" button to make it feel "pressable."
- **Outlines:** A subtle 1px border (#E5E7EB) is used on Level 1 elements to maintain definition when shadows are washed out by screen glare.

## Shapes
The shape language is **Rounded**, moving away from sharp industrial corners to feel more approachable. 

- **Standard Elements:** 0.5rem (8px) radius for buttons, input fields, and small cards.
- **Containers:** 1rem (16px) radius for large dashboard cards (e.g., Payroll Summary) and Bottom Sheets.
- **Indicators:** Circular (pill-shaped) for status tags like "Hadir" (Present) or "Izin" (On Leave).

## Components

### Clock-In/Out Buttons
The most critical component. It should be a large, full-width button (min-height 64px). Use the Primary Teal for "Clock-In" and a neutral-outlined or Tertiary Green for "Clock-Out." High tactile feedback (active state change) is required.

### Shift Schedule Cards
Cards should feature the time in `Headline-LG` and the role/location in `Body-MD`. Use a left-border color accent (Teal for upcoming, Amber for current/active) to allow quick scanning of the day's tasks.

### Payroll Summary Cards
High-contrast cards using a "Surface-on-Surface" approach. The total "Take Home Pay" should be the largest typographic element (`Display-SM`), with itemized deductions shown in a collapsed list to keep the initial view simple.

### Geofencing Status Indicators
A persistent "Location Status" bar at the top or bottom of the clock-in screen. 
- **Inside Fence:** A subtle Teal background with a checkmark icon ("Lokasi Sesuai").
- **Outside Fence:** A soft Amber background with a warning icon ("Di Luar Jangkauan").

### Lists & Inputs
Inputs must have visible labels at all times (never placeholder-only). Use 16px internal padding for touch comfort. Lists should have 16px vertical spacing between items to prevent accidental taps.