import UserModel from "../models/user.model";
import {getRepository} from "typeorm";
import bcrypt from "bcrypt-nodejs";

class UserService {
    userRepository() {
        return getRepository(UserModel)
    }

    async findAll() {
        return await this.userRepository().find();
    }

    async create(user) {
        user.password = bcrypt.hashSync(user.password);
        return await this.userRepository().save(user);
    }

    async findById(id) {
        const getUser = await this.userRepository().findOne(id);
        if (getUser !== undefined) {
            return getUser
        }
        throw {message: "Sorry, user not found", status: 404};
    }

    async update(user) {
        const getUser = await this.findById(user.id);
        this.userRepository().merge(getUser, user);
        return await this.userRepository().save(getUser);
    }

    async deleteUser(id) {
        const user = await this.findById(id);
        return await this.userRepository().delete(user.id);
    }

    async findByUserName(username) {
        return await this.userRepository().findOne({username: username});
    }

    async validatePassword(password, sourcePassword) {
        return await bcrypt.compareSync(password, sourcePassword);
    }
}

export default UserService;