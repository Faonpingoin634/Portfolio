/**
 * 1. Gestionnaire de Thème (Dark/Light Mode)
 */
class ThemeManager {
  constructor(toggleId) {
    this.toggle = document.getElementById(toggleId);
    if (this.toggle) this.init();
  }

  init() {
    this.toggle.checked =
      document.documentElement.classList.contains("dark-mode");
    this.toggle.addEventListener("change", () => this.toggleTheme());
  }

  toggleTheme() {
    const isDark = this.toggle.checked;
    document.documentElement.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }
}

/**
 * 2. Gestionnaire de Navigation (Menu Burger Mobile)
 */
class NavigationManager {
  constructor(burgerId, navId) {
    this.burgerMenu = document.getElementById(burgerId);
    this.navLinks = document.getElementById(navId);
    if (this.burgerMenu && this.navLinks) this.init();
  }

  init() {
    this.burgerMenu.addEventListener("click", () => this.toggleMenu());

    this.navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });
  }

  toggleMenu() {
    this.navLinks.classList.toggle("mobile-menu");
    document.body.classList.toggle("no-scroll");
  }

  closeMenu() {
    this.navLinks.classList.remove("mobile-menu");
    document.body.classList.remove("no-scroll");
  }
}

/**
 * 3. Système de Filtrage des Projets
 */
class ProjectFilter {
  constructor(btnSelector, cardSelector, gridSelector) {
    this.buttons = document.querySelectorAll(btnSelector);
    this.cards = document.querySelectorAll(cardSelector);
    this.grid = document.querySelector(gridSelector);

    if (this.buttons.length > 0 && this.grid) this.init();
  }

  init() {
    this.createNoResultMessage();
    this.buttons.forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.filterProjects(e.currentTarget),
      );
    });
  }

  createNoResultMessage() {
    this.noResultMsg = document.createElement("div");
    this.noResultMsg.className = "no-result-msg hide";
    this.noResultMsg.innerHTML =
      "<p>Aucun projet trouvé pour cette catégorie pour le moment.</p>";
    this.grid.appendChild(this.noResultMsg);
  }

  filterProjects(clickedBtn) {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    clickedBtn.classList.add("active");

    const filterValue = clickedBtn.dataset.filter;
    let visibleCount = 0;

    this.cards.forEach((card) => {
      const tags = card.dataset.tags || "";
      const isMatch = filterValue === "all" || tags.includes(filterValue);

      card.classList.toggle("hide", !isMatch);
      if (isMatch) visibleCount++;
    });

    this.noResultMsg.classList.toggle("hide", visibleCount > 0);
  }
}

/**
 * 4. Gestionnaire du Formulaire de Contact
 */
class ContactForm {
  constructor(formId, emailId, statusId) {
    this.form = document.getElementById(formId);
    this.emailInput = document.getElementById(emailId);
    this.status = document.getElementById(statusId);

    if (this.form && this.status) this.init();
  }

  init() {
    if (this.emailInput) {
      this.emailInput.addEventListener("input", (e) =>
        this.validateEmail(e.target),
      );
    }
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);

    input.classList.toggle("input-valid", isValid && input.value !== "");
    input.classList.toggle("input-invalid", !isValid && input.value !== "");
  }

  async handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(this.form);

    this.updateStatus("Envoi en cours...", "loading");

    try {
      const response = await fetch(this.form.action, {
        method: this.form.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        this.updateStatus("Merci ! Ton message a bien été envoyé.", "success");
        this.form.reset();
        this.emailInput?.classList.remove("input-valid", "input-invalid");
      } else {
        const dataJson = await response.json();
        const errorMsg = Object.hasOwn(dataJson, "errors")
          ? dataJson.errors.map((err) => err.message).join(", ")
          : "Oups ! Il y a eu un problème lors de l'envoi.";
        this.updateStatus(errorMsg, "error");
      }
    } catch (error) {
      this.updateStatus("Oups ! Il y a eu un problème réseau.", "error");
    }
  }

  updateStatus(message, type) {
    this.status.className = `form-status ${type}`;
    this.status.textContent = message;
  }
}

/**
 * 5. Observateur de Scroll (Animations avec IntersectionObserver)
 */
class ScrollObserver {
  constructor(staggerSelectors, revealSelector) {
    this.staggerLists = document.querySelectorAll(staggerSelectors);
    this.revealElements = document.querySelectorAll(revealSelector);

    if (this.revealElements.length > 0) this.init();
  }

  init() {
    this.setupStaggerDelays();
    this.observeElements();
  }

  setupStaggerDelays() {
    this.staggerLists.forEach((list) => {
      list.querySelectorAll(".reveal").forEach((child, index) => {
        child.style.setProperty("--delay", `${index * 0.1}s`);
      });
    });
  }

  observeElements() {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    this.revealElements.forEach((el) => observer.observe(el));
  }
}

/**
 * 6. Gestionnaire de Lightbox (Zoom d'images)
 */
class LightboxManager {
  constructor(lightboxId, imgId, closeSelector, imageSelectors) {
    this.lightbox = document.getElementById(lightboxId);
    this.lightboxImg = document.getElementById(imgId);
    this.closeBtn = document.querySelector(closeSelector);
    this.images = document.querySelectorAll(imageSelectors);

    if (this.lightbox && this.lightboxImg && this.images.length > 0)
      this.init();
  }

  init() {
    this.images.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", (e) => this.open(e, img));
    });

    this.closeBtn?.addEventListener("click", () => this.close());

    this.lightbox.addEventListener("click", (e) => {
      if (e.target === this.lightbox) this.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.lightbox.classList.contains("active")) {
        this.close();
      }
    });
  }

  open(event, imgElement) {
    event.stopPropagation();
    event.preventDefault();

    this.lightboxImg.src = imgElement.src;
    this.lightboxImg.alt = imgElement.alt || "Image en grand";
    this.lightbox.classList.add("active");
    document.body.classList.add("no-scroll");
  }

  close() {
    this.lightbox.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
}

/**
 * =========================================
 * APPLICATION PRINCIPALE (Facade Pattern)
 * =========================================
 */
class App {
  static init() {
    new ThemeManager("theme-toggle");
    new NavigationManager("burger-menu", "nav-links");
    new ProjectFilter(".filter-btn", ".project-card", ".project-grid");
    new ContactForm("my-form", "email", "my-form-status");
    new ScrollObserver(
      ".stagger-list, .project-grid, .cards-container",
      ".reveal",
    );
    new LightboxManager(
      "lightbox",
      "lightbox-img",
      ".close-lightbox",
      ".project-gallery img:not(.tech-icon):not(.icon), .card img:not(.tech-icon):not(.icon), .pygame-screen img:not(.tech-icon):not(.icon)",
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
