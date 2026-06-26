---
name: Functional Minimalist HRIS
colors:
  surface: '#f9f9ff'
  surface-dim: '#cadaff'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8edff'
  surface-container-high: '#e0e8ff'
  surface-container-highest: '#d7e2ff'
  on-surface: '#041b3c'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3052'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#6ae1ff'
  on-secondary-container: '#006374'
  tertiary: '#004e32'
  on-tertiary: '#ffffff'
  tertiary-container: '#006844'
  on-tertiary-container: '#72e9af'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#adecff'
  secondary-fixed-dim: '#5dd6f3'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5d'
  tertiary-fixed: '#82f9be'
  tertiary-fixed-dim: '#65dca4'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005235'
  background: '#f9f9ff'
  on-background: '#041b3c'
  surface-variant: '#d7e2ff'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
    lineHeight: 16px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
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
  container-margin: 16px
  gutter: 12px
---

## Brand & Style
The design system focuses on **Functional Minimalism**, prioritizing utility and clarity for blue-collar workers in Indonesia. The personality is professional, dependable, and highly accessible, bridging the gap between corporate management needs and the daily operational reality of F&B, retail, and factory workers.

The emotional response should be one of "effortless reliability." By utilizing high-contrast elements, heavy whitespace, and a rigid adherence to a grid, the UI removes cognitive load. The aesthetic avoids decorative flourishes in favor of structural integrity, using clear borders and solid fills to define the interactive landscape. It feels modern and digital-native, yet grounded in the physical world of shifts and tangible work.

## Colors
The color palette is built on a foundation of trust and action. 

*   **Primary (Deep Blue):** Used for primary actions, navigation, and brand presence. It signals professionalism and stability.
*   **Secondary (Teal):** Used for informational accents and secondary interactive elements to provide visual variety without losing the professional tone.
*   **Tertiary (Success Green):** Critical for shift management. It represents "Approved," "Clocked In," or "Available" status.
*   **Neutral:** A dark navy-slate is used for text and heavy borders to maintain high legibility and a grounded feel.
*   **Surface:** Pure white (#FFFFFF) is the primary background to maximize contrast, with a very light grey (#F4F5F7) used for subtle section differentiation.

## Typography
This design system utilizes **Plus Jakarta Sans** for its approachable yet modern geometric qualities. The typography is scaled for high legibility in fast-paced work environments.

- **Headlines:** Bold and tight-leading for immediate impact.
- **Body Text:** Generous line-height to ensure readability on small mobile screens.
- **Labels:** Used for status indicators (e.g., "HADIR", "ABSEN") and metadata, often paired with slightly increased weight for clarity.
- **Language:** All microcopy and UI labels must use standard Indonesian (Bahasa Indonesia) that is direct and avoids overly academic phrasing.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for mobile-first consumption. 

- **Mobile (Default):** 4-column grid with 16px side margins and 12px gutters. All primary action buttons must be at least 48px in height to accommodate "fat-finger" interactions in high-activity settings.
- **Desktop/Tablet:** 12-column grid with a maximum content width of 1140px. 
- **Spacing Logic:** Based on a 4px baseline. Use 16px (md) for standard padding between elements and 24px (lg) for vertical section spacing. 
- **Information Density:** Low to Medium. Ensure enough negative space around touch targets so that users don't trigger the wrong shift or button by accident.

## Elevation & Depth
This design system rejects complex shadows and blurs in favor of **Bold Borders and Tonal Layers**. 

Visual hierarchy is established through:
1.  **High-Contrast Outlines:** 1px or 2px solid borders (#DFE1E6) are used to define cards and input fields.
2.  **Surface Tiers:** Use the neutral background (#F4F5F7) to recede non-essential areas, while interactive cards sit on pure white (#FFFFFF).
3.  **Active States:** Interactive elements gain a thicker 2px border in the Primary color when focused or active.
4.  **Flat Depth:** No ambient shadows are used. Depth is purely structural, relying on the contrast between the white surface and the grey background.

## Shapes
Shapes are "Rounded" (0.5rem / 8px) to soften the industrial feel of the app while maintaining a professional structure. 

- **Standard Elements:** Buttons, Cards, and Inputs use the base 8px radius.
- **Large Elements:** Modals and large containers use `rounded-lg` (16px).
- **Status Pills:** Small chips or status indicators use `rounded-xl` (24px) or full pill shapes to distinguish them from interactive buttons.

## Components

### Buttons
Primary buttons are large, solid blocks of the Primary color with white text. Secondary buttons use a transparent background with a 1px solid border.
*   **Min-height:** 48px for mobile accessibility.
*   **Label:** Bold, centered, title case (e.g., "Mulai Shift").

### Cards
Used for shift details and employee profiles.
*   **Style:** White background, 1px border (#DFE1E6), 8px corner radius.
*   **Padding:** 16px internal padding.

### Inputs
Crucial for clock-in/out notes or login.
*   **Style:** White background, 1px grey border, labels positioned clearly above the field.
*   **Focus State:** 2px Blue border with no shadow.

### Status Indicators (Pills)
Used for shift statuses like "Selesai", "Berlangsung", or "Izin".
*   **Style:** Light background tint of the status color with high-contrast text of the same color family (e.g., Light Green background with Dark Green text).

### List Items
For shift history or employee rosters.
*   **Style:** Full-width rows with a bottom border separator. Ensure a minimum touch target height of 56px per row.

### Bottom Navigation
A fixed navigation bar for mobile users, using clear icons and 12px labels for the primary app sections: Beranda, Jadwal, Aktivitas, Profil.