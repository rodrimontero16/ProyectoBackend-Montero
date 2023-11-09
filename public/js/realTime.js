(function () {
    const socket = io();

    
    //Elementos del DOM realTime
    const formAddProduct = document.getElementById('addProductForm');
    const infoProduct = document.getElementsByClassName('prod-info');
    const tableProducts = document.getElementById('tableRealTime');
    const formDelete = document.getElementById('formDelete');
    const deleteProd = document.getElementById('deleteProd');
    const sortPrice = document.getElementById('btn-price');
    const categoryFilter = document.getElementById('category-filter');

    //Manejo del sort 
    let sortDirection = 1;
    const toggleSortDirection = () => {
        sortDirection = -sortDirection;
        socket.emit('toggle-sort', sortDirection);
    };
    sortPrice.addEventListener('click', toggleSortDirection);
    

    //Cambio de categoria
    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        socket.emit('filter-by-category', selectedCategory);
    });

    //Actualizo la tabla de productos
    const updateProductTable =  (products) => {
        tableProducts.innerHTML = '';
        products.forEach((product) => {
            const row = document.createElement('tr');
            row.setAttribute('data-product-id', product._id);
            row.innerHTML = `
                <th scope="row">${product._id}</th>
                <td>${product.title}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>${product.code}</td>
            `;
            tableProducts.appendChild(row);
        });       
    };


    //Envio la info desde el front al backend
    formAddProduct.addEventListener('submit', (event) =>{
        event.preventDefault();
        const product = {
            title: infoProduct[0].value,
            description: infoProduct[1].value,
            code: infoProduct[2].value,
            price: parseFloat(infoProduct[3].value),
            stock: parseInt(infoProduct[4].value)
        };
        socket.emit('new-product', product);
        for (const input of infoProduct) {
            input.value = '';
        };
        
    });

    formDelete.addEventListener('submit', (event) =>{
        event.preventDefault();
        const prodId = deleteProd.value;
        socket.emit('delete-prod', (prodId));
        deleteProd.value = '';
    })

    //Recibo desde el back
    socket.on('prod-existente', () => {
        Swal.fire({
            icon: 'error',
            title: 'El producto ya existe!',
        });
    })
    socket.on('add-prod', (products) => {
        updateProductTable(products);
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado con éxito 🙌',
        });
    });
    socket.on('prod-no-encontrado', () =>{
        Swal.fire({
            icon: 'error',
            title: 'ID incorrecto',
        });
    });
    socket.on('prod-delete', (products) =>{   
        updateProductTable(products);     
        Swal.fire({
            icon: 'success',
            title: 'Producto eliminado correctamente ❌',
        });
    });
    socket.on('update-products', (products) => {
        updateProductTable(products);
    });
    
})();