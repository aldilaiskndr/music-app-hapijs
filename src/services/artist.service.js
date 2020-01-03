import ArtistModel from "../models/artist.model";
import {getRepository} from "typeorm";
import GenreService from './genre.service'
import FileService from "../services/file.service";

const fileService = new FileService();
let genreService = new GenreService();

class ArtistService {

    artistRepository() {
        return getRepository(ArtistModel);
    };

    async saveArtist(artist){
        try {
            artist.genre = await genreService.findById(artist.genre);
        } catch (e) {
            throw {message: 'Sorry, Genre Not Found', status: 404}
        }
        return await this.artistRepository().save(artist);
    }

    async createArtist(artist, image) {
        artist = await this.saveArtist(artist);
        await fileService.savingFile(image, artist.id);
        return artist;
    }

    async findById(id) {
        const artist = await this.artistRepository().findOne(id);
        if (!artist) throw {message: 'Sorry, Artist Not Found', status: 404};
        return artist;
    }
    async findArtistByIdGenre(idGenre){
        return await this.artistRepository()
            .createQueryBuilder("artist")
            .leftJoinAndSelect("artist.genre", "genre")
            .where(`genre.id_genre = ${idGenre}`).getMany();
    }

    async findAll() {
        return await this.artistRepository().find();
    }

    async updateArtist(artist) {
        const editableArtist = await this.findById(artist.id);
        await this.artistRepository().merge(editableArtist, artist);
        return await this.artistRepository().save(editableArtist);
    }

    async deleteArtist(id) {
        const artist = await this.findById(id);
        await this.artistRepository().delete(artist.id);
    }
}

export default ArtistService;