// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initializePageLoader()
  initializeHeader()
  initializeNavigation()
  initializeHero()
  initializeProjects()
  initializeGallery()
  initializeTeamCarousel()
  initializeMobileMenu()
  initializeScrollAnimations()
  initializeCounterAnimation()
  initializeImageModal()
  initializeBackToTop()
  initializeScrollProgress()
  initializeDarkMode()
  initializeContactForm()
})

// Page Loader - DP Architects Style
function initializePageLoader() {
  const loader = document.getElementById("pageLoader")
  const progressBar = document.getElementById("loaderProgress")
  const loaderText = document.getElementById("loaderText")
  let progress = 0

  const interval = setInterval(() => {
    progress += Math.random() * 15

    if (progress >= 100) {
      progress = 100
      clearInterval(interval)

      // Complete loading
      progressBar.style.width = "100%"
      loaderText.textContent = "LOADING 100%"

      setTimeout(() => {
        loader.classList.add("hidden")
        document.body.style.overflow = "auto"
      }, 500)

      return
    }

    progressBar.style.width = progress + "%"
    loaderText.textContent = `LOADING ${Math.round(progress)}%`
  }, 100)

  // Prevent scrolling during loading
  document.body.style.overflow = "hidden"
}

// Header Functionality
function initializeHeader() {
  const header = document.getElementById("header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })
}

// Navigation
function initializeNavigation() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Active navigation link on scroll
  window.addEventListener("scroll", updateActiveNavLink)
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link-mobile")
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// Hero Section
function initializeHero() {
  const video = document.getElementById("heroVideo")

  if (video) {
    video.addEventListener("loadeddata", () => {
      console.log("Video loaded successfully")
    })

    video.addEventListener("error", (e) => {
      console.error("Video error:", e)
    })

    video.play().catch((e) => {
      console.log("Video autoplay prevented:", e)
    })
  }
}

// Scroll to section function
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

// Projects Section - FIXED URL MAPPING
function initializeProjects() {
  const projectUrls = {
    "Mina-Residence": "https://casadeixia.my.canva.site/mina-residence",
    "ignacio-farm": "https://casadeixia.my.canva.site/ignaciofarm",
    "casa-de-ixia": "https://casadeixia.my.canva.site/",
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    const project = card.getAttribute("data-project")

    card.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (projectUrls[project]) {
        window.open(projectUrls[project], "_blank", "noopener,noreferrer")
      }
    })
  })
}

// Gallery Functionality
function initializeGallery() {
  const galleryNavBtns = document.querySelectorAll(".gallery-nav-btn")
  const galleryCategories = document.querySelectorAll(".gallery-category")

  // Gallery navigation
  galleryNavBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category")

      // Update active button
      galleryNavBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")

      // Hide all categories first
      galleryCategories.forEach((cat) => {
        cat.style.opacity = "0"
        cat.classList.remove("active")
        setTimeout(() => {
          if (!cat.classList.contains("active")) {
            cat.style.display = "none"
          }
        }, 100)
      })

      // Show selected category
      const targetCategory = document.querySelector(`.gallery-category[data-category="${category}"]`)
      if (targetCategory) {
        setTimeout(() => {
          targetCategory.style.display = "block"
          targetCategory.classList.add("active")
          setTimeout(() => {
            targetCategory.style.opacity = "1"
          }, 10)

          // Reset to first project in the category
          const projects = targetCategory.querySelectorAll(".gallery-project")
          projects.forEach((project, index) => {
            if (index === 0) {
              project.style.visibility = "visible"
              project.classList.add("active")
              project.style.opacity = "1"
            } else {
              project.style.visibility = "hidden"
              project.classList.remove("active")
              project.style.opacity = "0"
            }
          })

          // Update indicators
          updateGalleryIndicators(targetCategory, 0)

          // Re-initialize image click handlers for the new category
          initializeImageClickHandlers()
        }, 150)
      }
    })
  })

  // Initialize carousel for each category
  galleryCategories.forEach((category) => {
    initializeGalleryCarousel(category)
  })

  // Initialize image click handlers
  initializeImageClickHandlers()
}

// Gallery Carousel functionality for each category
function initializeGalleryCarousel(category) {
  const projects = category.querySelectorAll(".gallery-project")
  const leftArrow = category.querySelector(".gallery-arrow-left")
  const rightArrow = category.querySelector(".gallery-arrow-right")
  let currentProject = 0
  let isTransitioning = false

  // Initialize - show only first project
  updateGalleryCarousel()

  // Arrow click handlers with transition lock
  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      if (isTransitioning) return
      currentProject = currentProject === 0 ? projects.length - 1 : currentProject - 1
      updateGalleryCarousel()
    })
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      if (isTransitioning) return
      currentProject = (currentProject + 1) % projects.length
      updateGalleryCarousel()
    })
  }

  function updateGalleryCarousel() {
    isTransitioning = true

    projects.forEach((project, index) => {
      if (index === currentProject) {
        project.classList.add("active")
        project.style.visibility = "visible"
        project.style.opacity = "1"
      } else {
        project.classList.remove("active")
        project.style.opacity = "0"
        setTimeout(() => {
          if (!project.classList.contains("active")) {
            project.style.visibility = "hidden"
          }
        }, 500)
      }
    })

    // Update indicators
    updateGalleryIndicators(category, currentProject)

    // Reset transition lock after animation completes
    setTimeout(() => {
      isTransitioning = false
    }, 500)
  }
}

// Initialize and update gallery indicators
function initializeGalleryIndicators() {
  const indicators = document.querySelectorAll(".gallery-indicator")

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", function () {
      if (this.classList.contains("active")) return

      const index = Number.parseInt(this.getAttribute("data-index"))
      const category = this.closest(".gallery-category")
      const projects = category.querySelectorAll(".gallery-project")

      // Hide all projects
      projects.forEach((project, i) => {
        if (i === index) {
          project.classList.add("active")
          project.style.visibility = "visible"
          project.style.opacity = "1"
        } else {
          project.classList.remove("active")
          project.style.opacity = "0"
          setTimeout(() => {
            if (!project.classList.contains("active")) {
              project.style.visibility = "hidden"
            }
          }, 500)
        }
      })

      // Update indicators
      updateGalleryIndicators(category, index)
    })
  })
}

function updateGalleryIndicators(category, activeIndex) {
  const indicators = category.querySelectorAll(".gallery-indicator")
  indicators.forEach((indicator, index) => {
    if (index === activeIndex) {
      indicator.classList.add("active")
    } else {
      indicator.classList.remove("active")
    }
  })
}

// Team Carousel Functionality
function initializeTeamCarousel() {
  const teamMembers = document.querySelectorAll(".team-member")
  const leftArrow = document.querySelector(".team-arrow-left")
  const rightArrow = document.querySelector(".team-arrow-right")
  const indicators = document.querySelectorAll(".team-indicator")
  let currentMember = 0
  let isTransitioning = false

  // Initialize - show only first member
  updateTeamCarousel()

  // Arrow click handlers
  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      if (isTransitioning) return
      currentMember = currentMember === 0 ? teamMembers.length - 1 : currentMember - 1
      updateTeamCarousel()
    })
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      if (isTransitioning) return
      currentMember = (currentMember + 1) % teamMembers.length
      updateTeamCarousel()
    })
  }

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      if (isTransitioning || index === currentMember) return
      currentMember = index
      updateTeamCarousel()
    })
  })

  function updateTeamCarousel() {
    isTransitioning = true

    teamMembers.forEach((member, index) => {
      if (index === currentMember) {
        member.classList.add("active")
        member.style.visibility = "visible"
        member.style.opacity = "1"
      } else {
        member.classList.remove("active")
        member.style.opacity = "0"
        setTimeout(() => {
          if (!member.classList.contains("active")) {
            member.style.visibility = "hidden"
          }
        }, 500)
      }
    })

    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentMember) {
        indicator.classList.add("active")
      } else {
        indicator.classList.remove("active")
      }
    })

    // Reset transition lock after animation completes
    setTimeout(() => {
      isTransitioning = false
    }, 500)
  }
}

// Mobile Menu
function initializeMobileMenu() {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const mobileNav = document.getElementById("mobileNav")
  const mobileOverlay = document.getElementById("mobileOverlay")

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("active")
      mobileOverlay.classList.toggle("active")
      mobileMenuToggle.classList.toggle("active")
    })

    // Close mobile menu when clicking on overlay
    mobileOverlay.addEventListener("click", () => {
      mobileNav.classList.remove("active")
      mobileOverlay.classList.remove("active")
      mobileMenuToggle.classList.remove("active")
    })

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link-mobile").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("active")
        mobileOverlay.classList.remove("active")
        mobileMenuToggle.classList.remove("active")
      })
    })
  }
}

// Scroll Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document
    .querySelectorAll(
      ".project-card, .contact-item, .gallery-category, .about-text, .team-carousel-container, .mission-section, .vision-section, .value-item",
    )
    .forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })

  // Section title animations
  const revealElements = document.querySelectorAll(".section-title, .section-divider")
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    },
    { threshold: 0.5 },
  )

  revealElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "all 0.8s ease"
    revealObserver.observe(el)
  })
}

// Counter Animation for Statistics
function initializeCounterAnimation() {
  const counters = document.querySelectorAll(".stat-number")
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = counter.textContent.replace(/[^\d]/g, "")
        const suffix = counter.textContent.replace(/[\d]/g, "")
        let current = 0
        const increment = target / 50

        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            counter.textContent = target + suffix
            clearInterval(timer)
          } else {
            counter.textContent = Math.ceil(current) + suffix
          }
        }, 40)

        counterObserver.unobserve(counter)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

// Image Modal Functionality
function initializeImageModal() {
  const modal = document.getElementById("imageModal")
  const closeBtn = document.querySelector(".image-modal-close")

  // Close modal on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeImageModal()
    }
  })

  // Close button click handler
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      closeImageModal()
    })
  }

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeImageModal()
    }
  })

  // Prevent modal content from closing when clicked
  const modalContent = document.querySelector(".image-modal-content")
  if (modalContent) {
    modalContent.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }
}

function initializeImageClickHandlers() {
  // Remove existing listeners to prevent duplicates
  const existingImages = document.querySelectorAll(".gallery-image, .team-photo")
  existingImages.forEach((img) => {
    img.replaceWith(img.cloneNode(true))
  })

  // Add click handlers to gallery images
  const galleryImages = document.querySelectorAll(".gallery-image")
  galleryImages.forEach((img) => {
    img.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()
      openImageModal(this.src, this.alt)
    })
  })

  // Add click handlers to team photos
  const teamPhotos = document.querySelectorAll(".team-photo")
  teamPhotos.forEach((img) => {
    img.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()
      openImageModal(this.src, this.alt)
    })
  })

  // Add click handlers to main image containers
  const mainImages = document.querySelectorAll(".gallery-main-image")
  mainImages.forEach((container) => {
    container.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()
      const img = this.querySelector(".gallery-image")
      if (img) {
        openImageModal(img.src, img.alt)
      }
    })
  })

  // Add click handlers to side image containers
  const sideImages = document.querySelectorAll(".gallery-side-image")
  sideImages.forEach((container) => {
    container.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()
      const img = this.querySelector(".gallery-image")
      if (img) {
        openImageModal(img.src, img.alt)
      }
    })
  })

  // Add click handlers to team image containers
  const teamImages = document.querySelectorAll(".team-image")
  teamImages.forEach((container) => {
    container.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()
      const img = this.querySelector(".team-photo")
      if (img) {
        openImageModal(img.src, img.alt)
      }
    })
  })
}

function openImageModal(src, alt) {
  const modal = document.getElementById("imageModal")
  const modalImg = document.getElementById("modalImage")

  modal.classList.add("active")
  document.body.style.overflow = "hidden"
  modalImg.src = src
  modalImg.alt = alt
}

function closeImageModal() {
  const modal = document.getElementById("imageModal")
  const modalImg = document.getElementById("modalImage")

  modal.classList.remove("active")
  document.body.style.overflow = "auto"

  setTimeout(() => {
    modalImg.src = ""
    modalImg.alt = ""
  }, 300)
}

// Back to Top Button
function initializeBackToTop() {
  const backToTopBtn = document.getElementById("backToTop")

  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("visible")
      } else {
        backToTopBtn.classList.remove("visible")
      }
    })

    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })

    // Keyboard accessibility
    backToTopBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    })
  }
}

// Scroll Progress Bar
function initializeScrollProgress() {
  const scrollProgress = document.getElementById("scrollProgress")

  if (scrollProgress) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      scrollProgress.style.width = scrollPercent + "%"
    })
  }
}

// Smooth parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero-video")
  const rate = scrolled * -0.3

  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${rate}px)`
  }
})

// Dark Mode Functionality
function initializeDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")
  const body = document.body

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme") || "light"

  // Apply saved theme
  if (savedTheme === "dark") {
    body.setAttribute("data-theme", "dark")
  }

  // Toggle dark mode
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-theme")

      if (currentTheme === "dark") {
        body.removeAttribute("data-theme")
        localStorage.setItem("theme", "light")
      } else {
        body.setAttribute("data-theme", "dark")
        localStorage.setItem("theme", "dark")
      }
    })
  }

  // Keyboard accessibility
  if (darkModeToggle) {
    darkModeToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        darkModeToggle.click()
      }
    })
  }
}

// EmailJS Contact Form Functionality
function initializeContactForm() {
  // Initialize EmailJS with your public key
  // You'll need to replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
  window.emailjs = window.emailjs || {}
  window.emailjs.init =
    window.emailjs.init ||
    ((key) => {
      window.emailjs.user_id = key
    })
  window.emailjs.init("XqszUOEfGE1WTznup")

  const contactForm = document.getElementById("contact-form")
  const formMessages = document.getElementById("form-messages")

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault()

      // Show loading state
      const submitBtn = contactForm.querySelector(".contact-submit-btn")
      const btnText = submitBtn.querySelector(".btn-text")
      const btnLoading = submitBtn.querySelector(".btn-loading")

      submitBtn.disabled = true
      btnText.style.display = "none"
      btnLoading.style.display = "inline"

      // Hide previous messages
      formMessages.classList.remove("show", "success", "error")

      // Send email using EmailJS
      // You'll need to replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
      window.emailjs
        .sendForm("service_eh7gz2u", "template_6zw6vow", contactForm)
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text)
            showFormMessage(
              "Thank you! Your message has been sent successfully. We'll get back to you soon.",
              "success",
            )
            contactForm.reset()
          },
          (error) => {
            console.log("FAILED...", error)
            showFormMessage(
              "Sorry, there was an error sending your message. Please try again or contact us directly.",
              "error",
            )
          },
        )
        .finally(() => {
          // Reset button state
          submitBtn.disabled = false
          btnText.style.display = "inline"
          btnLoading.style.display = "none"
        })
    })
  }

  function showFormMessage(message, type) {
    formMessages.textContent = message
    formMessages.classList.add("show", type)

    // Auto-hide success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        formMessages.classList.remove("show", "success")
      }, 5000)
    }
  }
}
