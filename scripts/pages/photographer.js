// Fonction pour récupérer les données des photographes depuis un fichier JSON
async function getPhotographers() {
    try {
        // Utilise fetch pour récupérer les données des photographes depuis le fichier JSON
        const response = await fetch('data/photographers.json');
        const data = await response.json(); // Convertit la réponse en JSON
        return data.photographers; // Retourne les données des photographes
    } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error); // Affiche une erreur en cas d'échec
    }
}

// Fonction pour afficher les informations du photographe sur la page
async function displayPhotographerData() {
    const photographers = await getPhotographers(); // Récupère les données des photographes
    const urlParams = new URLSearchParams(window.location.search); // Récupère les paramètres de l'URL
    const photographerId = parseInt(urlParams.get('id')); // Récupère l'ID du photographe à partir de l'URL

    // Trouve le photographe correspondant à l'ID
    const photographer = photographers.find(p => p.id === photographerId);
    if (photographer) {
        console.log(photographer); // Affiche les données du photographe dans la console
        // Remarque : Nous allons ici seulement faire un console.log pour cette étape.
        // Dans les étapes suivantes, nous ajouterons le code pour afficher les données sur la page.
    } else {
        console.error("Photographe non trouvé"); // Affiche une erreur si le photographe n'est pas trouvé
    }
}

// Initialiser les données du photographe sur la page
displayPhotographerData();