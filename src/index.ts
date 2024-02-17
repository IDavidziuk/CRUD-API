import http from 'http';
import { v4 as uuidv4 } from 'uuid';
const validate = require('uuid-validate');
import { users as users } from './data/db';
//import fs from 'fs'
import url from 'url';

import { HTTP_STATUSES } from './interfaces/statuses';
import { User } from './interfaces/user';

require('dotenv').config();
const PORT = process.env.PORT || 3008;

export const server = http.createServer((req, res) => {
  if (!url) {
    res.writeHead(HTTP_STATUSES.NOT_FOUND_404, {
      'Content-Type': 'text/plain',
    });
    return res.end('Not found');
  }
  const urlparse = url.parse(req.url as string, true);

  const path = urlparse.pathname as string;
  const id = req.url && (req.url.split('/')[3] as string);
  if (path === '/api/users' && req.method === 'GET') {
    res.writeHead(HTTP_STATUSES.OK_200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(users));
  }
  if (path === `/api/users/${id}` && req.method === 'GET') {
    let user = users.find((item) => item.id == id);
    if (id && !validate(id)) {
      res.writeHead(HTTP_STATUSES.BAD_REQUEST_400, {
        'Content-Type': 'application/json',
      });
      return res.end('This id is not valid');
    } else if (!user) {
      res.writeHead(HTTP_STATUSES.NOT_FOUND_404, {
        'Content-Type': 'application/json',
      });
      return res.end('User is not find');
    } else {
      res.writeHead(HTTP_STATUSES.OK_200, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(user));
    }
  }

  if (path === '/api/users' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newData = JSON.parse(body);
      const newUser: User = {
        id: uuidv4(),
        ...newData,
      };
      if (!newUser.username || !newUser.age || !newUser.hobbies) {
        res.writeHead(HTTP_STATUSES.BAD_REQUEST_400, {
          'Content-Type': 'application/json',
        });
        return res.end(JSON.stringify('Please add all fields'));
      }

      users.push(newUser);
      res.writeHead(HTTP_STATUSES.CREATED_201, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(newUser));
    });
  }

  if (path === `/api/users/${id}` && req.method === 'PUT') {
    let user = users.find((item) => item.id == id) as User;
    if (id && !validate(id)) {
      res.writeHead(HTTP_STATUSES.BAD_REQUEST_400, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify('This id is not valid'));
    } else if (!user) {
      res.writeHead(HTTP_STATUSES.NOT_FOUND_404, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify('User is not find'));
    } else {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const newData = JSON.parse(body);
        if (!newData.username || !newData.age || !newData.hobbies) {
          res.writeHead(HTTP_STATUSES.BAD_REQUEST_400, {
            'Content-Type': 'application/json',
          });
          return res.end(JSON.stringify('Please add all fields'));
        }

        const updateUser: User = {
          id: user.id,
          username: newData.username,
          age: newData.age,
          hobbies: newData.hobbies,
        };
        if (id) users.splice(+id, 1, updateUser);
        res.writeHead(HTTP_STATUSES.OK_200, {
          'Content-Type': 'application/json',
        });
        return res.end(JSON.stringify(updateUser));
      });
    }
  }

  if (path === `/api/users/${id}` && req.method === 'DELETE') {
    let user = users.find((item) => item.id == id);
    if (id && !validate(id)) {
      res.writeHead(HTTP_STATUSES.BAD_REQUEST_400, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify('This id is not valid'));
    } else if (!user) {
      res.writeHead(HTTP_STATUSES.NOT_FOUND_404, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify('User is not find'));
    } else {
      users.splice(0, users.length, ...users.filter((user) => user.id != id));
      res.writeHead(HTTP_STATUSES.NO_CONTENT_204, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify('User was deleted'));
    }
  }
});

//start app
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
