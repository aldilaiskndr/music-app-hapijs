import request from 'supertest';
import { UserService } from '../../src/services';
import init from '../../src/api';

let server;
let userService = new UserService();

const payload = {
    username: 'aldilaisk',
    password: 'password'
};
const payload2 = {
    username: 'dedyindra',
    password: 'password'
};

const expectedErrorMessage = {
    statusCode: 404,
    error: 'Not Found',
    message: 'Sorry, user not found' };

const path = '/users';
const ok = 200;
const created = 201;
const notFound = 404;

describe('User route test', function () {
    beforeAll(async () => {
        server = await init();
        await userService.userRepository().clear();
    });

    beforeEach(async () => {
        await userService.userRepository().clear();
    });

    describe('GET to endpoint', function () {
        it('should return 200 when success', async function () {
            const res = await request(server).get(path);
            expect(res.statusCode).toBe(ok);
        });
        it('should return all users when access /users', async function () {
            await userService.create(payload);

            await userService.create(payload2);

            const res = await request(server)
                .get(path);
            const expectedLength = 2;
            expect(res.body).toHaveLength(expectedLength);
        });
        it('should return one user when access /users with id as request params', async function () {
            const user = await userService.create(payload);
            const res = await request(server)
                .get(path+`/${user.id}`);
            expect(res.body).toMatchObject(user);
        });
        it('should return 404 when user not found', async function () {
            const res = await request(server).get(path+'/1e1weqwe124213');
            expect(res.statusCode).toBe(notFound);
        });
        it('should return not found message when user not found', async function () {
            const res = await request(server).get(path+'/1e1weqwe124213');
            console.log(res.body);
            expect(res.body).toMatchObject(expectedErrorMessage);

        });
    });
    describe('PUT to endpoint', function () {
        it('should return 201 when created', async function () {
            const res = await request(server)
                .put(path)
                .set('Accept', 'application/json')
                .send(payload2);
            expect(res.statusCode).toBe(created);
        });
        it('should return user when created', async function () {
            const res = await request(server)
                .put(path)
                .set('Accept', 'application/json')
                .send(payload);
            expect(res.body).toMatchObject({username:'aldilaisk'});
        });
        it('should return user with generated id', async function () {
            const res = await request(server)
                .put(path)
                .set('Accept', 'application/json')
                .send(payload2);
            expect(res.body).toHaveProperty('id');
        });
    });
    describe('DELETE to endpoint', function () {
        it('should return 200 when success', async function () {
            const user = await userService.create(payload);
            const res = await request(server)
                .delete(path+`/${user.id}`);
            expect(res.statusCode).toBe(ok)
        });
    });

    afterEach(async () => {
        await userService.userRepository().clear();
        if (server) {
            server.close();
        }
    });
});