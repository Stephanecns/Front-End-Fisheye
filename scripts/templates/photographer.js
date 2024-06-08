// Fonction pour créer un modèle de photographe à partir des données
function photographerTemplate(data) {
    // Déstructure les données pour obtenir les propriétés nécessaires
    const { name, portrait, id, tagline, city, country, price } = data;

    // Construit le chemin de l'image du photographe
    const picture = `assets/photographers/${portrait}`;

    // Fonction pour créer l'élément DOM de la carte du photographe
    function getUserCardDOM() {
        const article = document.createElement('article'); // Crée un élément article
        const img = document.createElement('img'); // Crée un élément image
        img.setAttribute("src", picture); // Définit l'attribut src de l'image avec le chemin de l'image
        img.setAttribute("alt", name); // Définit l'attribut alt de l'image avec le nom du photographe
        const h2 = document.createElement('h2'); // Crée un élément h2 pour le nom du photographe
        h2.textContent = name;

        const pTagline = document.createElement('p'); // Crée un élément p pour le slogan du photographe
        pTagline.textContent = tagline;

        const pLocation = document.createElement('p'); // Crée un élément p pour la localisation du photographe
        pLocation.textContent = `${city}, ${country}`;

        const pPrice = document.createElement('p'); // Crée un élément p pour le prix du photographe
        pPrice.textContent = `${price}€/heure`;

        // Ajoute tous les éléments créés à l'article
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(pTagline);
        article.appendChild(pLocation);
        article.appendChild(pPrice);

        return article; // Retourne l'élément article
    }

    // Retourne un objet contenant le nom, l'image et la fonction pour obtenir l'élément DOM de la carte
    return { name, picture, getUserCardDOM };
}
