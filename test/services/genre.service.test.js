import init from "../../src/api"
import {GenreService} from "../../src/services/";
import {deepEqual} from 'assert';

let server;
let genreService = new GenreService();
let payload = {
    genreName : 'Pop'
};
let payload2 = {
    genreName : 'Rock'
};

const expectedErrorMessage = {message: "Sorry, Genre Not Found", status: 404};

describe('Genre Service', function () {
    beforeAll(async () => {
        server = await init();
        await genreService.genreRepository().clear()
    });

    beforeEach(async () => {
        await genreService.genreRepository().clear();
    });
    afterEach(async () => {
        await genreService.genreRepository().clear();
        if (server) {
            await server.close();
        }
    });
    describe('create genre', function () {
        it('should return genre', async function () {
            const genre = await genreService.createGenre(payload);
            expect(genre).toMatchObject(payload);
        });
        it('should return genre with generated id', async function () {
            const genre = await genreService.createGenre(payload);
            console.log(genre);
            expect(genre).toHaveProperty('idGenre');
        });
    });
    describe('find all genre', function () {
        it('should return 2 genre when 2 data exist in db', async function () {
            await genreService.createGenre(payload);
            await genreService.createGenre(payload2);
            const expectedLength = 2;
            expect(await genreService.findAllGenre()).toHaveLength(expectedLength);
        });
    });
    describe('find genre by id', function () {
        it('should return one genre with suitable id', async function () {
            let genre = await genreService.createGenre(payload);
            genre = await genreService.findById(genre.id);
            expect(genre).toMatchObject(payload);
        });
        it('should return message not found when genre not found', async function () {
            await genreService.findById(2).catch((error)=>{
                deepEqual(error, expectedErrorMessage);
            })
        });
    });
    describe('update genre', function () {
        it('should return new data of genre when updated', async function () {
            let genre = await genreService.createGenre(payload);
            genre.genreName = 'Dangdut';
            const newGenre = await genreService.updateGenre(genre);
            deepEqual(newGenre, genre)
        });
        it('should return genre not found when genre not found', async function () {
            await genreService.updateGenre({idGenre:90, genreName:'alternative'}).catch((error)=>{
                deepEqual(error, expectedErrorMessage);
            })
        });
    });
    describe('Delete genre', function () {
        it('should delete one genre when found', async function () {
            const genre = await genreService.createGenre(payload);
            await genreService.createGenre(payload2);
            await genreService.deleteById(genre.idGenre);

            expect(await genreService.findAllGenre()).toHaveLength(1);
        });
        it('should return genre not found when genre not found', async function () {
            await genreService.deleteById(90).catch((error)=>{
                deepEqual(error, expectedErrorMessage)
            })
        });
    });

});
