# Branding Guidelines

## Brand Identity
**Pools & Pool - Luxurious Lounge & Bar**

A premium, sophisticated brand representing a luxurious lounge and bar experience. The brand conveys elegance, relaxation, and refinement through its visual identity.

---

## Logo Description
The logo features a circular design with an abstract graphic element, brand name, and tagline:

- **Shape**: Perfect white circle on black/dark background
- **Graphic Element**: Eight light blue rounded shapes arranged in a radial pattern (water droplet/pebble motif) with darker blue dots between them
- **Typography**: Elegant serif font for brand name, sans-serif for tagline
- **Overall Feel**: Clean, modern, luxurious, with subtle aquatic/pool references

---

## Color Palette

### Primary Colors

#### Primary Blue
**Usage**: Main brand color, primary actions, headlines, important UI elements

- **Hex**: `#1E88E5` (Vibrant Medium Blue)
- **RGB**: `rgb(30, 136, 229)`
- **Usage Examples**:
  - Primary buttons
  - Brand name text
  - Active navigation items
  - Links
  - Call-to-action elements
  - Menu item prices (highlighted)

**CSS Variable**:
```css
--color-primary: #1E88E5;
```

#### Secondary Blue (Darker)
**Usage**: Accents, hover states, secondary elements, depth

- **Hex**: `#1565C0` (Deeper Blue)
- **RGB**: `rgb(21, 101, 192)`
- **Usage Examples**:
  - Button hover states
  - Secondary buttons
  - Dots/accents in logo graphic
  - Border accents
  - Active temporary pricing badges

**CSS Variable**:
```css
--color-secondary: #1565C0;
```

### Supporting Colors

#### Light Blue (Accent)
**Usage**: Subtle accents, backgrounds, logo graphic elements

- **Hex**: `#64B5F6` (Light Blue)
- **RGB**: `rgb(100, 181, 246)`
- **Usage Examples**:
  - Logo graphic shapes
  - Subtle background tints
  - Hover highlights
  - Info badges

**CSS Variable**:
```css
--color-accent-light: #64B5F6;
```

#### White
**Usage**: Text on dark backgrounds, logo background, contrast

- **Hex**: `#FFFFFF`
- **RGB**: `rgb(255, 255, 255)`
- **Usage Examples**:
  - Logo circle background
  - Text on dark backgrounds
  - Light mode text
  - Cards and panels (light mode)

**CSS Variable**:
```css
--color-white: #FFFFFF;
```

#### Black / Dark Background
**Usage**: Logo background, dark mode, sophisticated contrast

- **Hex**: `#000000` (Pure Black for logo)
- **RGB**: `rgb(0, 0, 0)`
- **Dark Gray (UI)**: `#1A1A1A` or `#121212`
- **Usage Examples**:
  - Logo presentation background
  - Dark mode backgrounds
  - Footer backgrounds
  - Premium/dark themed sections

**CSS Variables**:
```css
--color-black: #000000;
--color-dark-bg: #1A1A1A;
```

---

## Color Usage in Application

### Public Menu (Customer-Facing)

#### Light Mode (Default)
- **Background**: White (`#FFFFFF`)
- **Text**: Dark Gray (`#333333` or `#1A1A1A`)
- **Primary Actions**: Primary Blue (`#1E88E5`)
- **Prices**: Primary Blue, bold
- **Active Prices**: Secondary Blue (`#1565C0`) with badge
- **Category Headers**: Primary Blue
- **Cards/Borders**: Light Gray (`#E0E0E0`)

#### Dark Mode (Optional)
- **Background**: Dark (`#1A1A1A`)
- **Text**: White/Light Gray (`#FFFFFF` / `#E0E0E0`)
- **Primary Actions**: Primary Blue (`#1E88E5`)
- **Prices**: Light Blue accent (`#64B5F6`)
- **Cards**: Darker Gray (`#2A2A2A`)
- **Borders**: Medium Gray (`#404040`)

### Admin Dashboard

#### Color Coding for Status
- **Active/Success**: Primary Blue (`#1E88E5`)
- **Active Temporary Price**: Secondary Blue (`#1565C0`) with green accent
- **Upcoming/Scheduled**: Light Blue (`#64B5F6`) or muted blue
- **Completed/Expired**: Gray (`#9E9E9E`)
- **Error/Warning**: Red (`#E53935`) - standard, not from logo
- **Out of Stock**: Orange/Red tint

#### UI Elements
- **Sidebar Background**: Dark (`#1A1A1A`) or White
- **Sidebar Active Item**: Primary Blue background
- **Top Header**: White with Primary Blue accents
- **Buttons Primary**: Primary Blue (`#1E88E5`)
- **Buttons Secondary**: Secondary Blue (`#1565C0`)
- **Borders**: Light Gray (`#E0E0E0`)

---

## Typography

### Brand Name Font
**Style**: Elegant serif with decorative touches
**Characteristics**:
- Classic, sophisticated
- Slightly decorative capital 'P's
- Small ampersand, slightly raised

**Web Font Recommendation**:
- **Primary**: `Playfair Display` (Google Fonts) - elegant serif
- **Alternative**: `Cormorant Garamond`, `Lora`

### Tagline Font
**Style**: Clean sans-serif, all caps
**Characteristics**:
- Modern, clear, readable
- Capitalized
- Smaller size than brand name

**Web Font Recommendation**:
- **Primary**: `Inter` or `Poppins` (Google Fonts) - modern sans-serif
- **Alternative**: `Roboto`, `Open Sans`

### Application Typography

#### Headings
- **H1 (Page Titles)**: Serif font (Playfair Display), 32-40px, Primary Blue
- **H2 (Section Headers)**: Serif font, 24-28px, Primary Blue
- **H3 (Subsections)**: Sans-serif, 20-24px, Dark Gray

#### Body Text
- **Primary**: Sans-serif (Inter/Poppins), 16px, Dark Gray
- **Secondary**: Sans-serif, 14px, Medium Gray
- **Small**: Sans-serif, 12px, Light Gray

#### Special Use Cases
- **Menu Item Names**: Sans-serif, 18-20px, bold, Dark Gray
- **Prices**: Sans-serif, 20-24px, bold, Primary Blue
- **Temporary Prices**: Sans-serif, 22-26px, bold, Secondary Blue with badge
- **Descriptions**: Sans-serif, 14-16px, Medium Gray, italic

---

## Spacing & Layout

### Base Unit
**8px grid system** - All spacing should be multiples of 8px

### Common Spacings
- **X-Small**: 4px (0.25rem)
- **Small**: 8px (0.5rem)
- **Medium**: 16px (1rem)
- **Large**: 24px (1.5rem)
- **X-Large**: 32px (2rem)
- **XX-Large**: 48px (3rem)
- **Section Spacing**: 64px (4rem)

### Border Radius
- **Small**: 4px (buttons, badges)
- **Medium**: 8px (cards, inputs)
- **Large**: 12px (modals, containers)
- **Full**: 50% (circular elements, logo)

---

## Component Styling Guidelines

### Buttons

#### Primary Button
```css
Background: Primary Blue (#1E88E5)
Text: White
Hover: Secondary Blue (#1565C0)
Border Radius: 8px
Padding: 12px 24px
Font: Sans-serif, 16px, medium weight
```

#### Secondary Button
```css
Background: Transparent
Text: Primary Blue (#1E88E5)
Border: 2px solid Primary Blue
Hover: Light Blue background (#64B5F6, 10% opacity)
```

### Cards

#### Menu Item Card
```css
Background: White
Border: 1px solid Light Gray (#E0E0E0)
Border Radius: 12px
Padding: 16px
Shadow: Subtle (0 2px 8px rgba(0,0,0,0.1))
Hover: Shadow increase, slight lift
```

### Badges

#### Active Price Badge
```css
Background: Secondary Blue (#1565C0)
Text: White
Border Radius: 4px
Padding: 4px 8px
Font: Sans-serif, 12px, bold
```

#### Status Badges
```css
Active: Primary Blue background, white text
Upcoming: Light Blue background (#64B5F6), dark text
Expired: Gray background, white text
```

---

## Logo Usage

### Clear Space
Maintain clear space equal to 1/4 the logo height on all sides

### Minimum Size
- **Digital**: 80px height minimum
- **Print**: 1 inch height minimum

### Backgrounds
- **Preferred**: Black or dark background (as in brand)
- **Alternative**: White background acceptable
- **Avoid**: Busy backgrounds, low contrast colors

### Logo Variants
1. **Full Logo**: Complete with graphic, name, and tagline
2. **Logo Mark**: Just the circular graphic element (for favicons, small spaces)
3. **Logo Text**: Just brand name (for horizontal spaces)

---

## CSS Variables (Complete Set)

```css
:root {
  /* Brand Colors */
  --color-primary: #1E88E5;
  --color-secondary: #1565C0;
  --color-accent-light: #64B5F6;
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-dark-bg: #1A1A1A;
  
  /* Neutral Colors */
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #666666;
  --color-text-light: #999999;
  --color-border: #E0E0E0;
  --color-background: #FFFFFF;
  --color-background-alt: #F5F5F5;
  
  /* Status Colors */
  --color-success: #4CAF50;
  --color-warning: #FF9800;
  --color-error: #E53935;
  --color-info: var(--color-primary);
  
  /* Typography */
  --font-serif: 'Playfair Display', serif;
  --font-sans: 'Inter', 'Poppins', sans-serif;
  --font-size-base: 16px;
  --font-size-small: 14px;
  --font-size-large: 18px;
  --font-size-xl: 24px;
  --font-size-xxl: 32px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  
  /* Borders */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-full: 50%;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

---

## Dark Mode Colors

```css
[data-theme="dark"] {
  --color-background: #1A1A1A;
  --color-background-alt: #2A2A2A;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #E0E0E0;
  --color-text-light: #999999;
  --color-border: #404040;
  
  /* Brand colors remain the same */
  /* Status colors may need adjustment */
}
```

---

## Usage Examples

### Menu Item Display
- **Item Name**: Dark text, sans-serif, bold
- **Price**: Primary Blue, larger font, bold
- **Temporary Price**: Secondary Blue, with "ACTIVE" badge
- **Description**: Medium gray, italic

### Admin Dashboard
- **Sidebar**: Dark background with Primary Blue active state
- **Headers**: Primary Blue text
- **Tables**: Alternating row colors, Primary Blue for active items
- **Forms**: Primary Blue focus states

### Status Indicators
- **In Stock**: Green checkmark or badge
- **Out of Stock**: Gray with strikethrough
- **Active Price**: Secondary Blue badge
- **Scheduled Price**: Light Blue badge

---

## Accessibility

### Color Contrast
- **Text on Primary Blue**: White (meets WCAG AA)
- **Primary Blue on White**: Sufficient contrast
- **Secondary Blue on White**: Sufficient contrast
- Always test contrast ratios: minimum 4.5:1 for normal text, 3:1 for large text

### Focus States
- Use Primary Blue with 2px outline
- Ensure visible focus indicators on all interactive elements

---

## Brand Voice & Tone

While this is a visual branding guide, the application should reflect:

- **Luxurious**: Premium feel, elegant design
- **Sophisticated**: Clean, refined, not flashy
- **Welcoming**: Approachable, not intimidating
- **Modern**: Contemporary design patterns
- **Reliable**: Professional, trustworthy

---

## Summary

The brand palette is built around the elegant blue tones from the logo, creating a cohesive, luxurious experience that reflects the premium nature of Pools & Pool Lounge & Bar. Use these colors consistently across all touchpoints to maintain brand recognition and sophistication.
