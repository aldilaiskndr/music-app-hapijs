import Boom from '@hapi/boom';
import {GenreService} from '../services';
import {PATH_GENRE_API} from "../constant/path.constant";
import {DELETE, GET, POST, PUT} from "../constant/method.constant";

const genreService = new GenreService();

const genre = [
    {
        method:GET,
        path: PATH_GENRE_API,
        config:{
            handler: async (req, h)=>{
                return h.payload = await genreService.findAllGenre();
            }
        }
    },
    {
        method: GET,
        path: PATH_GENRE_API+'/{id}',
        config: {
            handler: async (req, h) => {
                try {
                    return h.payload = await genreService.findById(req.params.id);
                }catch (error) {
                    throw Boom.notFound(error.message);
                }
            }
        }
    },
    {
        method:PUT,
        path:PATH_GENRE_API,
        config:{
            handler: async (req, h) =>{
                let genre = req.payload;
                genre = await genreService.createGenre(genre);
                return h.response(genre).code(201);
            }
        }
    },
    {
        method:POST,
        path: PATH_GENRE_API,
        config:{
            handler: async (req, h)=>{
                let genre = req.payload;
                try {
                    genre = await genreService.updateGenre(genre);
                    return h.response(genre).code(201);
                }catch (e) {
                    throw Boom.notFound(e.message);
                }
            }
        }
    },
    {
        method:DELETE,
        path:PATH_GENRE_API+'/{id}',
        config:{
            handler: async (req, h)=>{
                try {
                    await genreService.deleteById(req.params.id);
                    return h.response({message:'Delete Success'}).code(200)
                }catch (e) {
                    throw Boom.notFound(e.message);
                }
            }
        }
    }
];
export default genre;