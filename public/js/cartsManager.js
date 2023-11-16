(function () {
    const socket = io();

    const deleteCarts = document.getElementsByClassName('delete-cart');
    const tableCarts = document.getElementById('tableCarts');
    const newCart = document.getElementById('new-cart');


    //Envio la info desde el front al backend
    tableCarts.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-cart');
        
        if (deleteButton) {
            event.preventDefault();
            const cartId = deleteButton.id;
            socket.emit('delete-cart', cartId);
        }
    });

    newCart.addEventListener('click', (event) =>{
        event.preventDefault();
        socket.emit('new-cart');
    });

    //Actualizo la tabla de carritos
    const updateCartTable =  (carts) => {
    tableCarts.innerHTML = '';
    carts.forEach((cart) => {
        const row = document.createElement('tr');
        row.setAttribute('data-cart-id', cart.cartID);
        row.innerHTML = `
            <th scope="row">${cart.cartID}</th>
            <td>${cart.cartLength}</td>
            <td class="btn-config">
                <button class="delete-cart btn-carts" id="${cart.cartID}">❌</button>
                <a href="/api/carts/${cart.cartID}">
                    <button class="edit-cart btn-carts" id="${cart.cartID}">🖋️</button>
                </a>
            </td>
        `;
        tableCarts.appendChild(row);
    });       
    };
    
    socket.on('cart-delete', (carts) =>{  
        updateCartTable(carts);     
        Swal.fire({
            icon: 'success',
            title: 'Carrito eliminado correctamente ❌',
        });
    });

    socket.on('cart-update', (carts) =>{
        updateCartTable(carts);     
        Swal.fire({
            icon: 'success',
            title: 'Carrito creado correctamente ✔️',
        });
    })
})();