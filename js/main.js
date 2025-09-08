// main.js - Fonctions JavaScript pour le site de mariage Sandrine & Théodore

// --- Navigation Mobile ---
document.addEventListener("DOMContentLoaded", function () {
  const navbarToggle = document.querySelector(".navbar-toggle");
  const navbarMenu = document.querySelector(".navbar-menu");
  const navbarLinks = document.querySelectorAll(".navbar-link");

  if (navbarToggle) {
    navbarToggle.addEventListener("click", function () {
      navbarMenu.classList.toggle("active");
    });
  }

  navbarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navbarMenu.classList.remove("active");
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".navbar")) {
      navbarMenu.classList.remove("active");
    }
  });

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navbarLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});

// --- Défilement Fluide ---
document.querySelectorAll("a[href^=\"#\"]").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// --- Animation au Défilement ---
function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animate-fade-in");
    }
  });
}
window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);

// --- Liste de Cadeaux: Persistance locale + WhatsApp ---
const PHONE = "242053823605";
const STORAGE_KEY = "giftReservations"; // { [code]: { name, reservedAt, giftName } }

function buildWhatsAppUrl(text) {
  const encoded = encodeURIComponent(text);
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isMobile
    ? `https://wa.me/${PHONE}?text=${encoded}`
    : `https://web.whatsapp.com/send?phone=${PHONE}&text=${encoded}`;
}

function getReservations() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveReservations(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

// Catalogue avec codes stables
let gifts = [
  { id: 1,  code: "G001", name: "Cuisinière gaz 4 feux + four", reserved: false },
  { id: 2,  code: "G002", name: "Machine à laver automatique 8kg", reserved: false },
  { id: 3,  code: "G003", name: "Salon complet 5 places", reserved: false },
  { id: 4,  code: "G004", name: "Télévision LED 55 pouces", reserved: false },
  { id: 5,  code: "G005", name: "Table de salle à manger + 6 chaises", reserved: false },
  { id: 6,  code: "G006", name: "Réfrigérateur-congélateur", reserved: false },
  { id: 7,  code: "G007", name: "Set de cuisine traditionnelle (marmites en fonte)", reserved: false },
  { id: 9,  code: "G009", name: "Mixeur-blender professionnel + batteur", reserved: false },
  { id: 10, code: "G010", name: "Bouilloire et cafetière électriques", reserved: false },
  { id: 11, code: "G011", name: "Service à thé et café (plateau inclus)", reserved: false },
  { id: 12, code: "G012", name: "Tissus wax pour ameublement", reserved: false },
  { id: 14, code: "G014", name: "Plaids et couvertures en tissu africain", reserved: false },
  { id: 15, code: "G015", name: "Table basse artisanale en bois massif", reserved: false },
  { id: 16, code: "G016", name: "Tableau d'art africain contemporain", reserved: false },
  { id: 17, code: "G017", name: "Coffret d'épices et condiments africains", reserved: false },
  { id: 18, code: "G018", name: "Fer à repasser vapeur professionnel", reserved: false },
  { id: 19, code: "G019", name: "Ensemble de vaisselle", reserved: false },
  { id: 21, code: "G021", name: "Rideaux en tissu africain pour salon", reserved: false },
  { id: 22, code: "G022", name: "Nappe et serviettes de table assorties", reserved: false },
  { id: 23, code: "G023", name: "Ventilateur sur pied oscillant", reserved: false },
  { id: 26, code: "G026", name: "Armoire dressing", reserved: false },
  { id: 27, code: "G027", name: "Aspirateur balai sans fil", reserved: false },
  { id: 28, code: "G028", name: "Micro-ondes grill", reserved: false },
];

function getGiftIcon(giftName) {
  const name = giftName.toLowerCase();
  if (name.includes('cuisinière') || name.includes('gaz')) return 'fas fa-microchip';
  if (name.includes('machine à laver')) return 'fas fa-soap';
  if (name.includes('salon') || name.includes('fauteuil')) return 'fas fa-couch';
  if (name.includes('télévision') || name.includes('tv')) return 'fas fa-tv';
  if (name.includes('salle à manger') || name.includes('chaise')) return 'fas fa-chair';
  if (name.includes('réfrigérateur') || name.includes('congélateur')) return 'fas fa-snowflake';
  if (name.includes('cuisine') || name.includes('marmite')) return 'fas fa-utensils';
  if (name.includes('mixeur') || name.includes('blender')) return 'fas fa-blender';
  if (name.includes('bouilloire') || name.includes('cafetière')) return 'fas fa-mug-hot';
  if (name.includes('thé') || name.includes('café')) return 'fas fa-coffee';
  if (name.includes('tissu') || name.includes('wax')) return 'fas fa-tshirt';
  if (name.includes('plaid') || name.includes('couverture')) return 'fas fa-bed';
  if (name.includes('table basse')) return 'fas fa-table';
  if (name.includes('tableau') || name.includes('art')) return 'fas fa-palette';
  if (name.includes('épice') || name.includes('condiment')) return 'fas fa-pepper-hot';
  if (name.includes('fer à repasser')) return 'fas fa-table';
  if (name.includes('vaisselle')) return 'fas fa-microchip';
  if (name.includes('rideau')) return 'fas fa-store';
  if (name.includes('nappe') || name.includes('serviette')) return 'fas fa-table';
  if (name.includes('ventilateur')) return 'fas fa-fan';
  if (name.includes('lit') || name.includes('matrimonial')) return 'fas fa-bed';
  if (name.includes('armoire') || name.includes('dressing')) return 'fas fa-table';
  if (name.includes('aspirateur')) return 'fas fa-broom';
  if (name.includes('micro-ondes')) return 'fas fa-microchip';
  return 'fas fa-gift';
}

function loadGiftReservations() {
  const map = getReservations();
  gifts = gifts.map((g) => ({ ...g, reserved: !!map[g.code] }));
}

function renderGifts() {
  const giftsContainer = document.getElementById('gifts-container');
  if (!giftsContainer) return;

  giftsContainer.innerHTML = '';
  gifts.forEach(gift => {
    const giftCard = document.createElement('div');
    giftCard.className = `gift-card ${gift.reserved ? 'reserved' : ''}`;
    giftCard.setAttribute('data-gift-code', gift.code);
    giftCard.setAttribute('data-gift-name', gift.name);

    const iconClass = getGiftIcon(gift.name);

    giftCard.innerHTML = `
      <div class="gift-icon"><i class="${iconClass}"></i></div>
      <h3 class="gift-name">${gift.name}</h3>
      ${gift.reserved ? `<p class="gift-reserved"><span class="status-badge">Réservé</span></p>` : ''}
      <div class="gift-actions">
        ${!gift.reserved
          ? `<button class="btn-reserve" type="button" onclick="reserveGift(${gift.id})"><i class=\"fas fa-shopping-cart\" style=\"margin-right: 8px;\"></i>Réserver</button>`
          : `<button class="btn-reserved" type="button" disabled><i class=\"fas fa-check\" style=\"margin-right: 8px;\"></i>Réservé</button>`}
      </div>
    `;

    giftsContainer.appendChild(giftCard);
  });
}

function reserveGift(giftId) {
  const gift = gifts.find((g) => g.id === giftId);
  if (!gift || gift.reserved) return;

  let userName = prompt('Veuillez entrer votre nom pour réserver ce cadeau :');
  if (!userName || !userName.trim()) {
    alert('La réservation a été annulée. Veuillez entrer votre nom.');
    return;
  }
  userName = userName.trim();

  const map = getReservations();
  if (map[gift.code]) return;
  map[gift.code] = { name: userName, reservedAt: new Date().toISOString(), giftName: gift.name };
  saveReservations(map);

  gift.reserved = true;
  renderGifts();

  const params = new URLSearchParams({ code: gift.code, giftName: gift.name, user: userName });
  window.location.href = `whatsapp-redirect.html?${params.toString()}`; // redirection vers page dédiée
}

// --- RSVP ---
function handleRSVP(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const guestName = formData.get("guestName");
  const dotAttendance = formData.get("dotAttendance");
  const civilAttendance = formData.get("civilAttendance");
  const religiousAttendance = formData.get("religiousAttendance");
  const partyAttendance = formData.get("partyAttendance");
  const allergies = formData.get("allergies");

  let message = `Bonjour ! Je confirme ma présence au mariage de Sandrine & Théodore :\n\n`;
  message += `*Nom* : ${guestName}\n\n`;
  message += `*Présence confirmée pour* :\n`;
  if (dotAttendance === "oui") message += `✅ Dot (23 octobre à 12h)\n`;
  if (civilAttendance === "oui") message += `✅ Mariage Civil (25 octobre à 10h)\n`;
  if (religiousAttendance === "oui") message += `✅ Mariage Religieux (25 octobre à 13h)\n`;
  if (allergies) message += `\nAllergies/Régimes particuliers : ${allergies}`;
  message += `\n\nMerci ! 💕`;

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank') // même onglet
}

// --- Galerie ---
function initGallery() {
  const galleryImages = document.querySelectorAll(".gallery-image");
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");
  const closeModal = document.querySelector(".modal-close");
  if (!modal) return;
  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      modal.style.display = "flex";
      modalImg.src = this.src;
      modalCaption.textContent = this.alt;
      document.body.style.overflow = "hidden";
    });
  });
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', function () {
  loadGiftReservations();
  renderGifts();
  initGallery();
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) rsvpForm.addEventListener('submit', handleRSVP);
  try { launchPetals(); } catch (e) {}
});

function launchPetals(){
  const container = document.createElement('div');
  container.className = 'petals';
  document.body.appendChild(container);
  const count = Math.min(28, Math.max(12, Math.floor(window.innerWidth/40)));
  for(let i=0;i<count;i++){
    const el = document.createElement('span');
    el.className = 'petal';
    const left = Math.random()*100;
    const delay = Math.random()*2.5;
    const dur = 6 + Math.random()*6;
    el.style.left = left + 'vw';
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = delay + 's';
    container.appendChild(el);
    setTimeout(()=>{ el.remove(); }, (dur+delay)*1000 + 500);
  }
}

// --- Parallax ---
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero-background");
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});
