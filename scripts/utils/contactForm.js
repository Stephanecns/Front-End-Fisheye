let previouslyFocusedElement;

// Fonction pour afficher la modale de contact
function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');

    // Enregistrer l'élément actuellement focalisé pour restaurer le focus plus tard
    previouslyFocusedElement = document.activeElement;

    // Mettre le focus sur le premier champ de la modale
    const firstFocusableElement = modal.querySelector('input, textarea, button');
    firstFocusableElement.focus();

    // Ajouter l'écouteur d'événements pour fermer avec Échap
    document.addEventListener('keydown', handleEscapeKey);
}

// Fonction pour fermer la modale de contact
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');

    // Restaurer le focus à l'élément précédemment focalisé
    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }

    // Supprimer l'écouteur d'événements pour fermer avec Échap
    document.removeEventListener('keydown', handleEscapeKey);
}

// Fonction pour gérer la touche Échap
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

// Ajouter un écouteur d'événement pour gérer l'affichage de la modale au chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    const contactButton = document.querySelector('.contact_button');
    const closeModalIcon = document.querySelector('.modal img[alt="Close icon"]');

    if (contactButton) {
        contactButton.addEventListener('click', function(event) {
            event.preventDefault();
            displayModal();
        });
    }

    if (closeModalIcon) {
        closeModalIcon.addEventListener('click', closeModal);
    }

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // Récupérer les valeurs des champs du formulaire
            const firstName = document.getElementById("firstNameUser").value;
            const lastName = document.getElementById("lastNameUser").value;
            const email = document.getElementById("emailUser").value;
            const message = document.getElementById("message").value;

            // Afficher les valeurs dans la console
            console.log("Prénom:", firstName);
            console.log("Nom:", lastName);
            console.log("E-mail:", email);
            console.log("Message:", message);

            // Réinitialiser le formulaire après la soumission
            contactForm.reset();

            // Fermer la modale après la soumission
            closeModal();
        });
    }
});
