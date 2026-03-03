# Venus Vacation PRISM - Design Guide

## 🎨 Design Philosophy

Our design combines modern aesthetics with premium interactions to create a memorable, engaging user experience. The design language is built on three pillars:

1. **Premium & Modern** - Glassmorphism, gradients, and smooth animations
2. **Accessible & Inclusive** - WCAG compliant, keyboard navigation, reduced motion support
3. **Performant & Smooth** - 60fps animations, optimized interactions

## 🌈 Color Palette

### Primary Colors

```css
--primary-start: #667eea; /* Vibrant Purple */
--primary-end: #764ba2; /* Deep Purple */
--accent: #f093fb; /* Pink Accent */
```

### Gradient Combinations

```css
/* Primary Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Accent Gradient */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Success Gradient */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Info Gradient */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
```

### Neutral Colors

```css
--white: #ffffff;
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-600: #4b5563;
--gray-900: #111827;
--black: #000000;
```

## 🎭 Typography

### Font Family

```css
font-family:
  "Poppins",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

### Font Sizes

```css
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
--text-4xl: 36px;
--text-5xl: 48px;
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

## 🎪 Effects & Animations

### Glassmorphism

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Shadows

```css
/* Subtle */
box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

/* Medium */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);

/* Strong */
box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);

/* Glow */
box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
```

### Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 15px;
--radius-xl: 20px;
--radius-2xl: 25px;
--radius-full: 9999px;
```

### Transitions

```css
/* Standard */
transition: all 0.3s ease;

/* Smooth */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Bouncy */
transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

## 🎯 Component Patterns

### Buttons

**Primary Button**

```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}
```

**Secondary Button**

```css
.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}
```

### Cards

**Product Card**

```css
.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.product-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}
```

### Form Inputs

**Text Input**

```css
input[type="text"] {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

input[type="text"]:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  outline: none;
  transform: translateY(-2px);
}
```

### Modals

**Modal Container**

```css
.modal-content {
  background: white;
  border-radius: 25px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

## 🎬 Animation Library

### Fade In Up

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Float

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

### Pulse

```css
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
```

### Shimmer

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

### Gradient Shift

```css
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

## 🎨 Interactive States

### Hover States

```css
/* Lift Effect */
element:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.4);
}

/* Scale Effect */
element:hover {
  transform: scale(1.05);
}

/* Glow Effect */
element:hover {
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
}
```

### Focus States

```css
element:focus-visible {
  outline: 3px solid #667eea;
  outline-offset: 3px;
  border-radius: 8px;
}
```

### Active States

```css
element:active {
  transform: scale(0.98);
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
}

/* Tablet */
@media (max-width: 768px) {
}

/* Desktop */
@media (max-width: 1024px) {
}

/* Large Desktop */
@media (max-width: 1280px) {
}
```

## ♿ Accessibility Guidelines

### Focus Indicators

- Always provide visible focus indicators
- Use outline with offset for better visibility
- Minimum 3px outline width

### Color Contrast

- Text: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

### Motion

- Respect `prefers-reduced-motion`
- Provide alternatives to animations
- Keep animations under 3 seconds

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus states
- Escape key closes modals

## 🎯 Best Practices

### Performance

1. Use `transform` and `opacity` for animations (GPU accelerated)
2. Avoid animating `width`, `height`, `top`, `left`
3. Use `will-change` sparingly
4. Debounce scroll and resize events
5. Lazy load images and heavy content

### Consistency

1. Use design tokens (CSS variables)
2. Follow established patterns
3. Maintain consistent spacing
4. Use the same animation durations
5. Keep color palette limited

### User Experience

1. Provide immediate feedback
2. Show loading states
3. Display error messages clearly
4. Confirm destructive actions
5. Make interactive elements obvious

## 🎨 Design Tokens

```css
:root {
  /* Colors */
  --color-primary: #667eea;
  --color-primary-dark: #764ba2;
  --color-accent: #f093fb;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Typography */
  --font-family: "Poppins", sans-serif;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Shadows */
  --shadow-sm: 0 5px 20px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 10px 40px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 20px 60px rgba(102, 126, 234, 0.3);

  /* Transitions */
  --transition-fast: 0.15s;
  --transition-base: 0.3s;
  --transition-slow: 0.5s;

  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

## 🎪 Special Effects

### Ripple Effect

Triggered on button clicks, creates expanding circle animation.

### Magnetic Cards

Cards follow mouse movement with 3D perspective transform.

### Cursor Trail

Gradient circles follow cursor on desktop (disabled on mobile).

### Parallax Scrolling

Background elements move at different speeds creating depth.

### Glassmorphism

Frosted glass effect using backdrop-filter blur.

### Gradient Animation

Text and backgrounds with animated gradient shifts.

---

**Design System Version:** 1.0.0  
**Last Updated:** March 3, 2026  
**Maintained by:** Venus Vacation PRISM Team
