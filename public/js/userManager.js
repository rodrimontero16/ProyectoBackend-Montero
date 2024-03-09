(function () {
    const socket = io();

    const userRoleSelect = document.getElementById('user-role-filter');
    const userRoleChange = document.getElementsByClassName('btn-confirmar');

    for (let button of userRoleChange) {
        button.addEventListener('click', (event) => {
            const selectedRole = userRoleSelect.value;
            const userID = button.getAttribute('data-user-id');            
            if (selectedRole !== 'Selecciona una opcion') {
                socket.emit('user-role-change', { userID, selectedRole });
            }
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