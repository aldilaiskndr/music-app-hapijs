import Boom from '@hapi/boom';
import {ArtistService} from "../services";
import {DELETE, GET, POST, PUT} from "../constant/method.constant";
import {PATH_ARTIST_API} from "../constant/path.constant";

const artistService = new ArtistService();
const artist = [
    {
        method: GET,
        path: PATH_ARTIST_API,
        config: {
            handler: async (req, h) => {
                return h.payload = await artistService.findAll();
            }
        }
    },
    {
        method: GET,
        path: PATH_ARTIST_API + '/{id}',
        config: {
            handler: async (req, h) => {
                try {
                    return h.payload = await artistService.findById(req.params.id);
                } catch (error) {
                    throw Boom.notFound(error.message);
                }
            }
        }
    },
    {
        method: GET,
        path: PATH_ARTIST_API + '/genre/{id}',
        config: {
            handler: async (req, h) => {
                try {
                    return h.payload = await artistService.findArtistByIdGenre(req.params.id);
                } catch (error) {
                    throw Boom.notFound(error.message);
                }
            }
        }
    },
    {
        method: PUT,
        path: PATH_ARTIST_API,
        handler: async (req, h) => {
            let artist = req.payload.artist;
            let image = req.payload.image;
            console.log(artist);
            try {
                artist = await artistService.createArtist(JSON.parse(artist), image);
                return h.response(artist).code(201);
            } catch (e) {
                throw Boom.notFound(e.message);
            }
        },
        options:{
            payload:{
                output:'stream',
                parse:true,
                allow:'multipart/form-data'
            }
        }
    },
    {
        method: POST,
        path: PATH_ARTIST_API,
        config: {
            handler: async (req, h) => {
                let newDataArtist = req.payload;
                try {
                    newDataArtist = await artistService.updateArtist(newDataArtist);
                    return h.response(newDataArtist).code(201);
                } catch (error) {
                    throw Boom.notFound(error.message);
                }
            }
        }
    },
    {
        method: DELETE,
        path: PATH_ARTIST_API + '/{id}',
        config: {
            handler: async (req, h) => {
                try {
                    await artistService.deleteArtist(req.params.id);
                    return h.response({message: 'Delete Artist Success'}).code(200);
                } catch (error) {
                    throw Boom.notFound(error.message);
                }
            }
        }
    }
];
export default artist;