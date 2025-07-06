// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Canvas animation for names
  initNamesAnimation()

  // Initialize GSAP ScrollTrigger
  initScrollAnimations()

  // Initialize Intersection Observer for reveal animations
  initRevealAnimations()

  // Initialize countdown
  initCountdown()

  // Initialize preloader
  initPreloader()
})

// Function to animate names on canvas with elegant calligraphy effect
function initNamesAnimation() {
  const canvas = document.getElementById("namesCanvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const text = "Andrea & Roberto"
  let animationCompleted = false
  let hasStarted = false

  function resizeCanvas() {
    const container = canvas.parentElement
    const displayWidth = container.clientWidth
    const displayHeight = container.clientHeight

    // Si el contenedor aún no tiene tamaño, esperar y volver a intentar
    if (displayWidth === 0 || displayHeight === 0) {
      setTimeout(resizeCanvas, 100)
      return
    }

    canvas.width = displayWidth
    canvas.height = displayHeight

    const fontSize = Math.min(canvas.width / 10, 60)
    ctx.font = `${fontSize}px 'Great Vibes', cursive`
    ctx.fillStyle = "#0000ff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    if (animationCompleted) {
      drawCompletedText()
    }
  }

  function drawCompletedText() {
    const textX = canvas.width / 2
    const textY = canvas.height / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.shadowColor = "rgba(248, 200, 211, 0.3)"
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillText(text, textX, textY)

    ctx.save()
    ctx.globalAlpha = 0.7
    ctx.fillStyle = "#fde2e6"
    ctx.shadowColor = "rgba(253, 226, 230, 0.8)"
    ctx.shadowBlur = 15
    ctx.fillText(text, textX, textY)
    ctx.restore()

    const fontSize = Math.min(canvas.width / 10, 60)
    addTextFlourish(textX, textY, fontSize)
  }

  function addTextFlourish(textX, textY, fontSize) {
    ctx.save()
    ctx.strokeStyle = "#000055"
    ctx.lineWidth = 1
    ctx.beginPath()

    const flourishY = textY + fontSize / 2 + 10
    const flourishWidth = ctx.measureText(text).width * 0.8

    ctx.moveTo(textX - flourishWidth / 2, flourishY)
    ctx.bezierCurveTo(
      textX - flourishWidth / 4,
      flourishY - 10,
      textX + flourishWidth / 4,
      flourishY + 10,
      textX + flourishWidth / 2,
      flourishY
    )

    ctx.stroke()
    ctx.restore()
  }

  function animate() {
    if (hasStarted) return
    hasStarted = true

    let progress = 0
    const animationDuration = 3000
    const startTime = Date.now()

    function frame() {
      const currentTime = Date.now()
      progress = Math.min((currentTime - startTime) / animationDuration, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const textX = canvas.width / 2
      const textY = canvas.height / 2
      const textLength = Math.floor(text.length * progress)
      const partialText = text.substring(0, textLength)

      ctx.shadowColor = "rgba(248, 200, 211, 0.3)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.fillText(partialText, textX, textY)

      if (progress > 0.9) {
        const shimmerOpacity = Math.min((progress - 0.9) * 10, 1)
        ctx.save()
        ctx.globalAlpha = shimmerOpacity * 0.7
        ctx.fillStyle = "#fde2e6"
        ctx.shadowColor = "rgba(253, 226, 230, 0.8)"
        ctx.shadowBlur = 15
        ctx.fillText(text, textX, textY)
        ctx.restore()
      }

      if (progress < 1) {
        requestAnimationFrame(frame)
      } else {
        const fontSize = Math.min(canvas.width / 10, 60)
        addTextFlourish(textX, textY, fontSize)
        animationCompleted = true
      }
    }

    frame()
  }

  // Espera a que las fuentes estén listas y el canvas tenga dimensiones válidas
  document.fonts.ready.then(() => {
    resizeCanvas()
    animate()
  })

  // Redibuja al cambiar tamaño de ventana
  window.addEventListener("resize", resizeCanvas)

  // Redibuja en scroll si ya terminó la animación
  window.addEventListener("scroll", () => {
    if (animationCompleted) {
      requestAnimationFrame(drawCompletedText)
    }
  })
}

// Function to initialize GSAP ScrollTrigger animations
function initScrollAnimations() {
  // Import GSAP and ScrollTrigger
  const gsap = window.gsap
  const ScrollTrigger = window.gsap.ScrollTrigger

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)

  // Hero section parallax effect
  gsap.to(".hero-parallax-bg", {
    y: "30%",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  })

  // Countdown section parallax effect
  gsap.to(".countdown-parallax-bg", {
    y: "30%",
    ease: "none",
    scrollTrigger: {
      trigger: ".countdown-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  })

  // Floating elements animation
  gsap.to(".floating-element", {
    y: "random(-30, 30)",
    x: "random(-20, 20)",
    rotation: "random(-15, 15)",
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.2,
  })

  // Interactive elements hover effect
  document.querySelectorAll(".interactive-element").forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const deltaX = (x - centerX) / centerX
      const deltaY = (y - centerY) / centerY

      gsap.to(element, {
        rotationY: deltaX * 10,
        rotationX: -deltaY * 10,
        duration: 0.5,
        ease: "power2.out",
      })
    })

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    })
  })

  // Animate section headers
  gsap.utils.toArray(".section-header").forEach((header) => {
    gsap.from(header, {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: header,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    })
  })

  // Animate story items
  // gsap.utils.toArray(".story-item").forEach((item, i) => {
  //   gsap.from(item, {
  //     y: 100,
  //     opacity: 0,
  //     duration: 1,
  //     delay: i * 0.2,
  //     scrollTrigger: {
  //       trigger: item,
  //       start: "top 80%",
  //       toggleActions: "play none none none",
  //     },
  //   })
  // })

  // Animate detail cards
  // gsap.from(".detail-card", {
  //   y: 100,
  //   opacity: 0,
  //   duration: 1,
  //   stagger: 0.3,
  //   scrollTrigger: {
  //     trigger: ".details-grid",
  //     start: "top 80%",
  //     toggleActions: "play none none none",
  //   },
  // })

  // Animate quote
  gsap.from(".quote", {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".quote",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  })

  // Animate gallery items
  // gsap.utils.toArray(".gallery-item").forEach((item, i) => {
  //   gsap.from(item, {
  //     y: 50,
  //     opacity: 0,
  //     duration: 0.8,
  //     delay: i * 0.1,
  //     scrollTrigger: {
  //       trigger: ".gallery-grid",
  //       start: "top 80%",
  //       toggleActions: "play none none none",
  //     },
  //   })
  // })

  // Animate gift options
  // gsap.utils.toArray(".gift-option").forEach((item, i) => {
  //   gsap.from(item, {
  //     y: 50,
  //     opacity: 0,
  //     duration: 0.8,
  //     delay: i * 0.2,
  //     scrollTrigger: {
  //       trigger: ".gift-options",
  //       start: "top 80%",
  //       toggleActions: "play none none none",
  //     },
  //   })
  // })

  // Progress bar animation
  gsap.to(".progress-fill", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  })
}

// Function to initialize reveal animations using Intersection Observer
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right")

  // Hacer que todos los elementos sean visibles inmediatamente
  revealElements.forEach((element) => {
    element.classList.add("active")
  })

  // Mantener el observer para animaciones futuras si se desea
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "-50px 0px",
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active")
        observer.unobserve(entry.target)
      }
    })
  }, revealOptions)

  // Aplicar el observer solo para efectos visuales, no para visibilidad
  revealElements.forEach((element) => {
    revealObserver.observe(element)
  })
}

// Function to initialize countdown
function initCountdown() {
  const daysElement = document.getElementById("countdown-days")
  const hoursElement = document.getElementById("countdown-hours")
  const minutesElement = document.getElementById("countdown-minutes")
  const secondsElement = document.getElementById("countdown-seconds")

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return

  // Set the wedding date - June 15, 2025
  const weddingDate = new Date("August 16, 2025 07:00:00").getTime()

  // Update the countdown every second
  function updateCountdown() {
    const now = new Date().getTime()
    const distance = weddingDate - now

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // Display the result with leading zeros
    daysElement.textContent = days.toString().padStart(2, "0")
    hoursElement.textContent = hours.toString().padStart(2, "0")
    minutesElement.textContent = minutes.toString().padStart(2, "0")
    secondsElement.textContent = seconds.toString().padStart(2, "0")

    // If the countdown is over
    if (distance < 0) {
      clearInterval(countdownInterval)
      daysElement.textContent = "00"
      hoursElement.textContent = "00"
      minutesElement.textContent = "00"
      secondsElement.textContent = "00"
    }
  }

  // Initial call
  updateCountdown()

  // Update every second
  const countdownInterval = setInterval(updateCountdown, 1000)
}

// Function to initialize preloader
function initPreloader() {
  const preloader = document.querySelector(".preloader")
  const progressBar = document.querySelector(".preloader-progress-bar")

  if (!preloader || !progressBar) return

  // Simulate loading progress
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 10
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)

      // Hide preloader after a short delay
      setTimeout(() => {
        preloader.classList.add("hidden")
      }, 500)
    }
    progressBar.style.width = `${progress}%`
  }, 200)
}
