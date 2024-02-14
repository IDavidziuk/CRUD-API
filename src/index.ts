import http from 'http';
import { v4 as uuidv4, validate } from 'uuid';
import { users as users } from './data/db';
//import fs from 'fs'
import url from 'url';

import { HTTP_STATUSES } from './interfaces/statuses';
import { User } from './interfaces/user';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const urlparse = url.parse(req.url as string, true);
  const query = urlparse.query;
  const path = urlparse.pathname;

  if (path === '/api/users' && req.method === 'GET') {
    res.writeHead(HTTP_STATUSES.OK_200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
  if (path === '/api/users/:userId' && req.method === 'GET') {
    const search = urlparse.search;
    if (search) {
      const [id] = search.split('?');
      let user = users.find((item) => item.id === id);
      if (!validate(id)) {
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
        res.end(JSON.stringify(user));
      }
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
      res.end(JSON.stringify(users));
    });
  }

  if (path === '/api/users/:userId' && req.method === 'PUT') {
    const search = urlparse.search;
    if (search) {
      const [id] = search.split('?');
      let user = users.find((item) => item.id === id);
      if (!validate(id)) {
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
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const newData = JSON.parse(body);
          const updateUser: User = {
            ...newData,
          };
          users.splice(+id, 1, updateUser);
          res.writeHead(HTTP_STATUSES.OK_200, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify(users));
        });
      }
    }
  }

  if (path === '/api/users/:userId' && req.method === 'DELETE') {
    const search = urlparse.search;
    if (search) {
      const [id] = search.split('?');
      let user = users.find((item) => item.id === id);
      if (!validate(id)) {
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
        res.writeHead(HTTP_STATUSES.NO_CONTENT_204, {
          'Content-Type': 'application/json',
        });
        users.filter((user) => user.id != id);
        res.end(JSON.stringify('User was deleted'));
      }
    }
  }
});

//start app
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
