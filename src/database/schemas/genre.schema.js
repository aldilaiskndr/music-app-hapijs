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
            generated:true
        },
        genreName:{
            name:'genre_name',
            type: 'varchar',
            nullable:false
        },
    },
    // relations:{
    //     artists:{
    //         target:'ArtistModel',
    //         type:'one-to-many',
    //         inverseSide: 'genre',
    //         joinColumn: true,
    //         cascade:true,
    //         eager: false
    //     }
    // }
});