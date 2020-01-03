import {UserService} from '../services';
import {GET} from "../constant/method.constant";
import {validate} from "../auth/user.validate";


let userService = new UserService();

const login = [
    {
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {

            const {username, password} = request.payload;
            const {valid, credentials} = await validate(request, username, password);
            if (!valid) {
                return h.response({message:'invalid username or password'}).code(401);
            }
            request.cookieAuth.set(credentials);
            return h.response({message:'login success'}).code(200);
        },
        options: {
            auth: {
                mode: 'try'
            }
        }
    },
    {
        method: 'GET',
        path: '/login',
        handler: function (request, h) {

            return h.response(` <html>
                            <head>
                                <title>Login page</title>
                            </head>
                            <body>
                                <h3>Please Log In</h3>
                                <form method="post" action="/login">
                                    Username: <input type="text" name="username"><br>
                                    Password: <input type="password" name="password"><br/>
                                <input type="submit" value="Login"></form>
                            </body>
                        </html>`).code(401);
        },
        options: {
            auth: false
        }
    },
    {
        method:GET,
        path:'/logout',
        handler: async (req, h)=>{
            return h.response({message:'logout success'}).unstate('sid-example');
        }
    }

];
export default login;