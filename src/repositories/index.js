import  UserRepository  from "./user.repository.js"
import { UserDao } from "../dao/factory.js";


export const userRepository = new UserRepository(new UserDao());

