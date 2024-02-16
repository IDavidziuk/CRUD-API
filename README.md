# 🚀 Welcome to project!

## Quick start

1. To install all dependencies:

```shell
$ npm install
```

2. Run project in Dev mode

```shell
$ npm run start:dev
```

3. Run project in production mode

```shell
$ npm run start:prod
```

## How to use

If you don't create `.env` file, server will start in PORT 3008.
You need to create `.env` file in root project and write there your PORT.
http://localhost:{PORT}/api/users

```shell
PORT = your_port_number
```

To test the API, you can use Postman.

#### API Endpoints

| Methods | Urls         | Description           |
| ------- | ------------ | --------------------- |
| GET     | api/users    | Get all users         |
| GET     | api/users/id | Get the user by id    |
| POST    | api/users    | Create a new user     |
| PUT     | api/users/id | Update the user by id |
| DELETE  | api/users/id | Delete the user by id |

to create an user object, use `json` :

```
- "username": string,
- "age": number,
- "hobbies": array of string or empty array
```

to update an existing user you have to write all properties except ID

```
{
 "username": update_name,
 "age": update_age,
 "hobbies": ["update_hobby"],
}
```
