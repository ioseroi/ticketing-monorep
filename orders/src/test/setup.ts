import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

let mongo: any;
/* eslint-disable no-var */
declare global {
    function signin(): string[];
}
jest.mock('../nats-wrapper');

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

global.signin = () => {
    /** build a JWT payload {id,email} **/
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    /** Build the JWT **/
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    /** Build session Object **/
    const session = {jwt: token};
    /** Turn session into JSON **/
    const sessionJSON = JSON.stringify(session);
    /** Encode JSON as Base64 **/
    const base64 = Buffer.from(sessionJSON).toString('base64');
    /** Return string with cookie as ecoded data **/
    return [`session=${base64}`];
}