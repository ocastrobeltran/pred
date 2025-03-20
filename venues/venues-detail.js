document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle")
    const navLinks = document.querySelector(".nav-links")
  
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show")
      })
    }
  
    // Gallery thumbnails
    const thumbnails = document.querySelectorAll(".thumbnail")
    const mainImage = document.querySelector(".main-image img")
  
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
        // Remove active class from all thumbnails
        thumbnails.forEach((thumb) => {
          thumb.classList.remove("active")
        })
  
        // Add active class to clicked thumbnail
        this.classList.add("active")
  
        // Update main image
        const thumbnailSrc = this.querySelector("img").src
        mainImage.src = thumbnailSrc
      })
    })
  
    // Calendar functionality
    const days = document.querySelectorAll(".day")
    const timeSlots = document.querySelector(".slots-grid")
    const selectDateMessage = document.querySelector(".select-date-message")
    const reserveBtn = document.getElementById("reserve-btn")
  
    let selectedDate = null
    let selectedTime = null
  
    days.forEach((day) => {
      if (!day.classList.contains("empty")) {
        day.addEventListener("click", function () {
          // If day is available
          if (this.classList.contains("available")) {
            // Remove selected class from all days
            days.forEach((d) => {
              d.classList.remove("selected")
            })
  
            // Add selected class to clicked day
            this.classList.add("selected")
  
            // Show time slots
            selectDateMessage.style.display = "none"
            timeSlots.style.display = "grid"
  
            // Store selected date
            selectedDate = this.textContent
  
            // Reset selected time
            selectedTime = null
            document.querySelectorAll(".time-slot").forEach((slot) => {
              slot.classList.remove("selected")
            })
  
            // Disable reserve button until time is selected
            reserveBtn.disabled = true
          }
        })
      }
    })
  
    // Time slots functionality
    const availableTimeSlots = document.querySelectorAll(".time-slot.available")
  
    availableTimeSlots.forEach((slot) => {
      slot.addEventListener("click", function () {
        // Remove selected class from all time slots
        availableTimeSlots.forEach((s) => {
          s.classList.remove("selected")
        })
  
        // Add selected class to clicked time slot
        this.classList.add("selected")
  
        // Store selected time
        selectedTime = this.textContent
  
        // Enable reserve button
        reserveBtn.disabled = false
      })
    })
  
    // Reserve button
    const reservationModal = document.getElementById("reservation-modal")
    const closeModal = document.querySelector("#reservation-modal .close-modal")
    const cancelReservation = document.getElementById("cancel-reservation")
    const selectedDateElement = document.getElementById("selected-date")
    const selectedTimeElement = document.getElementById("selected-time")
  
    if (reserveBtn) {
      reserveBtn.addEventListener("click", () => {
        if (selectedDate && selectedTime) {
          // Update reservation summary
          selectedDateElement.textContent = selectedDate + " de noviembre de 2023"
          selectedTimeElement.textContent = selectedTime
  
          // Show reservation modal
          reservationModal.style.display = "block"
        }
      })
    }
  
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        reservationModal.style.display = "none"
      })
    }
  
    if (cancelReservation) {
      cancelReservation.addEventListener("click", () => {
        reservationModal.style.display = "none"
      })
    }
  
    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === reservationModal) {
        reservationModal.style.display = "none"
      }
    })
  
    // Reservation form submission
    const reservationForm = document.getElementById("reservation-form")
  
    if (reservationForm) {
      reservationForm.addEventListener("submit", (event) => {
        event.preventDefault()
  
        // Get form data
        const purpose = document.getElementById("purpose").value
        const participants = document.getElementById("participants").value
        const notes = document.getElementById("notes").value
        const terms = document.getElementById("terms").checked
  
        // Validate form
        if (!purpose || !participants || !terms) {
          alert("Por favor complete todos los campos requeridos.")
          return
        }
  
        // Create reservation data
        const reservationData = {
          venue: "Estadio Jaime Morón",
          date: selectedDate + " de noviembre de 2023",
          time: selectedTime,
          purpose: purpose,
          participants: participants,
          notes: notes,
        }
  
        console.log("Reservation data:", reservationData)
  
        // Show success message
        alert(
          "¡Reserva enviada con éxito! Recibirá una notificación por correo electrónico con la confirmación de su reserva.",
        )
  
        // Close modal
        reservationModal.style.display = "none"
  
        // Reset form
        reservationForm.reset()
  
        // Redirect to confirmation page or dashboard
        // window.location.href = 'confirmation.html';
      })
    }
  
    // Calendar navigation
    const prevMonthBtn = document.getElementById("prev-month")
    const nextMonthBtn = document.getElementById("next-month")
    const currentMonthElement = document.getElementById("current-month")
  
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    let currentMonth = 10 // November (0-based index)
    let currentYear = 2023
  
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", () => {
        currentMonth--
        if (currentMonth < 0) {
          currentMonth = 11
          currentYear--
        }
        updateCalendar()
      })
    }
  
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", () => {
        currentMonth++
        if (currentMonth > 11) {
          currentMonth = 0
          currentYear++
        }
        updateCalendar()
      })
    }
  
    function updateCalendar() {
      currentMonthElement.textContent = months[currentMonth] + " " + currentYear
  
      // In a real application, this would fetch the available dates for the selected month
      // For now, we'll just update the month display
    }
  })
  
  