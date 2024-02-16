import supertest from 'supertest';
import { server } from './src/index';
import { HTTP_STATUSES } from './src/interfaces/statuses';
const api = supertest(server);
import { v4 as uuidv4 } from 'uuid';

describe('testing GET', () => {
  test('GET all users', async () => {
    await api
      .get('/api/users')
      .expect(HTTP_STATUSES.OK_200)
      .expect('Content-Type', /application\/json/);
  });
});

describe('testing POST', () => {
  test('create new user', async () => {
    const newUser = {
      username: 'Poll',
      age: 22,
      hobbies: [],
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(HTTP_STATUSES.CREATED_201);
  });
  test('dont fill all field', async () => {
    const newUser = {
      username: 'Poll',
      hobbies: [],
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(JSON.stringify('Please add all fields'));
  });
});
