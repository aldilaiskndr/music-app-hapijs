import {SongService} from '../services';
import Boom from '@hapi/boom';
import {DELETE, GET, POST, PUT} from "../constant/method.constant";
import {PATH_SONG_API} from "../constant/path.constant";

const songService = new SongService();

const song = [
    {
        method:GET,
        path:PATH_SONG_API,
        config:{
            handler: async (req, h)=>{
                return h.payload = await songService.findAll();
            }
        }
    },
    {
        method: GET,
        path: PATH_SONG_API+'/{id}',
        config: {
            handler: async (req, h)=>{
                try {
                    return h.payload = await songService.findById(req.params.id);
                }catch (error) {
                    throw Boom.notFound(error.message);
                }
            }
        }
    },
    {
        method:PUT,
        path:PATH_SONG_API,
        config:{
            handler:async (req, h)=>{
                let song = req.payload;
                try {
                    song = await songService.createSong(song);
                    return h.response(song).code(201);
                }catch (e) {
                    throw Boom.notFound(e.message);
                }
            }
        }
    },
    {
        method:POST,
        path:PATH_SONG_API,
        config:{
            handler:async (req, h)=>{
                let song = req.payload;
                try {
                    song = await songService.updateSong(song);
                    return h.response(song).code(201);
                }catch (error) {
                    throw Boom.notFound(error.message);
                }
            }
        }
    },
    {
        method:DELETE,
        path:PATH_SONG_API+'/{id}',
        config:{
            handler: async (req, h)=>{
                try {
                    return h.payload = await songService.deleteById(req.params.id);
                }catch (error) {
                    throw Boom.notFound(error.message);
                }
            }
        }
    }
];
