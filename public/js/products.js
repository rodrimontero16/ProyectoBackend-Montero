(function () {
    const socket = io();
    
    //Elementos del DOM
    const sortPriceViews = document.getElementById('btn-price-views');
    const productsViews = document.getElementById('prod-container');
    const categoryFilter = document.getElementById('category-filter-views');
    const addToCartButtons = document.getElementsByClassName('add-to-cart');

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
    
    Array.from(addToCartButtons).forEach((button) =>{
        button.addEventListener('click', () =>{
            const prodId = button.getAttribute('data-product-id');
            socket.emit('add-to-cart', prodId);
            console.log('Producto agregado correctamente');
        });
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
                <button class="add-to-cart" data-product-id="${product._id}>Añadir</button>
            `
            productsViews.appendChild(div);
        });
    };

    //Recibo del back
    socket.on('update-products', (products) => {
        updateProductViews(products);
    });
    socket.on('added-to-cart', (prodId) =>{
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado con éxito 🙌',
        });
    })
})();


