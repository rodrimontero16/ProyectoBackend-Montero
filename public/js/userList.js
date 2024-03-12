(function () {
    const socket = io();

    const usersInactiveDelete = document.getElementById('delete-user-inactive');

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

})();