import {EntitySchema} from "typeorm";
import UserModel from "../../models/user.model";

export const userSchema = new EntitySchema({
    name:'User',
    target:UserModel,
    tableName:'mst_user',
    columns:{
        id:{
            primary: true,
            type:'uuid',
            generated:'uuid'
        },
        username:{
            type: 'varchar',
            nullable: false
        },
        password:{
            type:'varchar',
            nullable: false
        }
    }
});