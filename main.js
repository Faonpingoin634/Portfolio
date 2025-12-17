document.addEventListener("DOMContentLoaded", () => {
  /* --- 1. GESTION DU THEME (Dark Mode) --- */
  const toggle = document.getElementById("theme-toggle");

  if (toggle) {
    // Vérifie si le mode sombre est actif (mis par le script du head)
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

  /* --- 2. MENU BURGER (Mobile) --- */
  const burgerMenu = document.getElementById("burger-menu");
  const navLinks = document.getElementById("nav-links");

  if (burgerMenu && navLinks) {
    burgerMenu.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-menu");
    });
  }

  /* --- 3. FILTRES PROJETS (Page Accueil uniquement) --- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Gestion de la classe active
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");

        // Masquer/Afficher les cartes
        projectCards.forEach((card) => {
          const tags = card.getAttribute("data-tags");
          if (filterValue === "all") {
            card.classList.remove("hide");
          } else if (tags && tags.includes(filterValue)) {
            card.classList.remove("hide");
          } else {
            card.classList.add("hide");
          }
        });
      });
    });
  }

  /* --- 4. VALIDATION EMAIL (Contact) --- */
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

  /* --- 5. ENVOI FORMULAIRE (Contact) --- */
  const form = document.getElementById("my-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      var status = document.getElementById("my-form-status");
      var data = new FormData(event.target);

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
          status.style.color = "var(--primary-color)";
          form.reset();
        } else {
          const data = await response.json();
          if (Object.hasOwn(data, "errors")) {
            status.innerHTML = data["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            status.innerHTML = "Oups! Il y a eu un problème lors de l'envoi.";
            status.style.color = "red";
          }
        }
      } catch (error) {
        status.innerHTML = "Oups! Il y a eu un problème lors de l'envoi.";
        status.style.color = "red";
      }
    });
  }
});
