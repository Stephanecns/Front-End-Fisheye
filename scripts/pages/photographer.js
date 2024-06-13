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
// Fonction pour créer et insérer dynamiquement des éléments HTML dans la section d'en-tête d'une page de profil de photographe
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

// Variables pour stocker l'état de la lightbox
let currentMediaIndex = -1;
let currentMediaList = [];

// Fonction pour ouvrir la lightbox
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox-container');
    lightbox.style.display = 'block';
    lightbox.setAttribute('aria-hidden', 'false');
    showMedia(index);
}

// Fonction pour fermer la lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox-container');
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
}

// Fonction pour afficher un média spécifique dans la lightbox
function showMedia(index) {
    const lightboxContent = document.querySelector('.lightbox__content');
    const lightboxCaption = document.querySelector('.lightbox__caption');
    const media = currentMediaList[index];

    // Assurez-vous d'utiliser les bonnes propriétés des objets médias
    if (media.type === 'image') {
        lightboxContent.innerHTML = `<img src="${media.src}" alt="${media.title}">`;
    } else if (media.type === 'video') {
        lightboxContent.innerHTML = `<video controls>
                                        <source src="${media.src}" type="video/mp4">
                                        Votre navigateur ne supporte pas la vidéo.
                                     </video>`;
    }

    lightboxCaption.textContent = media.title;
    currentMediaIndex = index;
}

// Fonction pour afficher le média précédent
function prevMedia() {
    if (currentMediaIndex > 0) {
        showMedia(currentMediaIndex - 1);
    }
}

// Fonction pour afficher le média suivant
function nextMedia() {
    if (currentMediaIndex < currentMediaList.length - 1) {
        showMedia(currentMediaIndex + 1);
    }
}

// Ajout des événements de navigation clavier
document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
        if (event.key === 'ArrowLeft') {
            prevMedia();
        } else if (event.key === 'ArrowRight') {
            nextMedia();
        } else if (event.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Fonction pour initialiser les médias pour la lightbox
function initLightboxMedia() {
    const mediaElements = document.querySelectorAll('.media-item');
    currentMediaList = [];

    mediaElements.forEach((mediaElement, index) => {
        const img = mediaElement.querySelector('img');
        const video = mediaElement.querySelector('video');
        const title = mediaElement.querySelector('.media-title').textContent;

        if (img) {
            currentMediaList.push({
                src: img.src,
                title: title,
                type: 'image'
            });

            img.addEventListener('click', () => openLightbox(index));
        } else if (video) {
            const src = video.querySelector('source').src;
            currentMediaList.push({
                src: src,
                title: title,
                type: 'video'
            });

            video.addEventListener('click', () => openLightbox(index));
        }
    });
}

// Appeler initLightboxMedia après que tous les médias soient rendus
document.addEventListener('DOMContentLoaded', function () {
    displayPhotographerData().then(() => {
        initLightboxMedia();
    });
});
