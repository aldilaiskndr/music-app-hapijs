import {getRepository} from "typeorm";
import GenreModel from "../models/genre.model";

class GenreService {
    genreRepository(){
        return getRepository(GenreModel);
    }

    async createGenre(genre){
        return await this.genreRepository().save(genre);
    }

    async findAllGenre(){
        return await this.genreRepository().find();
    }

    async findById(id){
        const genre = await this.genreRepository().findOne(id);
        if(!genre){
            throw {message:'Sorry, Genre Not Found', status:404}
        }
        return genre;
    }

    async updateGenre(genre){
        const getEditGenre = await this.findById(genre.idGenre);
        await this.genreRepository().merge(getEditGenre, genre);
        return await this.genreRepository().save(genre);
    }

    async deleteById(id){
        const genre = await this.findById(id);
        await this.genreRepository().delete(genre.idGenre);
    }

}
export default GenreService;