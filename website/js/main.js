/* =========================================
   SCOPE ANAESTHESIA SERVICES - MAIN JAVASCRIPT
   ========================================= */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to optimize performance on scroll/resize events
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

// ========================================
// MOBILE HAMBURGER MENU
// ========================================

function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".navbar")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// ========================================
// DROPDOWN MENUS
// ========================================

function initDropdowns() {
  // Handle both .dropdown-toggle and .dropdown > .nav-link
  const dropdownItems = document.querySelectorAll(".dropdown");

  dropdownItems.forEach((item) => {
    const toggle = item.querySelector(".nav-link");
    const menu = item.querySelector(".dropdown-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", function (e) {
      e.preventDefault();

      // Close other dropdowns
      document.querySelectorAll(".dropdown-menu").forEach((m) => {
        if (m !== menu) {
          m.classList.remove("show");
        }
      });

      // Toggle current dropdown
      menu.classList.toggle("show");
      this.setAttribute(
        "aria-expanded",
        this.getAttribute("aria-expanded") === "true" ? "false" : "true"
      );
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-item")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("show");
      });
      document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false");
      });
    }
  });
}

// ========================================
// STICKY NAVIGATION WITH SCROLL DETECTION
// ========================================

function initStickyNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  let lastScrollTop = 0;

  window.addEventListener(
    "scroll",
    debounce(function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Add background color when scrolled
      if (scrollTop > 50) {
        nav.classList.add("scroll-down");
      } else {
        nav.classList.remove("scroll-down");
      }

      lastScrollTop = scrollTop;
    }, 10)
  );
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if href is just "#"
      if (href === "#") return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Close mobile menu if open
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        if (hamburger && navMenu) {
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
        }
      }
    });
  });
}

// ========================================
// ANIMATED NUMBER COUNTERS
// ========================================

function initCounters() {
  const counterElements = document.querySelectorAll(".stat-number");

  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        const counter = entry.target;
        const target = parseInt(counter.textContent, 10);
        const isPercentage = counter.textContent.includes("%");
        const isPlus = counter.textContent.includes("+");

        animateCounter(counter, target, isPercentage, isPlus);
        counter.classList.add("counted");
        observer.unobserve(counter);
      }
    });
  });

  counterElements.forEach((counter) => {
    observer.observe(counter);
  });
}

function animateCounter(element, target, isPercentage, isPlus) {
  let current = 0;
  const increment = target / 50; // 50 frames
  const duration = 2000; // 2 seconds
  const stepTime = duration / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    let displayValue = Math.floor(current);
    if (isPercentage) {
      displayValue += "%";
    } else if (isPlus) {
      displayValue += "+";
    }

    element.textContent = displayValue;
  }, stepTime);
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".card, .team-member, .service-card, .timeline-item"
  );

  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

// ========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ========================================

function initActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-link");

  if (navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          updateActiveNavLink(id);
        }
      });
    },
    { threshold: 0.5 }
  );

  // Observe all sections with ids
  document.querySelectorAll("section[id], div[id]").forEach((section) => {
    observer.observe(section);
  });
}

function updateActiveNavLink(sectionId) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.classList.add("active");
    }
  });
}

// ========================================
// CONTACT FORM VALIDATION
// ========================================

function initContactForm() {
  const form = document.querySelector("form[id*='contact'], form.contact-form");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const errors = validateForm(formData);

    if (errors.length > 0) {
      showFormMessage(this, "error", "Please fix the following errors: " + errors.join(", "));
      return;
    }

    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    setTimeout(() => {
      showFormMessage(this, "success", "Thank you! We'll be in touch soon.");
      this.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Clear message after 5 seconds
      setTimeout(() => {
        const message = this.querySelector(".form-message");
        if (message) {
          message.style.display = "none";
        }
      }, 5000);
    }, 1500);
  });
}

function validateForm(formData) {
  const errors = [];
  const email = formData.get("email");
  const phone = formData.get("phone");
  const name = formData.get("name");
  const message = formData.get("message");

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Please enter a valid email address");
  }

  if (phone && !isValidPhone(phone)) {
    errors.push("Please enter a valid phone number");
  }

  if (!message || message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  return errors;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  const regex = /^[\d\s\-\+\(\)]{10,}$/;
  return regex.test(phone);
}

function showFormMessage(form, type, message) {
  let messageDiv = form.querySelector(".form-message");

  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.className = "form-message";
    form.insertBefore(messageDiv, form.firstChild);
  }

  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.display = "block";
}

// ========================================
// NEWS TICKER AUTO-SCROLL
// ========================================

function initNewsTicker() {
  const tickerContent = document.querySelector(".ticker-content");

  if (!tickerContent) return;

  // The animation is CSS-based, but we can add interaction handling
  // The ticker will loop continuously due to CSS animation
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

function initBackToTop() {
  const backToTopBtn = document.querySelector(".back-to-top");

  if (!backToTopBtn) {
    // Create back to top button if it doesn't exist
    createBackToTopButton();
  }

  const btn = document.querySelector(".back-to-top");

  window.addEventListener(
    "scroll",
    debounce(() => {
      if (window.pageYOffset > 300) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    }, 10)
  );

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function createBackToTopButton() {
  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.innerHTML = "↑";
  btn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(btn);
}

// ========================================
// INITIALIZE ALL FEATURES
// ========================================

function initializeWebsite() {
  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

function init() {
  console.log("Initializing Scope Anaesthesia Services website...");

  initHamburgerMenu();
  initDropdowns();
  initStickyNav();
  initSmoothScroll();
  initCounters();
  initScrollReveal();
  initActiveNavLink();
  initContactForm();
  initNewsTicker();
  initBackToTop();

  // Add keyboard navigation support
  initKeyboardNav();

  console.log("Website initialization complete!");
}

// ========================================
// ACCESSIBILITY - KEYBOARD NAVIGATION
// ========================================

function initKeyboardNav() {
  // Close menu with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const hamburger = document.querySelector(".hamburger");
      const navMenu = document.querySelector(".nav-menu");

      if (hamburger && navMenu) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }

      // Close dropdowns
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("show");
      });
    }

    // Scroll to top with Ctrl/Cmd + Home
    if ((e.ctrlKey || e.metaKey) && e.key === "Home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// ========================================
// LAZY LOADING IMAGES
// ========================================

function initLazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// ========================================
// PERFORMANCE MONITORING
// ========================================

function logPerformanceMetrics() {
  // Only run in modern browsers
  if (window.performance && window.performance.timing) {
    window.addEventListener("load", function () {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
      }, 0);
    });
  }
}

// ========================================
// START INITIALIZATION
// ========================================

initializeWebsite();
initLazyLoadImages();
logPerformanceMetrics();
