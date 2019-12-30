import {EntitySchema} from "typeorm";
import SongModel from "../../models/song.model";

export const songSchema = new EntitySchema({
    name:'Song',
    target:SongModel,
    tableName:'mst_song',
    columns:{
        id:{
            primary: true,
            type:'varchar',
            generated: 'uuid',
        },
        title:{
            type: 'varchar',
            nullable:false,
        },
        songWriter:{
            name:'song_writer',
            type: 'varchar',
            nullable: false
        }
    },
    relations:{
        artist:{
            target:'ArtistModel',
            type:'many-to-one',
            joinColumn: true,
            eager:true
        }
    }
});