import ArtistModel from "../models/artist.model";
import {getRepository} from "typeorm";
import GenreService from './genre.service'

let genreService = new GenreService();
class ArtistService {
    artistRepository(){
        return getRepository(ArtistModel);
    };

    async createArtist(artist){
        try {
            artist.genre = await genreService.findById(artist.genre);
        }catch (e) {
            throw {message:'Sorry, Genre Not Found', status:404}
        }
        return await this.artistRepository().save(artist);
    }

    async findById(id){
        const artist = await this.artistRepository().findOne(id);
        if(!artist) throw {message:'Sorry, Artist Not Found', status:404}
        return artist;
    }

    async findAll(){
        return await this.artistRepository().find();
    }

    async updateArtist(artist){
        const editableArtist = await this.findById(artist.id);
        await this.artistRepository().merge(editableArtist, artist);
        return await this.artistRepository().save(editableArtist);
    }

    async deleteArtist(id){
        const artist = await this.findById(id);
        await this.artistRepository().delete(artist.id);
    }
}
export default ArtistService;