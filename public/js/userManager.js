(function () {
    const socket = io();

    const userRoleSelect = document.getElementById('user-role-filter');
    const userRoleChange = document.getElementsByClassName('btn-user-edit');
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

    socket.on('user-delete-confirm', () =>{
        Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado correcamente ❌',
        }).then(() =>{
            window.location.href = '/api/users';
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