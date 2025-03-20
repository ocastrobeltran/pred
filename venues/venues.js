document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle")
    const navLinks = document.querySelector(".nav-links")
  
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show")
      })
    }
  
    // Filters functionality
    const filterBtn = document.querySelector(".filter-btn")
    const sportFilter = document.getElementById("sport-filter")
    const locationFilter = document.getElementById("location-filter")
    const availabilityFilter = document.getElementById("availability-filter")
    const venueSearch = document.getElementById("venue-search")
    const venueCards = document.querySelectorAll(".venue-card")
    const venuesCount = document.getElementById("venues-count")
  
    // Apply filters
    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        applyFilters()
      })
    }
  
    // Search on input
    if (venueSearch) {
      venueSearch.addEventListener("input", () => {
        applyFilters()
      })
    }
  
    // Filter on select change
    if (sportFilter) {
      sportFilter.addEventListener("change", () => {
        applyFilters()
      })
    }
  
    if (locationFilter) {
      locationFilter.addEventListener("change", () => {
        applyFilters()
      })
    }
  
    if (availabilityFilter) {
      availabilityFilter.addEventListener("change", () => {
        applyFilters()
      })
    }
  
    function applyFilters() {
      const sportValue = sportFilter ? sportFilter.value.toLowerCase() : ""
      const locationValue = locationFilter ? locationFilter.value.toLowerCase() : ""
      const availabilityValue = availabilityFilter ? availabilityFilter.value.toLowerCase() : ""
      const searchValue = venueSearch ? venueSearch.value.toLowerCase() : ""
  
      let visibleCount = 0
  
      venueCards.forEach((card) => {
        const cardSport = card.getAttribute("data-sport").toLowerCase()
        const cardLocation = card.getAttribute("data-location").toLowerCase()
        const cardTitle = card.querySelector("h3").textContent.toLowerCase()
        const cardDescription = card.querySelector("p").textContent.toLowerCase()
        const isAvailable = !card.querySelector(".venue-badge-busy")
  
        // Check if card matches all filters
        const matchesSport = sportValue === "" || cardSport.includes(sportValue)
        const matchesLocation = locationValue === "" || cardLocation.includes(locationValue)
        const matchesSearch =
          searchValue === "" || cardTitle.includes(searchValue) || cardDescription.includes(searchValue)
        const matchesAvailability = availabilityValue === "" || (availabilityValue === "available" && isAvailable)
  
        // Show or hide card based on filters
        if (matchesSport && matchesLocation && matchesSearch && matchesAvailability) {
          card.style.display = "block"
          visibleCount++
        } else {
          card.style.display = "none"
        }
      })
  
      // Update venues count
      if (venuesCount) {
        venuesCount.textContent = visibleCount
      }
    }
  
    // Initialize filters
    applyFilters()
  
    // Venue card hover effects
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
  
    // Pagination functionality
    const paginationLinks = document.querySelectorAll(".pagination a")
  
    paginationLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Remove active class from all links
        paginationLinks.forEach((l) => {
          l.classList.remove("active")
        })
  
        // Add active class to clicked link
        this.classList.add("active")
  
        // In a real application, this would load the next page of venues
        // For now, we'll just scroll to the top of the venues section
        document.querySelector(".venues-grid-section").scrollIntoView({ behavior: "smooth" })
      })
    })
  })
  
  