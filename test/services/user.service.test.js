import init from '../../src/api'
import {UserService} from "../../src/services";
import {equal, deepEqual} from 'assert';

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

const expectedErrorMessage = {message: "Sorry, user not found", status: 404};

describe('User Service Test', function () {
    beforeAll(async () => {
        server = await init();
        await userService.userRepository().clear()
    });

    beforeEach(async () => {
        await userService.userRepository().clear();
    });
    afterEach(async () => {
        await userService.userRepository().clear();
        if (server) {
            server.close();
        }
    });
    describe('create user', function () {
        it('should return user', async function () {
            const actual = await userService.create(payload);
            expect(actual).toEqual(payload);
        });
        it('should return user with generated id', async function () {
            const actual = await userService.create(payload);
            expect(actual).toHaveProperty('id');
        });
    });
    describe('find all user', function () {
        it('should return 2 data when 2 data exist in db', async function () {
            await userService.create(payload);
            await userService.create(payload2);

            const listPayload = await userService.findAll();
            const expectedLength = 2;
            expect(listPayload).toHaveLength(expectedLength);
        });
    });
    describe('find user by id', function () {
        it('should return a user when founded', async function () {
            const createdUser = await userService.create(payload);
            const foundedUser = await userService.findById(createdUser.id);
            deepEqual(foundedUser, createdUser);
        });
        it('should throw specify message error when id not found', async function () {
            const expectedErrorMessage = {message: "Sorry, user not found", status: 404};
            await userService.findById('sdaer1234234').catch((error) => {
                deepEqual(error, expectedErrorMessage);
            })
        });
    });
    describe('Delete User', function () {
        it('should delete one user in database', async function () {
            const createdUser = await userService.create(payload);
            await userService.deleteUser(createdUser.id).catch((error) => {
                deepEqual(error, {});
            })
        });
        it('should return specify message error when id not found', async function () {
            await userService.deleteUser('sdaer1234234').catch((error) => {
                deepEqual(error, expectedErrorMessage);
            })
        });
    });
    describe('Update user', function () {
        it('should return user with new data when updated', async function () {
            const newUserName = 'aldilaiskandar';
            let toEditUser = await userService.create(payload);
            console.log(toEditUser);
            toEditUser.username = newUserName;
            let newUser = await userService.update(toEditUser);
            equal(newUser.username, newUserName);
        });
        it('should return message error when id not found', async function () {
            const dummyUser = {id: 'sadwqe123', username: 'ini_salah', password: 'ngarang'};
            await userService.update(dummyUser).catch((error) => {
                deepEqual(error, expectedErrorMessage);
            })
        });
    });
    describe('find by username', function () {
        it('should return a user when user found', async function () {
            const newPayload = {username: 'rifqiAnjay'}
            const user2 = await userService.create(newPayload);
            console.log(user2);
            const userFound = await userService.findByUserName('rifqiAnjay');
            deepEqual(user2, userFound);
        });
    });
    describe('validate password', function () {
        it('should return true when password match', async function () {
            const newData = await userService.create({username: 'baru', password: 'barulagi'});
            console.log(newData.password);
            const result = await userService.validatePassword('barulagi', newData.password);
            console.log(result);
            expect(result).toBeTruthy();
        });
        it('should return false when password not match', async function () {
            const newData = await userService.create({username: 'baru', password: 'barulagi'});
            console.log(newData.password);
            const result = await userService.validatePassword('not match', newData.password);
            console.log(result);
            expect(result).toBeFalsy();
        });
    });
});