let previouslyFocusedElement;

// Fonction pour afficher la modale de contact
function displayModal() {
    const modal = document.getElementById("contact_modal"); // Récupérer l'élément de la modale
    modal.style.display = "block"; // Afficher la modale
    modal.setAttribute('aria-hidden', 'false'); // Indiquer que la modale est visible pour les technologies d'assistance

    // Enregistrer l'élément actuellement focalisé pour restaurer le focus plus tard
    previouslyFocusedElement = document.activeElement;

    // Mettre le focus sur le premier champ de la modale
    const firstFocusableElement = modal.querySelector('input, textarea, button'); // Trouver le premier champ focusable
    firstFocusableElement.focus(); // Mettre le focus sur ce champ
}

// Fonction pour fermer la modale de contact
function closeModal() {
    const modal = document.getElementById("contact_modal"); // Récupérer l'élément de la modale
    modal.style.display = "none"; // Masquer la modale
    modal.setAttribute('aria-hidden', 'true'); // Indiquer que la modale est cachée pour les technologies d'assistance

    // Restaurer le focus à l'élément précédemment focalisé
    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus(); // Restaurer le focus sur l'élément précédent
    }
}

// Ajouter un écouteur d'événement pour gérer la soumission du formulaire après le chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById("contactForm"); // Récupérer l'élément du formulaire de contact

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêcher le rechargement de la page lors de la soumission du formulaire

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
});


// Rendre les fonctions globales
window.displayModal = displayModal;
window.closeModal = closeModal;