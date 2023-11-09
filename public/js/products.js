(function () {
    const socket = io();
    
    //Elementos del DOM
    const sortPriceViews = document.getElementById('btn-price-views');
    const productsViews = document.getElementById('prod-container');
    const categoryFilter = document.getElementById('category-filter-views');


    //Manejo del sort para el price
    let sortDirection = 1;
    const toggleSortDirection = () => {
        sortDirection = -sortDirection;
        socket.emit('toggle-sort', sortDirection);
    };
    sortPriceViews.addEventListener('click', toggleSortDirection);

    //Cambio de categoria    
    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        currentCategory = selectedCategory;
        socket.emit('filter-by-category', selectedCategory);
    });
    
    //Actualizo la vista de products
    const updateProductViews = (products) => {
        productsViews.innerHTML = '';
        products.forEach((product) =>{
            const div = document.createElement('div');
            div.classList.add('card');
            div.setAttribute('data-product-id', product._id);
            div.innerHTML = `
                <img src="/img/x.png" alt="img-prod">
                <h4 class="title-prod">${product.title}</h4>
                <p class="price-prod">${product.price}</p>
                <button class="add-to-cart">Añadir</button>
            `
            productsViews.appendChild(div);
        });
    };

    //Recibo del back
    socket.on('update-products', (products) => {
        updateProductViews(products);
    });
})();


