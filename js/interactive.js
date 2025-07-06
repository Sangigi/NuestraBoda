// Initialize interactive elements when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize custom cursor
  initCustomCursor()

  // Initialize tilt effect
  initTiltEffect()

  // Initialize navigation
  initNavigation()

  // Initialize story details
  initStoryDetails()

  // Initialize dress code panel
  initDressCode()

  // Initialize calendar options
  initCalendar()

  // Initialize location tabs
  initLocationTabs()

  // Initialize gallery
  initGallery()

  // Initialize gift registry
  initGiftRegistry()

  // Initialize hashtag copy
  initHashtagCopy()

  // Initialize guest selector
  initGuestSelector()

  // Initialize interactive inputs
  initInteractiveInputs()
})

// Function to initialize custom cursor
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor")
  if (!cursor) return

  // Update cursor position
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`
    cursor.style.top = `${e.clientY}px`
  })

  // Add active class on click
  document.addEventListener("mousedown", () => {
    cursor.classList.add("active")
  })

  document.addEventListener("mouseup", () => {
    cursor.classList.remove("active")
  })

  // Add hover effect for links and buttons
  const interactiveElements = document.querySelectorAll("a, button, .interactive-element, .tilt-element")
  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("link-hover")
    })

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("link-hover")
    })
  })
}

// Function to initialize tilt effect
function initTiltEffect() {
  const tiltElements = document.querySelectorAll(".tilt-element")
  if (!tiltElements.length || !window.VanillaTilt) return

  // Initialize vanilla-tilt
  window.VanillaTilt.init(tiltElements, {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.03,
  })
}

// Function to initialize navigation
function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")
  if (!navToggle || !navMenu) return

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove("active")
      navMenu.classList.remove("active")
    }
  })

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        // Close menu
        navToggle.classList.remove("active")
        navMenu.classList.remove("active")

        // Scroll to section
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth",
        })

        // Show notification
        showNotification(`Navegando a ${link.getAttribute("data-section")}`)
      }
    })
  })
}

// Function to initialize story details
function initStoryDetails() {
  const storyImages = document.querySelectorAll(".story-image")
  const storyDetails = document.querySelectorAll(".story-details")
  const closeButtons = document.querySelectorAll(".close-details")
  if (!storyImages.length || !storyDetails.length) return

  storyImages.forEach((image, index) => {
    image.addEventListener("click", () => {
      storyDetails[index].classList.add("active")
      document.body.style.overflow = "hidden"
    })
  })

  closeButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      storyDetails[index].classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Close when clicking outside
  storyDetails.forEach((detail) => {
    detail.addEventListener("click", (e) => {
      if (e.target === detail) {
        detail.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  })
}

// Function to initialize dress code panel
function initDressCode() {
  const dressCodeToggle = document.querySelector(".dress-code-toggle")
  const dressCodePanel = document.querySelector(".dress-code-panel")
  const closePanel = document.querySelector(".close-panel")
  if (!dressCodeToggle || !dressCodePanel || !closePanel) return

  dressCodeToggle.addEventListener("click", () => {
    dressCodePanel.classList.add("active")
    document.body.style.overflow = "hidden"
  })

  closePanel.addEventListener("click", () => {
    dressCodePanel.classList.remove("active")
    document.body.style.overflow = ""
  })

  // Close when clicking outside
  dressCodePanel.addEventListener("click", (e) => {
    if (e.target === dressCodePanel) {
      dressCodePanel.classList.remove("active")
      document.body.style.overflow = ""
    }
  })
}

// Function to initialize calendar options
function initCalendar() {
  const calendarToggle = document.querySelector(".calendar-toggle")
  const calendarOptions = document.querySelector(".calendar-options")
  if (!calendarToggle || !calendarOptions) return

  calendarToggle.addEventListener("click", () => {
    calendarOptions.classList.toggle("active")
  })

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!calendarToggle.contains(e.target) && !calendarOptions.contains(e.target)) {
      calendarOptions.classList.remove("active")
    }
  })

  // Calendar options
  const calendarLinks = document.querySelectorAll(".calendar-option")
  calendarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const calendarType = link.getAttribute("data-calendar")
      showNotification(`Evento añadido a ${calendarType}`)
      calendarOptions.classList.remove("active")
    })
  })
}

// Function to initialize location tabs
function initLocationTabs() {
  const locationTabs = document.querySelectorAll(".location-tab")
  const locationDetails = document.querySelectorAll(".location-detail")
  const mapPoints = document.querySelectorAll(".map-point")
  if (!locationTabs.length || !locationDetails.length) return

  locationTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const location = tab.getAttribute("data-location")

      // Update active tab
      locationTabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Update active detail
      locationDetails.forEach((detail) => {
        if (detail.getAttribute("data-location") === location) {
          detail.classList.add("active")
        } else {
          detail.classList.remove("active")
        }
      })

      // Highlight map point
      mapPoints.forEach((point) => {
        if (point.getAttribute("data-location") === location) {
          point.style.transform = "scale(1.5)"
        } else {
          point.style.transform = "scale(1)"
        }
      })
    })
  })
}

// Function to initialize gallery
function initGallery() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")
  const lightbox = document.getElementById("lightbox")
  const lightboxImg = document.getElementById("lightbox-img")
  const lightboxCaption = document.querySelector(".lightbox-caption")
  const closeLightbox = document.querySelector(".close-lightbox")
  const prevButton = document.querySelector(".lightbox-prev")
  const nextButton = document.querySelector(".lightbox-next")
  let currentIndex = 0
  let filteredItems = [...galleryItems]

  if (!filterButtons.length || !galleryItems.length || !lightbox || !lightboxImg) return

  // Filter gallery items
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter items
      galleryItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.classList.remove("hidden")
        } else {
          item.classList.add("hidden")
        }
      })

      // Update filtered items array
      filteredItems = [...galleryItems].filter(
        (item) => filter === "all" || item.getAttribute("data-category") === filter,
      )
    })
  })

  // Open lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img")
      const caption = item.querySelector(".gallery-caption")

      lightboxImg.src = img.src
      lightboxCaption.innerHTML = caption ? caption.innerHTML : ""
      lightbox.classList.add("active")
      document.body.style.overflow = "hidden"

      // Set current index
      currentIndex = filteredItems.indexOf(item)
    })
  })

  // Close lightbox
  closeLightbox.addEventListener("click", () => {
    lightbox.classList.remove("active")
    document.body.style.overflow = ""
  })

  // Close when clicking outside
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Previous image
  prevButton.addEventListener("click", (e) => {
    e.stopPropagation()
    currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length
    updateLightboxContent()
  })

  // Next image
  nextButton.addEventListener("click", (e) => {
    e.stopPropagation()
    currentIndex = (currentIndex + 1) % filteredItems.length
    updateLightboxContent()
  })

  // Update lightbox content
  function updateLightboxContent() {
    const item = filteredItems[currentIndex]
    const img = item.querySelector("img")
    const caption = item.querySelector(".gallery-caption")

    // Animate image change
    lightboxImg.style.opacity = "0"
    setTimeout(() => {
      lightboxImg.src = img.src
      lightboxCaption.innerHTML = caption ? caption.innerHTML : ""
      lightboxImg.style.opacity = "1"
    }, 300)
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return

    if (e.key === "Escape") {
      lightbox.classList.remove("active")
      document.body.style.overflow = ""
    } else if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length
      updateLightboxContent()
    } else if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % filteredItems.length
      updateLightboxContent()
    }
  })
}

// Function to initialize gift registry
function initGiftRegistry() {
  const bankDetailsButtons = document.querySelectorAll(".show-bank-details")
  const bankDetailsModal = document.querySelector(".bank-details-modal")
  const closeModal = document.querySelector(".close-modal")
  if (!bankDetailsButtons.length || !bankDetailsModal || !closeModal) return

  bankDetailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      bankDetailsModal.classList.add("active")
      document.body.style.overflow = "hidden"
    })
  })

  closeModal.addEventListener("click", () => {
    bankDetailsModal.classList.remove("active")
    document.body.style.overflow = ""
  })

  // Close when clicking outside
  bankDetailsModal.addEventListener("click", (e) => {
    if (e.target === bankDetailsModal) {
      bankDetailsModal.classList.remove("active")
      document.body.style.overflow = ""
    }
  })
}

// Function to initialize hashtag copy
function initHashtagCopy() {
  const copyButton = document.querySelector(".copy-hashtag")
  const hashtag = document.querySelector(".wedding-hashtag")
  if (!copyButton || !hashtag) return

  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(hashtag.textContent)
    showNotification("Hashtag copiado al portapapeles")
  })
}

// Function to initialize guest selector
function initGuestSelector() {
  const minusBtn = document.querySelector(".minus-btn")
  const plusBtn = document.querySelector(".plus-btn")
  const guestsInput = document.getElementById("guests")
  if (!minusBtn || !plusBtn || !guestsInput) return

  minusBtn.addEventListener("click", () => {
    const currentValue = Number.parseInt(guestsInput.value)
    if (currentValue > 1) {
      guestsInput.value = currentValue - 1
    }
  })

  plusBtn.addEventListener("click", () => {
    const currentValue = Number.parseInt(guestsInput.value)
    if (currentValue < 5) {
      guestsInput.value = currentValue + 1
    }
  })
}

// Function to initialize interactive inputs
function initInteractiveInputs() {
  const inputs = document.querySelectorAll(".interactive-input")
  if (!inputs.length) return

  inputs.forEach((input) => {
    // Add focus effect
    input.addEventListener("focus", () => {
      input.style.transform = "translateY(-3px)"
    })

    input.addEventListener("blur", () => {
      input.style.transform = ""
    })

    // Add typing effect for text inputs and textareas
    if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
      input.addEventListener("input", () => {
        if (input.value.length > 0) {
          input.style.borderColor = "#f8c8d3"
        } else {
          input.style.borderColor = ""
        }
      })
    }
  })
}

// Function to show notification
function showNotification(message) {
  const notification = document.getElementById("notification")
  const notificationMessage = document.querySelector(".notification-message")
  if (!notification || !notificationMessage) return

  notificationMessage.textContent = message
  notification.classList.add("active")

  // Hide notification after 5 seconds
  setTimeout(() => {
    notification.classList.remove("active")
  }, 5000)
}
