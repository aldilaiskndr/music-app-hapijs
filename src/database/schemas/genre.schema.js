import {EntitySchema} from "typeorm";
import GenreModel from "../../models/genre.model";
export const genreSchema = new EntitySchema({
    name : 'Genre',
    target : GenreModel,
    tableName : 'mst_genre',
    columns:{
        idGenre:{
            name:'id_genre',
            primary:true,
            type:'int',
            generated:'sequence'
        },
        genreName:{
            name:'genre_name',
            type: 'varchar',
            nullable:false
        },
    },
});