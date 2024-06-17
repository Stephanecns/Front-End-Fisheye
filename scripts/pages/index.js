// Importer les fonctions nécessaires depuis le fichier photographer.js
import { getPhotographers, photographerTemplate } from '../templates/photographer.js';


// Cette fonction prend un tableau de photographes en entrée et affiche leurs informations sur la page web.
async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    // Pour chaque photographe dans le tableau
    photographers.forEach((photographer) => {
        // Créer un modèle de photographe en utilisant la fonction photographerTemplate
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

// Fonction d'initialisation pour récupérer les données des photographes et les afficher
async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();
