document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show")
    })
  }

  // Hero slider functionality
  const slides = document.querySelectorAll(".slide")
  const dots = document.querySelectorAll(".dot")
  let currentSlide = 0

  function showSlide(n) {
    slides.forEach((slide) => slide.classList.remove("active"))
    dots.forEach((dot) => dot.classList.remove("active"))

    currentSlide = (n + slides.length) % slides.length

    slides[currentSlide].classList.add("active")
    dots[currentSlide].classList.add("active")
  }

  function nextSlide() {
    showSlide(currentSlide + 1)
  }

  // Change slide every 5 seconds
  let slideInterval = setInterval(nextSlide, 5000)

  // Click on dots to change slide
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearInterval(slideInterval)
      showSlide(index)
      slideInterval = setInterval(nextSlide, 5000)
    })
  })

  // Modal functionality
  const userMenuBtn = document.getElementById("user-menu-btn")
  const loginModal = document.getElementById("login-modal")
  const registerModal = document.getElementById("register-modal")
  const howItWorksModal = document.getElementById("how-it-works-modal")
  const howItWorksBtn = document.getElementById("how-it-works-btn")
  const showRegisterLink = document.getElementById("show-register")
  const showLoginLink = document.getElementById("show-login")
  const closeButtons = document.querySelectorAll(".close-modal")

  // Open login modal
  if (userMenuBtn && loginModal) {
    userMenuBtn.addEventListener("click", (e) => {
      e.preventDefault()
      loginModal.style.display = "block"
    })
  }

  // Open how it works modal
  if (howItWorksBtn && howItWorksModal) {
    howItWorksBtn.addEventListener("click", () => {
      howItWorksModal.style.display = "block"
    })
  }

  // Switch between login and register modals
  if (showRegisterLink && registerModal && loginModal) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault()
      loginModal.style.display = "none"
      registerModal.style.display = "block"
    })
  }

  if (showLoginLink && loginModal && registerModal) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault()
      registerModal.style.display = "none"
      loginModal.style.display = "block"
    })
  }

  // Close modals
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "none"
      if (registerModal) registerModal.style.display = "none"
      if (howItWorksModal) howItWorksModal.style.display = "none"
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none"
    }
    if (event.target === registerModal) {
      registerModal.style.display = "none"
    }
    if (event.target === howItWorksModal) {
      howItWorksModal.style.display = "none"
    }
  })

  // Form submission
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault()

      // Get form data
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value
      const rememberMe = document.getElementById("remember-me").checked

      // Here you would typically send this data to your server
      console.log("Login attempt:", { email, password, rememberMe })

      // Simulate successful login
      alert("Inicio de sesión exitoso!")
      loginModal.style.display = "none"

      // Update user menu to show logged in state
      if (userMenuBtn) {
        const userIcon = userMenuBtn.querySelector("i")
        const userText = userMenuBtn.querySelector("span")

        if (userIcon) userIcon.className = "fas fa-user-check"
        if (userText) userText.textContent = email.split("@")[0]
      }

      // Redirect to venues page or dashboard
      // window.location.href = 'venues.html';
    })
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault()

      // Get form data
      const name = document.getElementById("register-name").value
      const email = document.getElementById("register-email").value
      const password = document.getElementById("register-password").value
      const confirmPassword = document.getElementById("register-confirm-password").value
      const terms = document.getElementById("terms").checked

      // Validate passwords match
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden!")
        return
      }

      // Validate terms acceptance
      if (!terms) {
        alert("Debes aceptar los términos y condiciones!")
        return
      }

      // Here you would typically send this data to your server
      console.log("Registration attempt:", { name, email, password, terms })

      // Simulate successful registration
      alert("Registro exitoso! Por favor revisa tu correo para verificar tu cuenta.")
      registerModal.style.display = "none"
      loginModal.style.display = "block"
    })
  }

  // Venue card hover effects
  const venueCards = document.querySelectorAll(".venue-card")

  venueCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const btn = this.querySelector(".btn")
      if (btn) {
        btn.classList.add("btn-hover")
      }
    })

    card.addEventListener("mouseleave", function () {
      const btn = this.querySelector(".btn")
      if (btn) {
        btn.classList.remove("btn-hover")
      }
    })
  })

  // Link card hover effects
  const linkCards = document.querySelectorAll(".link-card")

  linkCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const icon = this.querySelector(".icon i")
      if (icon) {
        icon.classList.add("fa-bounce")
      }
    })

    card.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".icon i")
      if (icon) {
        icon.classList.remove("fa-bounce")
      }
    })
  })
})

