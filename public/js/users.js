( function () { 
    const password1 = document.getElementById('password1');
    const password2 = document.getElementById('password2');
    const registerButton = document.getElementById('btn-register');

    const registerSuccess = () => {
        const pass1 = password1.value;
        const pass2 = password2.value;

        if(pass1 === pass2){
            registerButton.disabled = false;
            registerButton.title = '';
        } else{
            registerButton.disabled = true;
            registerButton.title= 'Las contraseñas deben coincidir';
        }
    };

    password1.addEventListener('input', registerSuccess);
    password2.addEventListener('input', registerSuccess);

})();