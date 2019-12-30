import ArtistModel from "../models/artist.model";
import {getRepository} from "typeorm";

class ArtistService {
    artistRepository(){
        return getRepository(ArtistModel);
    };

}