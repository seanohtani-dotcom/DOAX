/**
 * Design Enhancement Scripts
 * Adds micro-interactions and visual polish
 */

// Parallax effect for hero section
document.addEventListener("DOMContentLoaded", () => {
  // Smooth parallax scrolling
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(
      ".hero-logo, .background-video",
    );

    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll("button, .buy-now, .btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple-effect");

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Magnetic effect for cards
  const cards = document.querySelectorAll(
    ".product-card, .movie-item, .comment",
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      card.style.transform = `
        perspective(1000px)
        rotateY(${deltaX * 5}deg)
        rotateX(${-deltaY * 5}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)";
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections
  const sections = document.querySelectorAll(
    "section, .product-card, .movie-item",
  );
  sections.forEach((section) => {
    section.classList.add("fade-in-element");
    observer.observe(section);
  });

  // Cursor trail effect (optional, can be disabled)
  let cursorTrail = [];
  const maxTrailLength = 10;

  document.addEventListener("mousemove", (e) => {
    if (window.innerWidth > 768) {
      // Only on desktop
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      trail.style.left = e.clientX + "px";
      trail.style.top = e.clientY + "px";
      document.body.appendChild(trail);

      cursorTrail.push(trail);

      if (cursorTrail.length > maxTrailLength) {
        const oldTrail = cursorTrail.shift();
        oldTrail.remove();
      }

      setTimeout(() => {
        trail.style.opacity = "0";
        trail.style.transform = "scale(0)";
        setTimeout(() => trail.remove(), 500);
      }, 100);
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add loading state to images
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (!img.complete) {
      img.classList.add("loading-shimmer");
      img.addEventListener("load", () => {
        img.classList.remove("loading-shimmer");
        img.classList.add("loaded");
      });
    }
  });

  // Animated counter for numbers
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = Math.round(target);
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current);
      }
    }, 16);
  };

  // Observe counters
  const counters = document.querySelectorAll("[data-counter]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.counter);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // Add hover sound effect (optional)
  const addHoverSound = () => {
    const hoverSound = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBQLSKDf8sFuIwUugc3y2Ik2CBhku+zooVARC0yl4fG5ZRwFNo3V7859KQUofsz",
    );

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        // Uncomment to enable sound
        // hoverSound.currentTime = 0;
        // hoverSound.play().catch(() => {});
      });
    });
  };

  // Keyboard navigation enhancement
  let focusableElements =
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  let firstFocusable, lastFocusable;

  const modal = document.querySelector(".modal");
  if (modal) {
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        const focusables = modal.querySelectorAll(focusableElements);
        firstFocusable = focusables[0];
        lastFocusable = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  // Add page transition effect
  window.addEventListener("beforeunload", () => {
    document.body.style.opacity = "0";
    document.body.style.transform = "scale(0.95)";
  });

  // Lazy load images
  const lazyImages = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));

  // Add gradient animation to titles
  const titles = document.querySelectorAll(
    ".section-title, .movies-title, .products-title, .story-title",
  );
  titles.forEach((title) => {
    title.classList.add("animated-gradient-text");
  });

  // Performance monitoring
  if ("PerformanceObserver" in window) {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(
            "Long task detected:",
            entry.name,
            entry.duration + "ms",
          );
        }
      }
    });

    try {
      perfObserver.observe({ entryTypes: ["measure", "navigation"] });
    } catch (e) {
      console.log("Performance monitoring not available");
    }
  }

  // Add Easter egg (Konami code)
  let konamiCode = [];
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  document.addEventListener("keydown", (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(",") === konamiSequence.join(",")) {
      document.body.style.animation = "rainbow 2s linear infinite";
      if (typeof window.showToast === "function") {
        window.showToast(
          "🎮 Konami Code Activated! You found the secret!",
          "success",
        );
      }
      setTimeout(() => {
        document.body.style.animation = "";
      }, 5000);
    }
  });

  console.log("🎨 Design enhancements loaded successfully!");
});

// Add CSS for ripple effect
const style = document.createElement("style");
style.textContent = `
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .cursor-trail {
    position: fixed;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    pointer-events: none;
    z-index: 9999;
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 0.6;
  }
  
  .fade-in-element {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .fade-in-up {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  img.loaded {
    animation: imageLoad 0.5s ease;
  }
  
  @keyframes imageLoad {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  /* Smooth transitions for all interactive elements */
  * {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Focus visible styles */
  *:focus-visible {
    outline: 3px solid #667eea;
    outline-offset: 3px;
    border-radius: 8px;
  }
`;
document.head.appendChild(style);
