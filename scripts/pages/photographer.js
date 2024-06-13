// Fonction pour créer un modèle de photographe à partir des données
function photographerTemplate(data) {
    const { name, portrait, id, tagline, city, country, price } = data;
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        article.classList.add('photographer-card'); // Ajoute une classe CSS

        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.setAttribute('aria-label', `Voir le profil de ${name}`);
        link.setAttribute('tabindex', '0'); // Rendre le lien focusable
        link.classList.add('photographer-link'); // Ajoute une classe CSS

        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", ""); // Texte alternatif vide pour l'accessibilité
        img.classList.add('photographer-portrait'); // Ajoute une classe CSS

        const h2 = document.createElement('h2');
        h2.textContent = name;
        h2.classList.add('photographer-name'); // Ajoute une classe CSS

        const pTagline = document.createElement('p');
        pTagline.textContent = tagline;
        pTagline.classList.add('photographer-tagline'); // Ajoute une classe CSS

        const pLocation = document.createElement('p');
        pLocation.textContent = `${city}, ${country}`;
        pLocation.classList.add('photographer-location'); // Ajoute une classe CSS

        const pPrice = document.createElement('p');
        pPrice.textContent = `${price}€/heure`;
        pPrice.classList.add('photographer-price'); // Ajoute une classe CSS

        link.appendChild(img);
        link.appendChild(h2);

        article.appendChild(link);
        article.appendChild(pLocation);
        article.appendChild(pTagline);
        article.appendChild(pPrice);

        return article;
    }

    function getProfileDOM() {
        const header = document.querySelector('.photograph-header .photographer-info');

        const nameElement = document.createElement('h2');
        nameElement.textContent = name;
        nameElement.classList.add('photographer-name'); // Ajoute une classe CSS

        const locationElement = document.createElement('p');
        locationElement.textContent = `${city}, ${country}`;
        locationElement.classList.add('photographer-location'); // Ajoute une classe CSS

        const taglineElement = document.createElement('p');
        taglineElement.textContent = tagline;
        taglineElement.classList.add('photographer-tagline'); // Ajoute une classe CSS

        const portraitElement = document.querySelector('.photographer-portrait');
        portraitElement.setAttribute("src", picture);
        portraitElement.setAttribute("alt", `Portrait de ${name}`);
        portraitElement.classList.add('photographer-portrait'); // Ajoute une classe CSS

        const priceElement = document.createElement('p');
        priceElement.textContent = `${price}€/jour`;
        priceElement.classList.add('photographer-price'); // Ajoute une classe CSS

        header.appendChild(nameElement);
        header.appendChild(locationElement);
        header.appendChild(taglineElement);
        header.appendChild(priceElement);
    }

    return { name, picture, getUserCardDOM, getProfileDOM };
}

// Fonction pour récupérer les données des photographes depuis un fichier JSON
async function getPhotographers() {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Données récupérées dans getPhotographers :", data);
        return data; // Assurez-vous que l'objet renvoyé contient photographers et media
    } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
    }
}

// Les médias filtrés sont affichés sur la page en utilisant mediaFactory
function mediaFactory(media, photographerName) {
    const basePath = `assets/FishEye_Photos/Sample Photos/${photographerName}/`;

    if (media.image) {
        return `
            <div class="media-item">
                <img  class="media-image" src="${basePath}${media.image}" alt="${media.title}">
                <p class="media-title">${media.title}</p>
            </div>
        `;
    } else if (media.video) {
        return `
            <div class="media-item">
                <video  class="media-video" controls>
                    <source src="${basePath}${media.video}" type="video/mp4">
                    Votre navigateur ne supporte pas la vidéo.
                </video>
                <p  class="media-title">${media.title}</p>
            </div>
        `;
    }
    return '';
}

// Fonction pour afficher les informations du photographe sur la page
async function displayPhotographerData() {
    const data = await getPhotographers(); // Récupère les données des photographes et des médias
    console.log("Données récupérées :", data);

    if (!data || !data.photographers || !data.media) {
        console.error("Aucune donnée récupérée ou format incorrect");
        return;
    }

    const photographers = data.photographers;
    const media = data.media;

    console.log("Photographers:", photographers);
    console.log("Media:", media);

    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = parseInt(urlParams.get("id"));
    console.log("ID du photographe extrait de l'URL :", photographerId);

    const photographerData = photographers.find(p => p.id === photographerId);

    if (photographerData) {
        console.log("Photographe trouvé :", photographerData);

        const photographer = photographerTemplate(photographerData);
        photographer.getProfileDOM();

         // Mettre à jour l'élément avec le nom du photographe
         document.querySelector('.photographer-name-in-modal').textContent = photographerData.name;

        // Filtrer les médias du photographe
        const photographerMedia = media.filter(m => m.photographerId === photographerId);

        // Loguer les médias filtrés pour débogage
        console.log(`Médias pour le photographe ${photographerData.name} (ID: ${photographerId}):`, photographerMedia);

        // Afficher les réalisations du photographe
        const mediaGallery = document.querySelector('.media-gallery');
        if (mediaGallery) {
            mediaGallery.innerHTML = ''; // Clear existing content if any
            photographerMedia.forEach(media => {
                // Loguer chaque média traité pour débogage
                console.log(`Ajout du média :`, media);

                const mediaElement = mediaFactory(media, photographerData.name);
                mediaGallery.innerHTML += mediaElement;
            });
        } else {
            console.error("L'élément media-gallery est introuvable");
        }
    } else {
        console.error("Photographe non trouvé"); // Affiche une erreur si le photographe n'est pas trouvé
    }
}

// Initialiser les données du photographe sur la page
document.addEventListener('DOMContentLoaded', () => {
    displayPhotographerData();
});
