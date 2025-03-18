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
    const loginBtn = document.getElementById("login-btn")
    const registerBtn = document.getElementById("register-btn")
    const loginModal = document.getElementById("login-modal")
    const registerModal = document.getElementById("register-modal")
    const closeButtons = document.querySelectorAll(".close-modal")
  
    // Open login modal
    if (loginBtn && loginModal) {
      loginBtn.addEventListener("click", () => {
        loginModal.style.display = "block"
      })
    }
  
    // Open register modal
    if (registerBtn && registerModal) {
      registerBtn.addEventListener("click", () => {
        registerModal.style.display = "block"
      })
    }
  
    // Close modals
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (loginModal) loginModal.style.display = "none"
        if (registerModal) registerModal.style.display = "none"
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
        alert("Login successful!")
        loginModal.style.display = "none"
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
      })
    }
  
    // Venue reservation buttons
    const reserveButtons = document.querySelectorAll(".venue-card .btn-primary")
  
    reserveButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Check if user is logged in
        const isLoggedIn = false // This would be determined by your authentication system
  
        if (!isLoggedIn) {
          loginModal.style.display = "block"
          return
        }
  
        // If logged in, redirect to reservation form
        // window.location.href = '/reservation-form.html';
        alert("Redirigiendo al formulario de reserva...")
      })
    })
  })
  
  // Reservation form functionality (to be implemented)
  class ReservationForm {
    constructor(formElement) {
      this.form = formElement
      this.setupListeners()
    }
  
    setupListeners() {
      // Form event listeners
    }
  
    validate() {
      // Form validation logic
      return true
    }
  
    submit() {
      // Form submission logic
    }
  }
  
  // User dashboard functionality (to be implemented)
  class UserDashboard {
    constructor(container) {
      this.container = container
      this.reservations = []
    }
  
    loadReservations() {
      // Load user reservations
    }
  
    render() {
      // Dashboard rendering logic
    }
  }
  
  // Admin panel functionality (to be implemented)
  class AdminPanel {
    constructor(container) {
      this.container = container
      this.pendingReservations = []
    }
  
    loadPendingReservations() {
      // Load pending reservations
    }
  
    approveReservation(id) {
      // Approve reservation logic
    }
  
    rejectReservation(id, reason) {
      // Reject reservation logic
    }
  
    render() {
      // Admin panel rendering logic
    }
  }
  
  