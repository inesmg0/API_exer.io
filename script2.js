document.addEventListener('DOMContentLoaded', function () {
    const resultsContainer = document.getElementById('results');

    // Função para fazer a solicitação à API
    function fetchArtApiData(nome, department, page = 1, pageSize = 28) {
        // URL base da API
        const apiUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';

        // Parâmetros da pesquisa e paginação
        const params = new URLSearchParams({
            q: nome,
            department: department,
            page: page,
            pageSize: pageSize
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
                    // Chame a função para exibir os resultados
                    const objectIDs = data.objectIDs.slice(0, 400);
                    fetchObjectsDetails(data.objectIDs);
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
            })
            .catch(error => {
                console.error('Erro ao processar detalhes dos objetos:', error);
            });
    }

    // Função para exibir os resultados na grelha
    function displayResults(results) {
            const validResults = results.filter(result => result.title && result.primaryImage && result.departmentID === 2);

            validResults.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('grid-item');

                // Adapta esta lógica para a estrutura real dos dados da API
                const title = result.title || 'Sem título';
                const img = result.primaryImage;
                const id = result.objectID;
                const pais = result.country;
                const departamento = result.department;
                const data = result.objectBeginDate;

                // Cria o conteúdo do item de resultado
                const itemContent = `
                    <img src="${img}" alt="${title}">
                    <p>${title} , ${data}</p>
                    <p>${id}</p>
                    <p>${pais}</p>
                    <p>${departamento}</p>
                `;

                resultItem.innerHTML = itemContent;
                resultsContainer.appendChild(resultItem);
            });
    }

    // Chamada inicial para buscar os resultados
    fetchArtApiData('nome', 'department');
});
