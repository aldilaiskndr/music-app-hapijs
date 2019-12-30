import init from '../../src/api';
import {ArtistService, GenreService} from '../../src/services/';

let server;
let artistService = new ArtistService();
let genreService = new GenreService();

let payload = {
    name:'Ari Lasso',
    originPlace:'Jakarta',
    debut:'2000-01-01'
};
let payload2 = {
    name:'Raisa',
    originPlace: 'Jakarta',
    debut:'2013-01-01'
};
let genrePayload = {
    genreName:'Pop'
};

describe('Artist Service Test', function () {
    beforeAll(async ()=>{
        server = await init();
        await artistService.artistRepository().clear();
        await genreService.genreRepository().clear();
    });
    beforeEach(async ()=>{
        await artistService.artistRepository().clear();
        await genreService.genreRepository().clear();
        genrePayload = await genreService.createGenre(genrePayload);
    });

    afterEach(async ()=>{
        await artistService.artistRepository().clear();
        await genreService.genreRepository().clear();
        if(server){
            await server.close();
        }
    });

    describe('create artist', function () {
        it('should return artist when created', async function () {
            payload.genre = genrePayload.idGenre;
            console.log(payload);
            let artist = await artistService.createArtist(payload);
            expect(artist).toMatchObject(payload);
        });
    });
    describe('find all artist', function () {
        it('should return 2 artist when 2 data is exist in db', async function () {
            payload.genre = genrePayload.idGenre;
            payload2.genre = genrePayload.idGenre;
            await artistService.createArtist(payload);
            await artistService.createArtist(payload2);

            const result = await artistService.findAll();

            expect(result).toHaveLength(2);
        });
    });
    describe('find by id artist', function () {
        it('should return one artist when founded', async function () {
            payload.genre = genrePayload.idGenre;

            const artist = await artistService.createArtist(payload);

            const result = await artistService.findById(artist.id);

            expect(result).toMatchObject(artist);
        });
    });
    describe('update artist', function () {
        it('should return new data of artist when updated', async function () {
            payload.genre = genrePayload.idGenre;
            const artist = await artistService.createArtist(payload);
            artist.name = 'Ari Untung';
            const newArtist = await artistService.updateArtist(artist);
            expect(newArtist).toMatchObject(artist);
        });
    });
    describe('delete artist by id', function () {
        it('should delete 1 data in db', async function () {
            payload.genre = genrePayload.idGenre;
            const artist = await artistService.createArtist(payload);
            await artistService.deleteArtist(artist.id);
            expect(await artistService.findAll()).toHaveLength(0);
        });
    });
});
