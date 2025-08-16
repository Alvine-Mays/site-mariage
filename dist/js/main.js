// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-link');

    // Toggle mobile menu
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbarMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navbarMenu.classList.remove('active');
        }
    });

    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navbarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-fade-in');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Liste de cadeaux functionality
let gifts = [
    { id: 1, name: 'Service à thé en porcelaine', price: '150€', reserved: false, reservedBy: '' },
    { id: 2, name: 'Ensemble de draps en soie', price: '200€', reserved: false, reservedBy: '' },
    { id: 3, name: 'Coffret ustensiles de cuisine', price: '120€', reserved: false, reservedBy: '' },
    { id: 4, name: 'Vase en cristal', price: '180€', reserved: false, reservedBy: '' },
    { id: 5, name: 'Tableau décoratif', price: '250€', reserved: false, reservedBy: '' },
    { id: 6, name: 'Lampe de salon design', price: '300€', reserved: false, reservedBy: '' },
    { id: 7, name: 'Set de verres à vin', price: '80€', reserved: false, reservedBy: '' },
    { id: 8, name: 'Coussin décoratif (lot de 4)', price: '100€', reserved: false, reservedBy: '' },
    { id: 9, name: 'Miroir vintage', price: '220€', reserved: false, reservedBy: '' },
    { id: 10, name: 'Plaid en cachemire', price: '160€', reserved: false, reservedBy: '' }
];

function renderGifts() {
    const giftsContainer = document.getElementById('gifts-container');
    if (!giftsContainer) return;

    giftsContainer.innerHTML = '';
    
    gifts.forEach(gift => {
        const giftCard = document.createElement('div');
        giftCard.className = 'card gift-card';
        giftCard.innerHTML = `
            <div class="gift-info">
                <h3 class="gift-name">${gift.name}</h3>
                <p class="gift-price">${gift.price}</p>
                ${gift.reserved ? `<p class="gift-reserved">Réservé par ${gift.reservedBy}</p>` : ''}
            </div>
            <div class="gift-actions">
                ${!gift.reserved ? 
                    `<button class="btn btn-primary" onclick="reserveGift(${gift.id})">Réserver</button>` :
                    `<button class="btn btn-secondary" disabled>Réservé</button>`
                }
            </div>
        `;
        giftsContainer.appendChild(giftCard);
    });
}

function reserveGift(giftId) {
    const guestName = prompt('Veuillez entrer votre nom pour réserver ce cadeau :');
    if (guestName && guestName.trim()) {
        const gift = gifts.find(g => g.id === giftId);
        if (gift && !gift.reserved) {
            gift.reserved = true;
            gift.reservedBy = guestName.trim();
            renderGifts();
            alert(`Merci ${guestName} ! Le cadeau "${gift.name}" a été réservé avec succès.`);
        }
    }
}

// RSVP functionality
function handleRSVP(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const guestName = formData.get('guestName');
    const dotAttendance = formData.get('dotAttendance');
    const civilAttendance = formData.get('civilAttendance');
    const religiousAttendance = formData.get('religiousAttendance');
    const partyAttendance = formData.get('partyAttendance');
    const allergies = formData.get('allergies');
    
    // Créer le message WhatsApp
    let message = `Bonjour ! Je confirme ma présence au mariage de Sandrine & Théodore :\n\n`;
    message += `Nom : ${guestName}\n\n`;
    message += `Présence confirmée pour :\n`;
    if (dotAttendance === 'oui') message += `✅ Dot (23 octobre à 13h)\n`;
    if (civilAttendance === 'oui') message += `✅ Mariage Civil (25 octobre à 12h)\n`;
    if (religiousAttendance === 'oui') message += `✅ Mariage Religieux (25 octobre à 15h)\n`;
    if (partyAttendance === 'oui') message += `✅ Soirée (25 octobre à 20h)\n`;
    
    if (allergies) {
        message += `\nAllergies/Régimes particuliers : ${allergies}`;
    }
    
    message += `\n\nMerci ! 💕`;
    
    // Encoder le message pour l'URL WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '+237123456789'; // Remplacer par le vrai numéro
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Afficher un message de confirmation
    alert('Merci pour votre confirmation ! Vous allez être redirigé vers WhatsApp pour envoyer votre réponse.');
}

// Galerie photo
function initGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.modal-close');
    
    if (!modal) return;
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = this.src;
            modalCaption.textContent = this.alt;
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialiser les fonctionnalités au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    renderGifts();
    initGallery();
    
    // Ajouter l'event listener pour le formulaire RSVP
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleRSVP);
    }
});

// Effet parallax léger pour le hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

