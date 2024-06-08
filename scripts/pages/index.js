// Déclare une fonction asynchrone appelée getPhotographers
async function getPhotographers() {
    try {
         // Utilise fetch pour envoyer une requête au fichier 'photographers.json' et attend la réponse
        const response = await fetch('data/photographers.json');

         // Convertit la réponse en format JSON et attend que cette opération se termine
         //await indique que la fonction doit attendre que la requête soit complétée avant de continuer.
        const data = await response.json();

         // Affiche les données des photographes dans la console
        console.log(data.photographers);

        // Retourne les données récupérées
        return data;
    } catch (error) {
        // Si une erreur survient, affiche un message d'erreur dans la console
        console.error("Erreur lors de la récupération des données : ", error);
    }
}
//Cette fonction prend un tableau de photographes en entrée et affiche leurs informations sur la page web.
    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    
