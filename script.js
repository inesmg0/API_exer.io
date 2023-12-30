document.addEventListener('DOMContentLoaded', function () {
    const resultsContainer = document.getElementById('results');
    const Pesquisa = document.getElementById('Pesquisa');
    const filtrarCat = document.getElementById('filtrarCat');

    // Função para fazer a solicitação à API
    function fetchArtApiData() {
        // Obtém o valor do campo de entrada com id 'Pesquisa'
        const searchInput = Pesquisa.value;
        // Obtém o valor da categoria selecionada
        const category = filtrarCat.value;

        // URL base da API
        const apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

        // Parâmetros da pesquisa
        const params = new URLSearchParams({
            q: searchInput,
            category: category,
        });

        // Construa a URL final
        const url = `${apiUrl}?${params.toString}`;

        console.log('URL da API:', url);

        // Use fetch para obter os dados da API
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Dados da API:', data);

                // Verificar se data.objectIDs está definido e não é nulo
                if (data.objectIDs && Array.isArray(data.objectIDs)) {
                    // Limitar a 100 resultados
                    const objectIDs = data.objectIDs.slice(0, 150);
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
            const pais = result.country;

            // Cria o conteúdo do item de resultado
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
        // Limpa os resultados anteriores
        resultsContainer.innerHTML = '';

        // Realiza a pesquisa com o novo termo
        fetchArtApiData();
    });

    // Adiciona um evento de escuta ao campo de seleção 'filtrarCat' para acionar a pesquisa quando a categoria mudar
    filtrarCat.addEventListener('change', function () {
        // Limpa os resultados anteriores
        resultsContainer.innerHTML = '';

        // Realiza a pesquisa com a nova categoria
        fetchArtApiData();
    });

    // Chamada inicial para buscar os resultados
    fetchArtApiData();
});
