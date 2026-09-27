/**
 * Vinhomes Grand Park Landing Page - Vanilla JavaScript
 * Includes: Sticky Navbar, Animations, Lead Form, & Authentication Gate
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Sticky Navbar & Back to Top Scroll
  // ==========================================
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

  // ==========================================
  // 2. Smooth Back To Top Action
  // ==========================================
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 3. Close Mobile Navbar After Clicking Link
  // ==========================================
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

  // ==========================================
  // 4. Subtle Scroll Animations
  // ==========================================
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
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // ==========================================
  // 5. Contact Consultation Form & Thumbs Up Modal
  // ==========================================
  const contactForm = document.getElementById('leadContactForm');
  const formFeedback = document.getElementById('formFeedbackAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value.trim();
      const phoneNumber = document.getElementById('phoneNumber')?.value.trim();
      const email = document.getElementById('emailAddress')?.value.trim();

      // Vietnam mobile prefix: 10 digits
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

      if (!fullName) {
        showFeedback('Vui lòng nhập họ và tên của Quý khách.', 'danger');
        return;
      }

      if (!phoneNumber || !phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
        showFeedback('Vui lòng nhập số điện thoại hợp lệ (10 chữ số).', 'danger');
        return;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFeedback('Vui lòng nhập địa chỉ email hợp lệ.', 'danger');
        return;
      }

      // Hide previous alert error
      if (formFeedback) {
        formFeedback.classList.add('d-none');
      }

      // Reset form inputs (re-prefill logged in user info if available)
      contactForm.reset();
      const currentUser = getCurrentUser();
      if (currentUser) {
        prefillContactForm(currentUser);
      }

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

    if (type === 'success') {
      setTimeout(() => {
        formFeedback.classList.add('d-none');
      }, 6000);
    }
  }

  // ==========================================
  // 6. Registration & Login Gate (Authentication)
  // ==========================================
  const STORAGE_KEY_USER = 'vinhomes_current_user';
  const STORAGE_KEY_ALL_USERS = 'vinhomes_registered_accounts';

  const authGateModalEl = document.getElementById('authGateModal');
  const loggedOutNav = document.getElementById('loggedOutNav');
  const loggedInNav = document.getElementById('loggedInNav');
  const navUserName = document.getElementById('navUserName');
  const logoutBtn = document.getElementById('logoutBtn');
  const openLoginBtn = document.getElementById('openLoginBtn');
  const openRegisterBtn = document.getElementById('openRegisterBtn');

  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const registerAlert = document.getElementById('registerAlert');
  const loginAlert = document.getElementById('loginAlert');
  const switchToLoginLink = document.getElementById('switchToLoginLink');
  const switchToRegisterLink = document.getElementById('switchToRegisterLink');

  // Helpers to get/set storage
  function getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }

  function getRegisteredUsers() {
    try {
      const list = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      return list ? JSON.parse(list) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRegisteredUser(user) {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
  }

  // Auto pre-fill consultation form with registered user credentials
  function prefillContactForm(user) {
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('emailAddress');

    if (fullNameInput && user.name) fullNameInput.value = user.name;
    if (phoneInput && user.phone) phoneInput.value = user.phone;
    if (emailInput && user.email) emailInput.value = user.email;
  }

  // Unlock web access
  function unlockWebsite(user) {
    document.body.classList.remove('page-locked');

    // Update Navbar display
    if (loggedOutNav) loggedOutNav.classList.add('d-none');
    if (loggedInNav) {
      loggedInNav.classList.remove('d-none');
      loggedInNav.classList.add('d-flex');
    }
    if (navUserName) {
      navUserName.textContent = user.name || 'Thành viên';
    }

    // Hide Auth Modal if visible
    if (authGateModalEl && typeof bootstrap !== 'undefined') {
      const bsModal = bootstrap.Modal.getInstance(authGateModalEl);
      if (bsModal) {
        bsModal.hide();
      }
    }

    // Prefill the lead consultation form
    prefillContactForm(user);
  }

  // Lock web access (prompt registration / login)
  function lockWebsite(targetTab = 'register') {
    document.body.classList.add('page-locked');

    // Update Navbar display
    if (loggedOutNav) loggedOutNav.classList.remove('d-none');
    if (loggedInNav) {
      loggedInNav.classList.add('d-none');
      loggedInNav.classList.remove('d-flex');
    }

    // Switch tab in modal
    switchAuthTab(targetTab);

    // Open Auth Modal as static backdrop
    if (authGateModalEl && typeof bootstrap !== 'undefined') {
      const bsModal = bootstrap.Modal.getOrCreateInstance(authGateModalEl, {
        backdrop: 'static',
        keyboard: false
      });
      bsModal.show();
    }
  }

  function switchAuthTab(tabName) {
    const targetTabBtnId = tabName === 'login' ? 'tab-login-btn' : 'tab-register-btn';
    const tabBtn = document.getElementById(targetTabBtnId);
    if (tabBtn && typeof bootstrap !== 'undefined') {
      const tabInstance = bootstrap.Tab.getOrCreateInstance(tabBtn);
      tabInstance.show();
    }
  }

  // Setup tab switcher links
  if (switchToLoginLink) {
    switchToLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchAuthTab('login');
    });
  }

  if (switchToRegisterLink) {
    switchToRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchAuthTab('register');
    });
  }

  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', () => {
      lockWebsite('login');
    });
  }

  if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', () => {
      lockWebsite('register');
    });
  }

  // Handle Registration Form Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('regFullName')?.value.trim();
      const phone = document.getElementById('regPhone')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const password = document.getElementById('regPassword')?.value;

      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

      // Validation
      if (!name) {
        showAuthAlert(registerAlert, 'Vui lòng nhập họ và tên của Quý khách.');
        return;
      }

      if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
        showAuthAlert(registerAlert, 'Vui lòng nhập số điện thoại hợp lệ (10 chữ số).');
        return;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAuthAlert(registerAlert, 'Vui lòng nhập địa chỉ email hợp lệ.');
        return;
      }

      if (!password || password.length < 6) {
        showAuthAlert(registerAlert, 'Mật khẩu phải có ít nhất 6 ký tự.');
        return;
      }

      // Check duplicate phone/email
      const users = getRegisteredUsers();
      const exists = users.find(u => u.phone === phone || (email && u.email && u.email.toLowerCase() === email.toLowerCase()));

      if (exists) {
        showAuthAlert(registerAlert, 'Số điện thoại hoặc Email này đã được đăng ký. Vui lòng chuyển sang tab Đăng Nhập.');
        return;
      }

      // Save user & unlock
      const newUser = {
        name,
        phone,
        email: email || '',
        password,
        registeredAt: new Date().toISOString()
      };

      saveRegisteredUser(newUser);
      setCurrentUser(newUser);
      registerForm.reset();
      hideAuthAlert(registerAlert);

      unlockWebsite(newUser);
    });
  }

  // Handle Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const identifier = document.getElementById('loginIdentifier')?.value.trim();
      const password = document.getElementById('loginPassword')?.value;

      if (!identifier) {
        showAuthAlert(loginAlert, 'Vui lòng nhập Số điện thoại hoặc Email.');
        return;
      }

      if (!password) {
        showAuthAlert(loginAlert, 'Vui lòng nhập mật khẩu.');
        return;
      }

      const users = getRegisteredUsers();
      const matchedUser = users.find(u => 
        (u.phone === identifier || (u.email && u.email.toLowerCase() === identifier.toLowerCase())) &&
        u.password === password
      );

      if (matchedUser) {
        setCurrentUser(matchedUser);
        loginForm.reset();
        hideAuthAlert(loginAlert);
        unlockWebsite(matchedUser);
      } else {
        if (users.length === 0) {
          showAuthAlert(loginAlert, 'Chưa có tài khoản nào được tạo. Vui lòng chọn tab Đăng Ký để tạo tài khoản mới.');
        } else {
          showAuthAlert(loginAlert, 'Thông tin đăng nhập hoặc mật khẩu không chính xác.');
        }
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY_USER);
      lockWebsite('login');
    });
  }

  function showAuthAlert(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('d-none');
  }

  function hideAuthAlert(el) {
    if (!el) return;
    el.classList.add('d-none');
  }

  // ==========================================
  // 7. Initial Authentication Status Check
  // ==========================================
  const activeUser = getCurrentUser();
  if (activeUser) {
    unlockWebsite(activeUser);
  } else {
    // Require registration / login to access
    lockWebsite('register');
  }
});
