export const generatorRegisterError = (user) => {
    return `El correo ${user.email} ya existe`;
};

export const generatorLoginError = () => {
    return 'Usuario o contraseña incorrecto';
};

export const generatorRecoveryError = (user) => {
    return `El email ${user.email} no se encuentra en la base de datos`;
};