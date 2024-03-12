(function () {
    const socket = io();

    const userRoleSelect = document.getElementById('user-role-filter');
    const userRoleChange = document.getElementsByClassName('userEdit');
    const userDelete = document.getElementsByClassName('btn-user-delete');

    for (let button of userRoleChange) {
        button.addEventListener('click', (event) => {
            const selectedRole = userRoleSelect.value;
            const userID = button.getAttribute('data-user-id');            
            if (selectedRole !== 'Selecciona una opcion') {
                socket.emit('user-role-change', { userID, selectedRole });
            }
        });
    }

    for (let button of userDelete) {
        button.addEventListener('click', (event) => {
            const userID = button.getAttribute('data-user-id');            
            socket.emit('user-delete', userID);
        });
    }

    socket.on('user-update', (user) =>{
        Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado correcamente ✔️',
        }).then(() => {
            location.reload();
        });
    })
})();