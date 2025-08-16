// main.js - Fonctions JavaScript pour le site de mariage Sandrine & Théodore

// --- Navigation Mobile ---
// Gère l'ouverture/fermeture du menu de navigation sur les appareils mobiles
document.addEventListener("DOMContentLoaded", function () {
  const navbarToggle = document.querySelector(".navbar-toggle");
  const navbarMenu = document.querySelector(".navbar-menu");
  const navbarLinks = document.querySelectorAll(".navbar-link");

  // Bascule la classe 'active' pour afficher/masquer le menu mobile
  if (navbarToggle) {
    navbarToggle.addEventListener("click", function () {
      navbarMenu.classList.toggle("active");
    });
  }

  // Ferme le menu mobile lorsqu'un lien est cliqué
  navbarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navbarMenu.classList.remove("active");
    });
  });

  // Ferme le menu mobile lorsque l'on clique en dehors de la barre de navigation
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".navbar")) {
      navbarMenu.classList.remove("active");
    }
  });

  // Met en surbrillance le lien de la page active dans la navigation
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navbarLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});

// --- Défilement Fluide ---
// Permet un défilement doux vers les ancres (sections) de la page
document.querySelectorAll("a[href^=\"#\"]").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// --- Animation au Défilement ---
// Ajoute une classe d'animation aux éléments lorsqu'ils deviennent visibles à l'écran
function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150; // Déclenche l'animation 150px avant que l'élément n'atteigne le bas de la fenêtre

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animate-fade-in");
    }
  });
}

// Écouteurs d'événements pour déclencher l'animation au défilement et au chargement de la page
window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);

// --- Fonctionnalité de la Liste de Cadeaux ---
// Données initiales des cadeaux. En l'absence de backend, cette liste est statique.
// 'reserved' indique si le cadeau est réservé localement par l'utilisateur actuel.
// 'reservedBy' n'est plus utilisé pour l'affichage public pour des raisons de confidentialité.
let gifts = [
  { id: 1, name: "Cuisinière gaz 4 feux + four", reserved: false },
  { id: 2, name: "Machine à laver automatique 8kg", reserved: false },
  { id: 3, name: "Salon complet 5 places", reserved: false },
  { id: 4, name: "Télévision LED 55 pouces", reserved: false },
  { id: 5, name: "Table de salle à manger + 6 chaises", reserved: false },
  { id: 6, name: "Réfrigérateur-congélateur", reserved: false },
  { id: 7, name: "Set de cuisine traditionnelle (marmites en fonte)", reserved: false },
  { id: 9, name: "Mixeur-blender professionnel + batteur", reserved: false },
  { id: 10, name: "Bouilloire et cafetière électriques", reserved: false },
  { id: 11, name: "Service à thé et café (plateau inclus)", reserved: false },
  { id: 12, name: "Tissus wax pour ameublement", reserved: false },
  { id: 14, name: "Plaids et couvertures en tissu africain", reserved: false },
  { id: 15, name: "Table basse artisanale en bois massif", reserved: false },
  { id: 16, name: "Tableau d'art africain contemporain", reserved: false },
  { id: 17, name: "Coffret d'épices et condiments africains", reserved: false },
  { id: 18, name: "Fer à repasser vapeur professionnel", reserved: false },
  { id: 19, name: "Ensemble de vaisselle", reserved: false },
  { id: 21, name: "Rideaux en tissu africain pour salon", reserved: false },
  { id: 22, name: "Nappe et serviettes de table assorties", reserved: false },
  { id: 23, name: "Ventilateur sur pied oscillant", reserved: false },
  { id: 25, name: "Lit matrimonial + tête de lit", reserved: false },
  { id: 26, name: "Armoire dressing", reserved: false },
  { id: 27, name: "Aspirateur balai sans fil", reserved: false },
  { id: 28, name: "Micro-ondes grill", reserved: false }
];

// Charge l'état des réservations depuis le stockage local du navigateur
// Cela permet à l'utilisateur de voir ses propres réservations même après avoir fermé la page
function loadGiftReservations() {
  const storedGifts = localStorage.getItem("weddingGifts");
  if (storedGifts) {
    gifts = JSON.parse(storedGifts);
  }
}

// Sauvegarde l'état des réservations dans le stockage local du navigateur
function saveGiftReservations() {
  localStorage.setItem("weddingGifts", JSON.stringify(gifts));
}

// Affiche les cadeaux sur la page, en reflétant leur état de réservation
function renderGifts() {
  const giftsContainer = document.getElementById("gifts-container");
  if (!giftsContainer) return; // S'assure que l'élément existe avant de continuer

  giftsContainer.innerHTML = ""; // Vide le conteneur avant de redessiner

  gifts.forEach((gift) => {
    const giftCard = document.createElement("div");
    giftCard.className = "card gift-card";
    giftCard.innerHTML = `
            <div class="gift-info">
                <h3 class="gift-name">${gift.name}</h3> 
            </div>
            <div class="gift-actions">
                ${
                  !gift.reserved
                    ? `<button class="btn btn-primary" data-gift-id="${gift.id}">Réserver</button>`
                    : `<button class="btn btn-secondary" disabled>Réservé</button>`
                }
            </div>
        `;
    giftsContainer.appendChild(giftCard);
  });

  // Ajoute les écouteurs d'événements aux nouveaux boutons "Réserver"
  document.querySelectorAll(".gift-card .btn-primary").forEach((button) => {
    button.addEventListener("click", function () {
      const giftId = parseInt(this.dataset.giftId);
      reserveGift(giftId);
    });
  });
}

// Gère la logique de réservation d'un cadeau
async function reserveGift(giftId) {
  const gift = gifts.find((g) => g.id === giftId);

  if (gift && !gift.reserved) {
    const guestName = prompt("Veuillez entrer votre nom pour réserver ce cadeau :\n(Votre nom ne sera pas affiché sur le site)");

    if (guestName && guestName.trim()) {
      // Marque le cadeau comme réservé localement pour cet utilisateur
      gift.reserved = true;
      saveGiftReservations(); // Sauvegarde l'état mis à jour
      renderGifts(); // Met à jour l'affichage sur la page de l'utilisateur

      // Prépare le message WhatsApp.
      // L'ouverture d'une nouvelle fenêtre/onglet est le comportement attendu pour initier une conversation WhatsApp.
      const phoneNumber = "242068457521"; // NUMÉRO DE TÉLÉPHONE MIS À JOUR
      const message = `Bonjour ! Je souhaite réserver le cadeau : ${gift.name} (${gift.price}). Mon nom est : ${guestName.trim()}.`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

      // Ouvre WhatsApp dans une nouvelle fenêtre/onglet. La page actuelle ne sera PAS redirigée.
      window.open(whatsappUrl, "_blank");

      // Affiche une notification à l'utilisateur pour l'informer de l'action.
      alert("Merci pour votre choix ! Vous allez être redirigé vers WhatsApp pour envoyer votre confirmation.");
    } else {
      alert("La réservation a été annulée. Veuillez entrer votre nom pour réserver un cadeau.");
    }
  }
}

// --- Fonctionnalité RSVP ---
// Gère la soumission du formulaire de confirmation de présence
function handleRSVP(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const formData = new FormData(event.target);
  const guestName = formData.get("guestName");
  const dotAttendance = formData.get("dotAttendance");
  const civilAttendance = formData.get("civilAttendance");
  const religiousAttendance = formData.get("religiousAttendance");
  const partyAttendance = formData.get("partyAttendance");
  const allergies = formData.get("allergies");

  // Construit le message WhatsApp avec les informations du formulaire
  let message = `Bonjour ! Je confirme ma présence au mariage de Sandrine & Théodore :\n\n`;
  message += `Nom : ${guestName}\n\n`;
  message += `Présence confirmée pour :\n`;
  if (dotAttendance === "oui") message += `✅ Dot (23 octobre à 13h)\n`;
  if (civilAttendance === "oui") message += `✅ Mariage Civil (25 octobre à 12h)\n`;
  if (religiousAttendance === "oui") message += `✅ Mariage Religieux (25 octobre à 15h)\n`;
  if (partyAttendance === "oui") message += `✅ Soirée (25 octobre à 20h)\n`;

  if (allergies) {
    message += `\nAllergies/Régimes particuliers : ${allergies}`;
  }

  message += `\n\nMerci ! 💕`;

  // Encode le message pour l'URL WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "242068457521"; // NUMÉRO DE TÉLÉPHONE MIS À JOUR
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Ouvre WhatsApp dans une nouvelle fenêtre/onglet
  window.open(whatsappUrl, "_blank");

  // Affiche un message de confirmation à l'utilisateur
  alert("Merci pour votre confirmation ! Vous allez être redirigé vers WhatsApp pour envoyer votre réponse.");
}

// --- Fonctionnalité de la Galerie Photo ---
// Gère l'ouverture et la fermeture de la modale de la galerie
function initGallery() {
  const galleryImages = document.querySelectorAll(".gallery-image");
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");
  const closeModal = document.querySelector(".modal-close");

  if (!modal) return; // S'assure que la modale existe

  // Ouvre la modale et affiche l'image cliquée
  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      modal.style.display = "flex";
      modalImg.src = this.src;
      modalCaption.textContent = this.alt;
      document.body.style.overflow = "hidden"; // Empêche le défilement de la page en arrière-plan
    });
  });

  // Ferme la modale via le bouton de fermeture
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
      document.body.style.overflow = "auto"; // Rétablit le défilement de la page
    });
  }

  // Ferme la modale en cliquant en dehors de l'image (sur l'arrière-plan de la modale)
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

// --- Initialisation au Chargement de la Page ---
// Exécute les fonctions nécessaires une fois que le DOM est entièrement chargé
document.addEventListener("DOMContentLoaded", function () {
  // Initialise la liste de cadeaux (charge l'état et affiche)
  loadGiftReservations();
  renderGifts();

  // Initialise la galerie photo
  initGallery();

  // Ajoute l'écouteur d'événements pour la soumission du formulaire RSVP
  const rsvpForm = document.getElementById("rsvp-form");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", handleRSVP);
  }
});

// --- Effet Parallax Léger ---
// Crée un léger effet de parallaxe sur l'arrière-plan du héros au défilement
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero-background");
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});


