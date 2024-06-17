import { getPhotographers } from '../templates/photographer.js';

// Fonction pour créer un modèle de photographe à partir des données
function photographerTemplate(data) {
    const { name, portrait, tagline, city, country } = data;
    const picture = `assets/photographers/${portrait}`;

    // Fonction pour générer le DOM du profil du photographe
    function getProfileDOM() {
        const header = document.querySelector('.photograph-header .photographer-info');
        const headerPortrait = document.querySelector('.photograph-header');

        const nameElement = document.createElement('h2');
        nameElement.textContent = name;
        nameElement.classList.add('photographer-name'); // Ajoute une classe CSS

        const locationElement = document.createElement('p');
        locationElement.textContent = `${city}, ${country}`;
        locationElement.classList.add('photographer-location'); // Ajoute une classe CSS

        const taglineElement = document.createElement('p');
        taglineElement.textContent = tagline;
        taglineElement.classList.add('photographer-tagline'); // Ajoute une classe CSS

        const portraitElement = document.createElement('img');
        portraitElement.setAttribute("src", picture);
        portraitElement.setAttribute("alt", "Portrait de " + name); // Texte alternatif descriptif
        portraitElement.classList.add('photographer-portrait'); // Ajoute une classe CSS

        header.appendChild(nameElement);
        header.appendChild(locationElement);
        header.appendChild(taglineElement);
        headerPortrait.appendChild(portraitElement);
    }

    return { getProfileDOM };
}

// Fonction pour afficher les informations du photographe sur la page
async function displayPhotographerData() {
    const data = await getPhotographers(); // Récupère les données des photographes et des médias
    console.log("Données récupérées :", data);

    //vérifie si les données récupérées sont valides et si elles contiennent les propriétés attendues (photographers et media).
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

    //vérifie si les données du photographe spécifique ont été trouvées dans la liste des photographes.
    if (photographerData) {
        console.log("Photographe trouvé :", photographerData);

        const photographer = photographerTemplate(photographerData);
        photographer.getProfileDOM();

        // Mettre à jour l'élément avec le nom du photographe
        document.querySelector('.photographer-name-in-modal').textContent = photographerData.name;

        // Filtrer les médias du photographe
        let photographerMedia = media.filter(m => m.photographerId === photographerId);

        // Trier les médias par défaut (par popularité)
        photographerMedia = sortMedia(photographerMedia, 'popularity');

        // Afficher les médias triés
        displaySortedMedia(photographerMedia, photographerData.name);

        document.getElementById('price-per-day').textContent = `${photographerData.price}€ / jour`;
        updateTotalLikes();

        // Ajoutez l'événement de tri
        document.getElementById('sort-by').addEventListener('change', (event) => {
            const sortBy = event.target.value;
            const sortedMedia = sortMedia(photographerMedia, sortBy);
            displaySortedMedia(sortedMedia, photographerData.name);
        });

    } else {
        console.error("Photographe non trouvé"); // Affiche une erreur si le photographe n'est pas trouvé
    }
}

// Fonction pour créer l'HTML pour chaque média (image ou vidéo)
function mediaFactory(media, photographerName) {
    const basePath = `assets/FishEye_Photos/Sample Photos/${photographerName}/`;
    const mediaType = media.image ? 'image' : 'video';
    const mediaSrc = media.image ? `${basePath}${media.image}` : `${basePath}${media.video}`;

    return `
        <article class="media-item" data-id="${media.id}" tabindex="0" aria-labelledby="media-title-${media.id}" aria-describedby="media-description-${media.id}">
            ${mediaType === 'image' ? `
                <img class="media-image media-click" src="${mediaSrc}" alt="${media.title}">
            ` : `
                <div class="video-container">
                    <video class="media-video media-click">
                        <source src="${mediaSrc}" type="video/mp4">
                        Votre navigateur ne supporte pas la vidéo.
                    </video>
                    <div class="video-overlay" tabindex="-1"></div>
                </div>
            `}
            <div class="media-info">
                <p class="media-title" id="media-title-${media.id}">${media.title}</p>
                <div class="media-likes" id="media-description-${media.id}">
                    <span class="media-likes-count">${media.likes}</span>
                    <em class="fa-solid fa-heart" aria-label="likes" tabindex="0"></em>
                </div>
            </div>
        </article>
    `;
}


// Fonction pour gérer l'incrémentation des likes
function handleLike(event) {
    console.log('handleLike a été appelée'); // Ajoutez ce log
    const likeElement = event.target;
    const likesCountElement = likeElement.previousElementSibling;
    const likesCount = parseInt(likesCountElement.textContent);

    if (!likeElement.classList.contains('liked')) {
        likesCountElement.textContent = likesCount + 1;
        likeElement.classList.add('liked');
        likesCountElement.classList.add('liked');
        updateTotalLikes();
    }
}

// Fonction pour calculer et mettre à jour le nombre total de likes
function updateTotalLikes() {
    const likesElements = document.querySelectorAll('.media-likes-count');
    let totalLikes = 0;

    likesElements.forEach(likeElement => {
        totalLikes += parseInt(likeElement.textContent);
    });

    document.getElementById('total-likes-count').textContent = totalLikes;
}

// Variables pour stocker l'état de la lightbox
let currentMediaIndex = -1; //Initialisée à -1 pour indiquer qu'aucun média n'est actuellement sélectionné
let currentMediaList = []; // Initialisé à un tableau vide pour être rempli plus tard

// Fonction pour ouvrir la lightbox
function openLightbox(index) {
    if (index < 0 || index >= currentMediaList.length) {
        return;
    }
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
document.querySelector('.fa-xmark.iconColor').addEventListener('click', closeLightbox);

// Fonction pour afficher un média spécifique dans la lightbox
function showMedia(index) {
    console.log('Affichage du média à l\'index:', index); // Message de débogage pour vérifier l'index
    const lightboxContent = document.querySelector('.lightbox__content');
    const lightboxCaption = document.querySelector('.lightbox__caption');

    // Vérifiez que l'index est valide
    if (index < 0 || index >= currentMediaList.length) {
        console.error('Index hors limites');
        return;
    }

    const media = currentMediaList[index];

    //vérifie le type de média (image ou vidéo) pour déterminer quel type d'élément HTML doit être créé et affiché dans la lightbox.
    if (media.type === 'image') {
        lightboxContent.innerHTML = `<img src="${media.src}" alt="${media.title}">`;
    } else if (media.type === 'video') {
        lightboxContent.innerHTML = `<video controls>
                                        <source src="${media.src}" type="video/mp4">
                                        Votre navigateur ne supporte pas la vidéo.
                                     </video>`;
    } else {
        console.error('Type de média inconnu');
        return;
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
document.querySelector('.lightbox__prev').addEventListener('click', prevMedia);

// Fonction pour afficher le média suivant
function nextMedia() {
    if (currentMediaIndex < currentMediaList.length - 1) {
        showMedia(currentMediaIndex + 1);
    }
}
document.querySelector('.lightbox__next').addEventListener('click', nextMedia);

// Ajout des événements de navigation clavier
document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('lightbox-container');
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

// Fonction pour initialiser la liste des médias pour la lightbox
function initLightboxMedia() {
    const mediaElements = document.querySelectorAll('.media-item');
    currentMediaList = []; // Réinitialiser le tableau

    mediaElements.forEach((mediaElement, index) => {
        const img = mediaElement.querySelector('img');
        const video = mediaElement.querySelector('video');
        const title = mediaElement.querySelector('.media-title').textContent;

        // Vérifie si l'élément est une image
        if (img) {
            currentMediaList.push({
                src: img.src,
                title: title,
                type: 'image'
            });

            img.addEventListener('click', (event) => {
                if (!event.target.closest('.media-likes')) {
                    openLightbox(index);
                }
            });

            // Ajout de la navigation clavier pour les images
            mediaElement.addEventListener('keydown', (event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.media-likes')) {
                    openLightbox(index);
                }
            });
        } else if (video) {
            const src = video.querySelector('source').src;
            currentMediaList.push({
                src: src,
                title: title,
                type: 'video'
            });

            // Ajouter un écouteur d'événement sur l'overlay pour ouvrir la lightbox
            const videoOverlay = mediaElement.querySelector('.video-overlay');
            videoOverlay.addEventListener('click', (event) => {
                if (!event.target.closest('.media-likes')) {
                    openLightbox(index);
                }
            });

            // Ajout de la navigation clavier pour les vidéos
            mediaElement.addEventListener('keydown', (event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.media-likes')) {
                    openLightbox(index);
                }
            });
        }
    });

    console.log('Médias initiaux pour la lightbox:', currentMediaList); // Vérifiez que la liste est correctement remplie
}


// Fonction de tri des médias
function sortMedia(media, sortBy) {
    switch (sortBy) {
        case 'popularity':
            return media.sort((a, b) => b.likes - a.likes);
        case 'date':
            return media.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'title':
            return media.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return media;
    }
}

// Fonction pour afficher les médias triés
function displaySortedMedia(media, photographerName) {
    const mediaGallery = document.querySelector('.media-gallery');
    mediaGallery.innerHTML = '';

    media.forEach((m) => {
        const mediaElement = mediaFactory(m, photographerName);
        mediaGallery.innerHTML += mediaElement;
        currentMediaList.push(m); // Ajouter les médias à currentMediaList
    });

    // Ajouter les écouteurs d'événements aux éléments médias
    const mediaElements = document.querySelectorAll('.media-click');
    mediaElements.forEach((element, index) => {
        element.addEventListener('click', (event) => {
            if (!event.target.closest('.media-likes')) {
                openLightbox(index);
            }
        });
    });

    // Ajouter les écouteurs d'événements pour les likes
    const likeButtons = document.querySelectorAll('.fa-heart');
    likeButtons.forEach((button) => {
        button.addEventListener('click', handleLike);

        // Ajout de la navigation clavier pour les likes
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                handleLike(event);
            }
        });
    });

    initLightboxMedia();
    console.log('Médias affichés et lightbox initialisée'); // Message de débogage
}

// Appeler initLightboxMedia après que tous les médias soient rendus
document.addEventListener('DOMContentLoaded', function () {
    displayPhotographerData().then(() => {
        initLightboxMedia();
    });
});
