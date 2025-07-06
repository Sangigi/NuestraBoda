document.addEventListener("DOMContentLoaded", () => {
  // Handle RSVP form submission
  initRsvpForm()

  // Initialize gallery lightbox
  initGalleryLightbox()

  // Smooth scrolling for navigation
  initSmoothScrolling()

  // Initialize music player
  initMusicPlayer()

  // Initialize scroll indicator
  initScrollIndicator()

  // Initialize interactive elements
  initInteractiveElements()
})

function initRsvpForm() {
  const rsvpForm = document.getElementById("rsvpForm")
  const formMessage = document.getElementById("formMessage")

  if (!rsvpForm) return

  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(rsvpForm)
    const name = formData.get("name")?.trim()
    const email = formData.get("email")?.trim()
    const attendance = formData.get("attendance") || "No especificado"
    const guests = formData.get("guests") || "0"
    const message = formData.get("message") || ""

    if (!name || !email) {
      formMessage.textContent = "Por favor completa los campos requeridos."
      formMessage.className = "form-message error"
      return
    }

    const submitBtn = rsvpForm.querySelector(".submit-btn")
    const originalBtnText = submitBtn.innerHTML
    submitBtn.innerHTML = '<span class="btn-text">Enviando...</span><span class="btn-icon">⏳</span>'
    submitBtn.disabled = true

    try {
      const response = await fetch("../rsvp.php", {
        method: "POST",
        body: new URLSearchParams({
          name,
          email,
          attendance,
          guests,
          message
        })
      })

      if (!response.ok) throw new Error("Error al enviar los datos.")

      const result = await response.text()

      formMessage.textContent = `¡Gracias ${name} por confirmar tu asistencia!`
      formMessage.className = "form-message success"
      rsvpForm.reset()
      createConfetti()
      showNotification("¡Confirmación enviada con éxito!")

    } catch (error) {
      console.error(error)
      formMessage.textContent = "Hubo un problema al enviar tu confirmación."
      formMessage.className = "form-message error"
    } finally {
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false

      setTimeout(() => {
        formMessage.textContent = ""
        formMessage.className = "form-message"
      }, 5000)
    }
  })
}

// Function to create confetti effect
function createConfetti() {
  const confettiCount = 150 // Aumentar la cantidad de confeti
  const colors = ["#f8c8d3", "#fde2e6", "#c5e1f0", "#d8f0e0", "#f9f2e2"]
  const formContainer = document.querySelector(".form-container")

  if (!formContainer) return

  // Limpiar confeti existente
  const existingConfetti = document.querySelectorAll(".confetti")
  existingConfetti.forEach((c) => c.remove())

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div")
    confetti.className = "confetti"

    // Random position, color, and size
    const size = Math.random() * 10 + 5 // Tamaño ligeramente más grande
    const color = colors[Math.floor(Math.random() * colors.length)]
    const left = `${Math.random() * 100}%`
    const startingTop = -20 // Comenzar desde arriba del contenedor

    confetti.style.width = `${size}px`
    confetti.style.height = `${size}px`
    confetti.style.backgroundColor = color
    confetti.style.left = left
    confetti.style.top = `${startingTop}px`
    confetti.style.opacity = Math.random() * 0.5 + 0.5
    confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0" // Algunos redondos, otros cuadrados
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`
    confetti.style.position = "absolute"
    confetti.style.zIndex = "100"
    confetti.style.pointerEvents = "none"

    // Add to form container
    formContainer.appendChild(confetti)

    // Animate falling with random horizontal movement
    const fallDuration = Math.random() * 3 + 2 // Entre 2-5 segundos
    const fallDelay = Math.random() * 0.5 // Pequeño retraso aleatorio

    setTimeout(() => {
      confetti.style.transition = `top ${fallDuration}s ease-out, left ${fallDuration}s ease-out, transform ${fallDuration}s ease-out`
      confetti.style.top = "100%"
      confetti.style.left = `${Math.random() * 100}%` // Movimiento horizontal aleatorio
      confetti.style.transform = `rotate(${Math.random() * 360 + 360}deg)`

      // Remove after animation
      setTimeout(() => {
        confetti.remove()
      }, fallDuration * 1000)
    }, fallDelay * 1000)
  }
}

// Function to initialize gallery lightbox
function initGalleryLightbox() {
  const galleryImages = document.querySelectorAll(".gallery-image")
  const lightbox = document.getElementById("lightbox")
  const lightboxImg = document.getElementById("lightbox-img")
  const lightboxCaption = document.querySelector(".lightbox-caption")
  const closeLightbox = document.querySelector(".close-lightbox")

  if (!lightbox || !lightboxImg) return

  // Open lightbox when clicking on gallery images
  galleryImages.forEach((image, index) => {
    image.addEventListener("click", function () {
      lightboxImg.src = this.src
      lightboxCaption.textContent = this.alt || `Foto ${index + 1}`
      lightbox.classList.add("active")
      document.body.style.overflow = "hidden" // Prevent scrolling when lightbox is open

      // Add elegant entrance animation
      lightboxImg.style.opacity = "0"
      lightboxImg.style.transform = "scale(0.9)"

      setTimeout(() => {
        lightboxImg.style.opacity = "1"
        lightboxImg.style.transform = "scale(1)"
      }, 100)
    })
  })

  // Close lightbox when clicking on close button
  if (closeLightbox) {
    closeLightbox.addEventListener("click", closeLightboxFunction)
  }

  // Close lightbox when clicking outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightboxFunction()
    }
  })

  // Close lightbox with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightboxFunction()
    }
  })

  // Function to close lightbox with animation
  function closeLightboxFunction() {
    lightboxImg.style.opacity = "0"
    lightboxImg.style.transform = "scale(0.9)"

    setTimeout(() => {
      lightbox.classList.remove("active")
      document.body.style.overflow = "" // Restore scrolling
    }, 300)
  }
}

// Function to initialize smooth scrolling for navigation
function initSmoothScrolling() {
  // Add smooth scrolling to all links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        // Scroll with animation
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Function to initialize music player
function initMusicPlayer() {
  const musicToggle = document.getElementById("music-toggle")
  const musicDisc = document.querySelector(".music-disc")
  const backgroundMusic = document.getElementById("background-music")
  const musicPlayer = document.querySelector(".music-player")

  if (!musicToggle || !backgroundMusic || !musicPlayer) return

  // Check if user has interacted with the page
  let userInteracted = false

  // Function to play music
  function playMusic() {
    backgroundMusic.play()
    musicToggle.classList.add("playing")
    musicPlayer.classList.add("playing")
  }

  // Function to pause music
  function pauseMusic() {
    backgroundMusic.pause()
    musicToggle.classList.remove("playing")
    musicPlayer.classList.remove("playing")
  }

  // Toggle music on button click
  musicToggle.addEventListener("click", () => {
    userInteracted = true

    if (backgroundMusic.paused) {
      playMusic()
      showNotification("Música iniciada")
    } else {
      pauseMusic()
      showNotification("Música pausada")
    }
  })

  // Play music automatically after user interaction with the page
  document.addEventListener(
    "click",
    () => {
      if (!userInteracted && backgroundMusic.paused) {
        playMusic()
        userInteracted = true
      }
    },
    { once: true },
  )

  // Add hover effect to music disc
  musicDisc.addEventListener("mouseenter", () => {
    musicDisc.style.transform = "scale(1.1)"
  })

  musicDisc.addEventListener("mouseleave", () => {
    musicDisc.style.transform = ""
  })
}

// Function to initialize scroll indicator
function initScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator")
  if (!scrollIndicator) return

  scrollIndicator.addEventListener("click", () => {
    const storySection = document.getElementById("story")
    if (storySection) {
      window.scrollTo({
        top: storySection.offsetTop,
        behavior: "smooth",
      })
    }
  })
}

// Function to initialize interactive elements
function initInteractiveElements() {
  // Parallax effect for backgrounds
  document.addEventListener("scroll", () => {
    const scrollY = window.scrollY
    const heroParallax = document.querySelector(".hero-parallax-bg")
    const countdownParallax = document.querySelector(".countdown-parallax-bg")

    if (heroParallax) {
      heroParallax.style.transform = `translateY(${scrollY * 0.3}px)`
    }

    if (countdownParallax) {
      const countdownSection = document.querySelector(".countdown-section")
      if (countdownSection) {
        const countdownOffset = countdownSection.offsetTop
        const countdownScroll = scrollY - countdownOffset

        if (countdownScroll > -window.innerHeight && countdownScroll < window.innerHeight) {
          countdownParallax.style.transform = `translateY(${countdownScroll * 0.2}px)`
        }
      }
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

// Add CSS for confetti
const confettiStyle = document.createElement("style")
confettiStyle.textContent = `
  .confetti {
    position: absolute;
    z-index: 100;
    pointer-events: none;
    transition: top 3s ease-out, transform 3s ease-out;
  }
`
document.head.appendChild(confettiStyle)
