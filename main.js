document.addEventListener("DOMContentLoaded", () => {
  /*  1. GESTION DU THÈME (Dark / Light Mode)*/
  const toggle = document.getElementById("theme-toggle");

  if (toggle) {
    if (document.documentElement.classList.contains("dark-mode")) {
      toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        document.documentElement.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    });
  }

  /*2. MENU BURGER (Mobile) */
  const burgerMenu = document.getElementById("burger-menu");
  const navLinks = document.getElementById("nav-links");

  if (burgerMenu && navLinks) {
    burgerMenu.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-menu");
      document.body.classList.toggle("no-scroll");
    });

    const menuLinks = navLinks.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-menu");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  /* 3. FILTRES PROJETS (Page Accueil) */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectGrid = document.querySelector(".project-grid");

  if (filterButtons.length > 0 && projectGrid) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");
        let visibleCount = 0;

        projectCards.forEach((card) => {
          const tags = card.getAttribute("data-tags");
          const tagsArray = tags ? tags.split(" ") : [];

          if (filterValue === "all" || tagsArray.includes(filterValue)) {
            card.classList.remove("hide");
            visibleCount++;
          } else {
            card.classList.add("hide");
          }
        });

        let noResultMsg = document.getElementById("no-result-msg");

        if (visibleCount === 0) {
          if (!noResultMsg) {
            noResultMsg = document.createElement("div");
            noResultMsg.id = "no-result-msg";
            noResultMsg.innerHTML =
              "<p>Aucun projet trouvé pour cette catégorie pour le moment.</p>";
            // Styles injectés dynamiquement
            Object.assign(noResultMsg.style, {
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "2rem",
              color: "var(--text-color)",
            });
            projectGrid.appendChild(noResultMsg);
          }
        } else {
          if (noResultMsg) {
            noResultMsg.remove();
          }
        }
      });
    });
  }

  /*  4. FORMULAIRE DE CONTACT (Validation & Envoi)*/

  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("input", (e) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(e.target.value)) {
        emailInput.style.borderColor = "red";
      } else {
        emailInput.style.borderColor = "green";
      }
    });
  }

  const form = document.getElementById("my-form");
  const status = document.getElementById("my-form-status");

  if (form && status) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(event.target);

      try {
        const response = await fetch(event.target.action, {
          method: form.method,
          body: data,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          status.innerHTML = "Merci ! Ton message a bien été envoyé.";
          status.style.color = "var(--primary-color)"; // Utilise la couleur du thème (vert/violet)
          form.reset();
          if (emailInput) emailInput.style.borderColor = "var(--input-border)";
        } else {
          const dataJson = await response.json();
          if (Object.hasOwn(dataJson, "errors")) {
            status.innerHTML = dataJson["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            status.innerHTML = "Oups! Il y a eu un problème lors de l'envoi.";
            status.style.color = "red";
          }
        }
      } catch (error) {
        status.innerHTML = "Oups! Il y a eu un problème réseau.";
        status.style.color = "red";
      }
    });
  }

  /* 5. ANIMATION AU SCROLL (IntersectionObserver) */

  const staggerLists = document.querySelectorAll(
    ".stagger-list, .project-grid, .cards-container"
  );
  if (staggerLists.length > 0) {
    staggerLists.forEach((list) => {
      const children = list.querySelectorAll(".reveal");
      children.forEach((child, index) => {
        child.style.setProperty("--delay", `${index * 0.1}s`);
      });
    });
  }

  // B. Déclenchement de l'animation
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    revealElements.forEach((el) => {
      revealOnScroll.observe(el);
    });
  }

  /* 6. LIGHTBOX (Zoom Images)*/
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close-lightbox");

  const galleryImages = document.querySelectorAll(
    ".project-gallery img, .card img, .pygame-screen img"
  );

  if (lightbox && lightboxImg) {
    if (galleryImages.length > 0) {
      galleryImages.forEach((img) => {
        if (
          !img.classList.contains("tech-icon") &&
          !img.classList.contains("icon")
        ) {
          img.style.cursor = "zoom-in";
          img.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();

            lightbox.classList.add("active");
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            document.body.classList.add("no-scroll");
          });
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        lightbox.classList.remove("active");
        document.body.classList.remove("no-scroll");
      });
    }

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        lightbox.classList.remove("active");
        document.body.classList.remove("no-scroll");
      }
    });
  }
});
