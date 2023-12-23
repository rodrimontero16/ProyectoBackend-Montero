(function() {
    const requestOptions = {
        method: 'GET',
};

fetch("http://localhost:8080/api/products/", requestOptions)
    .then(response => response.json())
    .then(result => {
        const listado = document
                            .getElementById('products-list')
                            .innerHTML = '';
        result.map((product) => {
            const li = document.createElement('li');
            li.innerHTML = `
                
            `;
        })
    })
    .catch(error => console.log('error', error));

})();