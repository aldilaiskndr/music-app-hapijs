import {EntitySchema} from "typeorm";
import ArtistModel from "../../models/artist.model";

export const artistSchema = new EntitySchema({
    name : 'Artist',
    target : ArtistModel,
    tableName : 'mst_artist',
    columns:{
        id:{
            primary:true,
            type:'uuid',
            generated:'uuid'
        },
        name:{
            type: 'varchar',
            nullable: false,
        },
        originPlace:{
            name:'origin_place',
            type:'varchar',
            nullable: false
        },
        debut:{
            type:'date',
            nullable:false,
        },
    },
    relations:{
        genre:{
            name:'id_genre',
            target:'GenreModel',
            type:'many-to-one',
            joinColumn: true,
            eager: true
        },
    }
});