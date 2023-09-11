import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from "mongoose";
import request from 'supertest';
import {app} from "../app";

let mongo: any;
/* eslint-disable no-var */
declare global {
    function signin(): Promise<string[]>;
}

beforeAll(async () => {
    process.env.JWT_KEY = 'secret';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password'
    const reponse = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201)
    const cookie = reponse.get('Set-Cookie');
    return cookie;
}