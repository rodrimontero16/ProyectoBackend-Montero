(function () {
    const socket = io();

    const userRoleSelect = document.getElementById('user-role-filter');
    const userRoleChange = document.getElementsByClassName('btn-user-edit');
    const userDelete = document.getElementsByClassName('btn-user-delete');
    const usersInactiveDelete = document.getElementById('delete-user-inactive')

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

    usersInactiveDelete.addEventListener('click', () => {
        socket.emit('delete-users-inactive');
    })

    socket.on('no-user-delete', () =>{
        Swal.fire({
            icon: 'success',
            title: 'No hay usuarios inactivos ⏳',
        }).then(() =>{
            location.reload();
        })
    })

    socket.on('user-delete-confirm', () =>{
        Swal.fire({
            icon: 'success',
            title: 'Usuarios eliminados correcamente ❌',
        }).then(() =>{
            location.reload();
        })
    })

    socket.on('user-update', (user) =>{
        Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado correcamente ✔️',
        }).then(() => {
            location.reload();
        });
    })
})();