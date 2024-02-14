import { v4 as uuidv4 } from 'uuid';
import { User } from '../interfaces/user';

export let users: User[] = [
  {
    id: uuidv4(),
    username: 'Tom',
    age: 18,
    hobbies: ['cycling', 'reading', 'playing computer games'],
  },
  {
    id: uuidv4(),
    username: 'Anna',
    age: 22,
    hobbies: ['photography', 'cooking'],
  },
  {
    id: uuidv4(),
    username: 'Alex',
    age: 30,
    hobbies: ['swimming'],
  },
];
