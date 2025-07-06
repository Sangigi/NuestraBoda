// Initialize particles when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initParticles()
})

// Function to create elegant pastel particles
function initParticles() {
  const canvas = document.getElementById("particles")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  // Set canvas dimensions to match window
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Particle settings - aumentar cantidad de partículas
  const particleCount = 80 // Duplicado desde 40
  const particles = []
  let mouseX = 0
  let mouseY = 0
  const mouseRadius = 120 // Aumentado para mayor área de interacción

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 3 + 1 // Tamaño aumentado
      this.baseSize = this.size
      this.speedX = Math.random() * 0.5 - 0.25 // Velocidad aumentada
      this.speedY = Math.random() * 0.5 - 0.25 // Velocidad aumentada
      this.opacity = Math.random() * 0.5 + 0.3 // Opacidad aumentada
      this.color = getPastelColor()
      this.angle = Math.random() * Math.PI * 2
      this.angleSpeed = Math.random() * 0.02 - 0.01 // Velocidad de rotación aumentada
      this.glowing = false
      this.glowIntensity = 0
    }

    // Update particle position
    update() {
      // Move in a slightly curved path
      this.angle += this.angleSpeed
      this.x += this.speedX + Math.sin(this.angle) * 0.2 // Movimiento más pronunciado
      this.y += this.speedY + Math.cos(this.angle) * 0.2 // Movimiento más pronunciado

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width
      if (this.x > canvas.width) this.x = 0
      if (this.y < 0) this.y = canvas.height
      if (this.y > canvas.height) this.y = 0

      // Slightly change opacity for shimmer effect
      this.opacity += Math.random() * 0.02 - 0.01
      if (this.opacity < 0.3) this.opacity = 0.3 // Mínimo más alto
      if (this.opacity > 0.8) this.opacity = 0.8 // Máximo más alto

      // Check distance from mouse
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Interact with mouse
      if (distance < mouseRadius) {
        // Move away from mouse
        const angle = Math.atan2(dy, dx)
        const force = (mouseRadius - distance) / mouseRadius
        this.speedX -= Math.cos(angle) * force * 0.1 // Fuerza aumentada
        this.speedY -= Math.sin(angle) * force * 0.1 // Fuerza aumentada

        // Glow effect
        this.glowing = true
        this.glowIntensity = (mouseRadius - distance) / mouseRadius
      } else {
        // Gradually reduce glow
        if (this.glowing) {
          this.glowIntensity *= 0.95
          if (this.glowIntensity < 0.05) {
            this.glowing = false
            this.glowIntensity = 0
          }
        }
      }

      // Apply size based on glow
      this.size = this.baseSize + this.glowIntensity * 3 // Efecto de brillo más pronunciado

      // Gradually slow down
      this.speedX *= 0.99
      this.speedY *= 0.99

      // Add minimum speed if too slow
      const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY)
      if (speed < 0.05) {
        const angle = Math.random() * Math.PI * 2
        this.speedX += Math.cos(angle) * 0.05
        this.speedY += Math.sin(angle) * 0.05
      }
    }

    // Draw particle
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)

      // Add glow effect
      if (this.glowing) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3) // Radio de brillo aumentado
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity + this.glowIntensity * 0.3})`) // Brillo más intenso
        gradient.addColorStop(1, `rgba(${this.color}, 0)`)

        ctx.fillStyle = gradient
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2) // Radio de brillo aumentado
        ctx.fill()
      }

      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
      ctx.fill()
    }
  }

  // Get random pastel color - colores más vibrantes
  function getPastelColor() {
    const colors = [
      "248, 200, 220", // Rosa más vibrante
      "197, 230, 255", // Azul más vibrante
      "216, 255, 230", // Verde más vibrante
      "255, 242, 210", // Beige más vibrante
      "240, 240, 255", // Lavanda suave
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Initialize particles
  function init() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particles.length; i++) {
      particles[i].update()
      particles[i].draw()
    }

    // Connect particles with lines if they're close enough
    connectParticles()

    requestAnimationFrame(animate)
  }

  // Connect nearby particles with lines
  function connectParticles() {
    const maxDistance = 150 // Distancia aumentada

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          // Calculate opacity based on distance
          const opacity = 1 - distance / maxDistance

          // Check if either particle is glowing
          const glowFactor = particles[i].glowIntensity + particles[j].glowIntensity
          const glowOpacity = opacity * 0.2 + glowFactor * 0.3 // Opacidad aumentada

          // Get color based on particles
          const color1 = particles[i].color
          const color2 = particles[j].color

          // Use average color for line
          const colorParts1 = color1.split(",").map(Number)
          const colorParts2 = color2.split(",").map(Number)
          const avgColor = [
            Math.floor((colorParts1[0] + colorParts2[0]) / 2),
            Math.floor((colorParts1[1] + colorParts2[1]) / 2),
            Math.floor((colorParts1[2] + colorParts2[2]) / 2),
          ].join(", ")

          ctx.beginPath()
          ctx.strokeStyle = `rgba(${avgColor}, ${glowOpacity})`
          ctx.lineWidth = 0.5 + glowFactor * 0.8 // Línea más gruesa
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Reset particles
    particles.length = 0
    init()
  })

  // Start animation
  init()
  animate()
}
