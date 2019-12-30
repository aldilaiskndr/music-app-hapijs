import {UserService} from "../services";

const userService = new UserService();
export const validate = async (req, username, password) => {

    const user = await userService.findByUserName(username);
    console.log(user);
    if (!user) {
        return {credentials: null, isValid: false};
    }

    const isValid = await userService.validatePassword(password, user.password);
    const credentials = {id: user.id, name: user.username};
    const buff = await Buffer.from(req.headers.authorization[1]);
    console.log(await buff.toString(), 'ini');
    console.log(isValid, credentials);
    return {isValid, credentials};
};