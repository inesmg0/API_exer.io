document.addEventListener('DOMContentLoaded', function () {
    const resultsContainer = document.getElementById('results');
    const Pesquisa = document.getElementById('Pesquisa');
    const filtrarCat = document.getElementById('filtrarCat');
    const ordem = document.getElementById('ordem');

    // Função para fazer a solicitação à API
    function fetchArtApiData(nome, department) {
        // URL base da API
        const apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

        // Parâmetros da pesquisa
        const params = new URLSearchParams({
            q: nome,
            department: department,
        });

        // Construa a URL final
        const url = `${apiUrl}?${params.toString()}`;

        console.log('URL da API:', url);

        // Use fetch para obter os dados da API
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Dados da API:', data);

                // Verificar se data.objectIDs está definido e não é nulo
                if (data.objectIDs && Array.isArray(data.objectIDs)) {
                    // Limitar a 100 resultados
                    const objectIDs = data.objectIDs.slice(0, 400);
                    const filteredObjectIDs = data.objectIDs.filter(objectID => {
                    });
                    // Chame a função para exibir os resultados
                    fetchObjectsDetails(objectIDs);
                } else {
                    console.error('Não há IDs de objeto suficientes na resposta da API.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
            });
    }

    // Função para buscar detalhes dos objetos usando IDs
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
                // Chame a função para exibir os resultados
                displayResults(objectsData);
            });
    }

    // Função para exibir os resultados na grelha
    function displayResults(results) {
        const validResults = results.filter(result => result.title && result.primaryImage);

        validResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('grid-item');

            // Adapta esta lógica para a estrutura real dos dados da API
            const title = result.title || 'Sem título';
            const img = result.primaryImage;
            const id =result.objectID;
            const pais = result.country;

            // Cria o conteúdo do item de resultado
            const itemContent = `
                <img src="${img}" alt="${title}">
                <p>${title}</p>
                <p>${id}</p>
                <p>${pais}</p>
            `;

            resultItem.innerHTML = itemContent;
            resultsContainer.appendChild(resultItem);
        });
    }

    // Chamada inicial para buscar os resultados
    fetchArtApiData('nome', 'department');
});