import request from "supertest";
import {app} from '../../app';

it('fails when a email does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
})

it('fails when incorrect password supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'passwofdgffdgrd1'
        })
        .expect(400);
})

it('responds with a cookie when correct credentials', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined()
})

