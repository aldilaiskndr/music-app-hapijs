import {UserService} from "../services";
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';

const userService = new UserService();

const user = [
    {
        method: 'GET',
        path: '/users',
        config: {
            auth: false,
            handler: async (req, h) => {
                return h.payload = await userService.findAll();
            }
        }
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: async (req, h) => {
            try {
                return h.payload = await userService.findById(req.params.id);
            } catch (e) {
                throw Boom.notFound(e.message);
            }
        }
    },
    {
        method: 'PUT',
        path: '/users',
        config: {
            auth: false,
            handler: async function (request, h) {
                let user = request.payload;
                console.log(user);
                try {
                    user = await userService.create(user);
                    return h.response(user).code(201);
                } catch (e) {
                    throw Boom.badRequest(e.message);
                }
            },
            // validate: {
            //     payload:
            //         Joi.object({
            //             username: Joi.string().max(20).min(5).alphanum().required(),
            //             password: Joi.string().min(5).required(),
            //         })
            // }
        },
    },
    {
        method: 'delete',
        path: '/users/{id}',
        handler: async (req, h) => {
            try {
                await userService.deleteUser(req.params.id);
                return h.response({message: 'Success'}).code(200);
            } catch (e) {
                return Boom.notFound(e.message);
            }
        }
    },
];

export default user;