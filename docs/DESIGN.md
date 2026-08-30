# Design System: Editorial Fluidity for EduFlow

## 1. Overview & Creative North Star: "The Digital Atheneum"
This design system moves away from the "boxy" nature of standard SaaS dashboards. Our Creative North Star is **The Digital Atheneum**—a space that feels as authoritative as a library but as fluid as a digital stream.

To achieve a high-end, bespoke feel, we reject the rigid 1px border. Instead, we utilize **Tonal Architecture**: using varying depths of slate and navy to define space. We prioritize intentional white space and "asymmetric balance" (e.g., placing a large display-sm metric next to a quiet, condensed list) to guide the educator's eye without visual clutter.

## 2. Colors & Surface Philosophy
The palette is rooted in deep slates (`#0b1326`), moving away from true black to maintain a "Soft Dark" editorial feel.

### The "No-Line" Rule
Explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts.
* **The Canvas:** Use `surface` (`#0b1326`) for the main application background.
* **The Navigation:** Use `surface_container_low` (`#131b2e`) for the sidebar to create a grounded, recessed feel.
* **The Content Blocks:** Use `surface_container` (`#171f33`) for main workspace areas.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
* **Primary Layer:** `surface` (The foundation).
* **Secondary Layer:** `surface_container_low` (Sidebars and headers).
* **Tertiary Layer (Interactive):** `surface_container_high` (`#222a3d`) for cards and modals.
* **Active/Elevated State:** `surface_container_highest` (`#2d3449`) for hovered items or active menu states.

### The "Glass & Gradient" Rule
To capture the "Linear/Stripe" aesthetic, use the `primary_container` gradient (`#2563eb` to `#06b6d4`) sparingly.
* **Signature Textures:** Apply a `0.1` opacity version of the gradient as a "wash" over `surface_bright` elements to give them a holographic depth.
* **Glassmorphism:** Floating elements (like Tooltips or Dropdowns) must use `surface_variant` at 80% opacity with a `16px` backdrop-blur.

## 3. Typography
We use a dual-typeface system to balance authority with readability.

* **Display & Headlines (Manrope):** Our "Editorial" voice. Use `display-sm` for hero metrics (e.g., "Total Students"). The wider tracking and geometric builds of Manrope convey modern sophistication.
* **Body & Labels (Inter):** Our "Functional" voice. Inter is used for high-density data and UI controls.
* **Hierarchy Note:** Always pair a `headline-sm` title with `label-sm` secondary text in `on_surface_variant` (`#c3c6d7`) to create a high-contrast, professional hierarchy.

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural lines.

* **The Layering Principle:** Place a `surface_container_highest` card on a `surface_container` background to create a soft, natural lift.
* **Ambient Shadows:** For floating modals, use a shadow with a 40px blur, 0% spread, and 6% opacity, using the `on_background` color as the shadow tint. This mimics natural light diffusion in a dark environment.
* **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (`#434655`) at **15% opacity**. It should be felt, not seen.

## 5. Components

### Cards & Data Containers
* **Layout:** Forbid divider lines. Use `spacing-6` (1.5rem) to separate content sections within a card.
* **Background:** Always `surface_container_high`.
* **Corners:** The system now adopts `roundedness: 3`, indicating maximum rounding for a pill-shaped aesthetic. This should be applied consistently where appropriate, resulting in heavily rounded or pill-like corners for UI elements. For elements like cards, this translates to a very high radius, exceeding typical `xl` values towards a full pill shape where feasible.

### Buttons
* **Primary:** A gradient-fill from `primary_container` to `secondary_container`. White text (`on_primary_container`).
* **Secondary:** Ghost style. No background, `outline_variant` ghost border (20% opacity).
* **Tertiary:** Text-only using `primary` color (`#b4c5ff`).

### Status Badges (The "EduFlow" Special)
Instead of high-contrast solid pills, use a "Soft Glow" approach:
* **Active:** `on_secondary_container` text on a 10% opacity `secondary` background.
* **Finished:** `on_primary_fixed_variant` text on a 10% opacity `primary` background.

### Input Fields
* **Default:** `surface_container_lowest` background with a subtle `outline_variant` (10% opacity) "Ghost Border".
* **Focus:** Transition the border to 100% opacity `primary` and add a 2px `primary` outer glow at 20% opacity.

### Navigation Sidebar
* **Width:** `280px` (Expanded) / `80px` (Collapsed).
* **Interaction:** Active links should not use a background pill. Use a vertical `2px` strip of the `primary` gradient on the far left and change text color to `on_surface`.

## 6. Do’s and Don’ts

### Do
* **Do** use `spacing-8` or `spacing-12` between major sections to allow the dark theme to "breathe."
* **Do** use `secondary_fixed_dim` (`#4cd7f6`) for icons to make them pop against the dark slate background.
* **Do** apply `backdrop-filter: blur(12px)` to the top header to let content scroll elegantly beneath it.

### Don't
* **Don't** use `#000000` for shadows. Always tint shadows with the deep navy of the background.
* **Don't** use 100% white text for body copy. Stick to `on_surface_variant` (`#c3c6d7`) to reduce eye strain in dark mode.
* **Don't** use standard 1px dividers. If separation is needed, use a `1px` height `surface_container_highest` fill.