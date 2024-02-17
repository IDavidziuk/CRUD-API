import supertest from 'supertest';
import http from 'http';
import { server } from './src/index';
import { HTTP_STATUSES } from './src/interfaces/statuses';
const api = supertest(server);
import { v4 as uuidv4 } from 'uuid';

let testId: string;
const user = { username: 'Poll', age: 27, hobbies: [] };

describe('testing GET', () => {
  beforeAll(async () => {
    jest.mock('uuid', () => ({ v4: () => '12345' }));
  });

  test('GET all users', async () => {
    await api
      .get('/api/users')
      .expect(HTTP_STATUSES.OK_200)
      .expect('Content-Type', /application\/json/);
  });

  test('create new user', async () => {
    const newUser = {
      id: uuidv4(),
      ...user,
    };
    testId = newUser.id;
    await api
      .post('/api/users')
      .send(newUser)
      .expect(HTTP_STATUSES.CREATED_201)
      .expect(newUser);
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

  test('delete user', async () => {
    await api
      .delete(`/api/users/${testId}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });
});
