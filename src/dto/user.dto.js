export default class UserDTO{
    constructor(user){
        if(user){
            this.fullName = `${user.first_name} ${user.last_name}`;
            this.email = user.email;
            this.id = user.id || user._id;
            this.password = user.password;
            this.role = user.role;
            this.documents = user.documents;
            this.last_connection = user.last_connection;
        } else {
            console.log('User is null')
        }
    }
}; 