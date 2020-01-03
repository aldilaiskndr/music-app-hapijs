import {UserService} from "../services";

const userService = new UserService();

export async function validate(req, username, password){
    console.log(username);
    const user = await userService.findByUserName(username);
    console.log(user,"ANU");
    if (!user) {
        return {credentials: null, valid: false};
    }

    const valid = await userService.validatePassword(password, user.password);
    return {valid:valid, credentials:{...user, password:password}};
}