document.addEventListener('DOMContentLoaded', function () {
    const resultsContainer = document.getElementById('results');
    const Pesquisa = document.getElementById('Pesquisa');
    const filtrarCat = document.getElementById('filtrarCat');

    // Função para fazer a solicitação à API
    function fetchArtApiData(searchByCategory = false) {
        const searchInput = Pesquisa.value;
        const category = filtrarCat.value;

        // URL base da API
        const apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

        // Parâmetros da pesquisa
        const params = new URLSearchParams({
            q: searchInput,
            category: category,
        });

        //string final
        const url = `${apiUrl}?${params.toString}`;

        console.log('URL da API:', url);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Dados da API:', data);

                // Verificar se data.objectIDs está definido e não é nulo
                if (data.objectIDs && Array.isArray(data.objectIDs)) {
                    // Limitar a 100 resultados
                    const objectIDs = data.objectIDs.slice(0, 150);
                    // Exibir resultados
                    fetchObjectsDetails(objectIDs);
                } else {
                    console.error('Não há IDs de objeto suficientes na resposta da API.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
            });
    }

    // Função para buscar detalhes
    function fetchObjectsDetails(objectIDs) {
        const promises = objectIDs.map(objectID => {
            const apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
            return fetch(apiUrl)
                .then(response => response.json())
                .catch(error => {
                    console.error('Erro ao buscar detalhes do objeto:', error);
                });
        });

        Promise.all(promises)
            .then(objectsData => {
                displayResults(objectsData);
            });
    }

    // Função para exibir os resultados na grelha
    function displayResults(results) {
        const validResults = results.filter(result => result.title && result.primaryImage);

        validResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('grid-item');

            const title = result.title || 'Sem título';
            const img = result.primaryImage;
            const pais = result.country;


            const itemContent = `
                <img src="${img}" alt="${title}">
                <h3>${title}</h3>
                <p>${pais}</p>
            `;

            resultItem.innerHTML = itemContent;
            resultsContainer.appendChild(resultItem);
        });
    }

    Pesquisa.addEventListener('input', function () {
        resultsContainer.innerHTML = '';
        fetchArtApiData();
    });

    filtrarCat.addEventListener('change', function () {
        resultsContainer.innerHTML = '';
        fetchArtApiData(true); // Passa true para indicar pesquisa por categoria
    });

    fetchArtApiData();
});
