export default class UserDTO{
    constructor(user){
        this.fullName = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.id = user.id || user._id;
        this.password = user.password;
        this.role = user.role;
    }
}; 