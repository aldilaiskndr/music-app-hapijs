import SongModel from "../models/song.model";
import {getRepository} from "typeorm";
import ArtistService from "./artist.service";

let artistService = new ArtistService();

export default class SongService {
    songRepository() {
        return getRepository(SongModel);
    }

    async createSong(song) {
        const artist = await artistService.findById(song.artist);
        if (!artist) throw {message: 'Sorry, Artist Not Found', status: 404};
        song.artist = artist;
        return await this.songRepository().save(song);
    }

    async findAll() {
        return await this.songRepository().find();
    }

    async findById(id) {
        const song = await this.songRepository().findOne(id);
        if (!song) throw {message: 'Sorry, Song Not Found', status: 404};
        return song;
    }

    async deleteById(id) {
        const song = await this.findById(id);
        await this.songRepository().delete(song.id);
    }

    async updateSong(song){
        const editableSong = await this.findById(song.id);
        await this.songRepository().merge(editableSong, song);
        return await this.songRepository().save(editableSong);
    }

    async findSongsByArtistId(id) {
        return await this.songRepository()
            .createQueryBuilder("song")
            .leftJoinAndSelect("song.artist", "artist")
            .where(`artist.id = '${id}'`).getMany()
    }
}

