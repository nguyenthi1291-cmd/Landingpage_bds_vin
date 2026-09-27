/**
 * Vinhomes Grand Park Landing Page - Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar scroll effect
  const navbar = document.querySelector('.site-navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const handleScroll = () => {
    const scrollPos = window.scrollY || window.pageYOffset;
    
    // Navbar styling on scroll
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger on page load

  // 2. Smooth back-to-top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Close mobile navbar after clicking a link
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
  const navbarCollapse = document.getElementById('navbarNav');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // 4. Subtle scroll fade-in animation using IntersectionObserver
  const fadeElements = document.querySelectorAll('.fade-in-section');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // 5. Contact Form Validation & Interactive Feedback
  const contactForm = document.getElementById('leadContactForm');
  const formFeedback = document.getElementById('formFeedbackAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value.trim();
      const phoneNumber = document.getElementById('phoneNumber')?.value.trim();
      const email = document.getElementById('emailAddress')?.value.trim();

      // Basic client-side phone number check (Vietnam mobile prefix: 10 digits)
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

      if (!fullName) {
        showFeedback('Vui lòng nhập họ và tên của Quý khách.', 'danger');
        return;
      }

      // If email is provided, validate format
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFeedback('Vui lòng nhập địa chỉ email hợp lệ.', 'danger');
        return;
      }

      // Hide previous alert error
      if (formFeedback) {
        formFeedback.classList.add('d-none');
      }

      // Reset form inputs
      contactForm.reset();

      // Show the requested Success Popup Modal
      const modalEl = document.getElementById('consultSuccessModal');
      if (modalEl && typeof bootstrap !== 'undefined') {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
      }
    });
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;

    formFeedback.className = `alert alert-${type} mt-3 d-flex align-items-center`;
    formFeedback.innerHTML = `
      <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
      <div>${message}</div>
    `;
    formFeedback.classList.remove('d-none');

    // Auto dismiss after 6 seconds if success
    if (type === 'success') {
      setTimeout(() => {
        formFeedback.classList.add('d-none');
      }, 6000);
    }
  }
});
