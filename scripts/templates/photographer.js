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

    return { name, picture, getUserCardDOM };
}
