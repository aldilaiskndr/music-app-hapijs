import {GenreService, UserService} from '../../src/services';
import request from 'supertest';
import init from '../../src/api'
import {PATH_GENRE_API} from "../../src/constant/path.constant";

let server;
let genreService = new GenreService();
let userService = new UserService();
let payload = {
    genreName:'Pop'
};
let payload2 = {
    genreName:'Rock'
};
let user = {
    username: 'aldilaisk',
    password :'password'
};
const ok = 200;
const created = 201;
const notFound = 404;
const expectedErrorMessage = {message: "Sorry, Genre Not Found", status: 404};

describe('Genre Route Test', function () {
    beforeAll(async ()=>{
        server = await init();
        await userService.create(user);
        await request(server).post('/login').send(user);
        await genreService.genreRepository().clear();
    });
    beforeEach(async ()=>{
        await  genreService.genreRepository().clear();
    });
    describe('PUT to endpoint /genres', function () {
        it('should return genre when created', async function () {
            const response = await request(server)
                .put(PATH_GENRE_API)
                .set('Accept', 'application/json')
                .send(payload);
            expect(response.body).toMatchObject(payload)
        });
        it('should return statusCode 201 when created', async function () {
            const response = await request(server)
                .put(PATH_GENRE_API)
                .set('Accept', 'application/json')
                .send(payload);
            expect(response.statusCode).toBe(created)
        });
        it('should return genre with generated id', async function () {
            const response = await request(server)
                .put(PATH_GENRE_API)
                .set('Accept', 'application/json')
                .send(payload);
            expect(response.body).toHaveProperty('idGenre')
        });
    });
    describe('GET to endpoint /genres', function () {
        it('should return 2 genres when 2 data exist in db', async function () {
            await genreService.createGenre(payload);
            await genreService.createGenre(payload2);

            const response = await request(server)
                .get(PATH_GENRE_API);
            expect(response.body).toHaveLength(2);
        });
        it('should return 200 when success', async function () {
            const response = await request(server)
                .get(PATH_GENRE_API);
            expect(response.statusCode).toBe(ok);
        });
        it('should return one genre when id on request params is suitable with data', async function () {
            const genre = await genreService.createGenre(payload);
            const response = await request(server)
                .get(PATH_GENRE_API+`/${genre.idGenre}`);
            expect(response.body).toMatchObject(genre);
        });
        it('should return status code 404 when id in params not found', async function () {
            const response = await request(server)
                .get(PATH_GENRE_API+'/90');
            expect(response.statusCode).toBe(notFound);
        });
        it('should return message not found when genre not found', async function () {
            const response = await request(server)
                .get(PATH_GENRE_API+'/90');
            expect(response.body).toEqual({
                error: "Not Found",
                message: "Sorry, Genre Not Found",
                statusCode: 404
            });
        });
    });
    describe('POST to endpoint /genres', function () {
        it('should return status code 201 and new data when update success', async function () {
            const genre = await genreService.createGenre(payload);
            const editedGenre = {...genre, genreName:'Dandut'};
            const response = await request(server)
                .post(PATH_GENRE_API)
                .set('Accept', 'application/json')
                .send(editedGenre);
            expect(response.statusCode).toBe(created);
            expect(response.body).toEqual(editedGenre);
        });
        it('should return message not found when genre not found', async function () {
            const response = await request(server)
                .post(PATH_GENRE_API)
                .set('Accept', 'application/json')
                .send({idGenre:90, genreName:'dangdut'});
            expect(response.body).toEqual({
                error: "Not Found",
                message: "Sorry, Genre Not Found",
                statusCode: 404
            });
        });
    });
    describe('DELETE to endpoint /genres', function () {
        it('should return 200 and message success when delete success', async function () {
            const genre = await genreService.createGenre(payload);
            const response = await request(server)
                .delete(PATH_GENRE_API+`/${genre.idGenre}`);
            expect(response.statusCode).toBe(ok);
            expect(response.body).toEqual({message:'Delete Success'})
        });
        it('should return message not found when genre not found', async function () {
            const response = await request(server)
                .delete(PATH_GENRE_API+'/90');
            expect(response.body).toEqual({
                error: "Not Found",
                message: "Sorry, Genre Not Found",
                statusCode: 404
            });
        });
    });
    afterEach(async ()=>{
        await genreService.genreRepository().clear();
        if(server){
            server.close();
        }
    })
});