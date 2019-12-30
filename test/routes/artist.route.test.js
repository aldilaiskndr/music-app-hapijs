import {ArtistService, GenreService} from "../../src/services";
import init from "../../src/api";
import request from 'supertest';
import {PATH_ARTIST_API} from "../../src/constant/path.constant";

let server;
let artistService = new ArtistService();
let genreService = new GenreService();
const ok = 200;
const created = 201;
const notFound = 404;

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

describe('Artist Route Test', function () {

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

    describe('PUT to endpoint /artists', function () {
        it('should return 201 when success', async function () {
            payload.genre = genrePayload.idGenre;
            const response = await request(server)
                .put(PATH_ARTIST_API)
                .set('Accept', 'application/json')
                .send(payload);
            expect(response.statusCode).toBe(created);
        });
        it('should return user when success', async function () {
            payload.genre = genrePayload.idGenre;
            const response = await request(server)
                .put(PATH_ARTIST_API)
                .set('Accept', 'application/json')
                .send(payload);
            payload.genre = response.body.genre;
            expect(response.body).toMatchObject(payload);
        });
    });
    describe('GET to endpoint /artists', function () {
        it('should return 2 data when 2 data exist in db', async function () {
            payload.genre = genrePayload.idGenre;
            payload2.genre = genrePayload.idGenre;
            await artistService.createArtist(payload);
            await artistService.createArtist(payload2);

            const response = await request(server).get(PATH_ARTIST_API);
            expect(response.body).toHaveLength(2);
        });
        it('should return one artist with suitable id when there is request params', async function () {
            payload.genre = genrePayload.idGenre;
            const artist = await artistService.createArtist(payload);
            const response = await request(server).get(PATH_ARTIST_API+`/${artist.id}`);
            artist.genre = response.body.genre;
            expect(response.body).toMatchObject(artist);
        });
    });
    describe('POST to endpoint /artists', function () {
        it('should return new Artist when updated', async function () {
            payload.genre = genrePayload.idGenre;
            const artist = await artistService.createArtist(payload);
            artist.name = 'Ari Lesmana';
            const response = await request(server)
                .post(PATH_ARTIST_API)
                .set('Accept', 'application/json')
                .send(artist);
            expect(response.body).toMatchObject(artist);
        });
    });
    describe('DELETE to endpoint /artists', function () {
        it('should return 200 and message success when delete success', async function () {
            payload.genre = genrePayload.idGenre;
            const artist = await artistService.createArtist(payload);
            const response = await request(server).delete(PATH_ARTIST_API+`/${artist.id}`);
            expect(response.statusCode).toBe(ok);
            expect(response.body).toMatchObject({message:'Delete Artist Success'})
        });
    });
    afterEach(async ()=>{
        await artistService.artistRepository().clear();
        await genreService.genreRepository().clear();
        if(server){
            await server.close();
        }
    });

});