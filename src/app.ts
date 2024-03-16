// index.ts

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

const app = express();
const PORT = 3000;

const authToken = 'my_secret_token';

let notes: Note[] = [];

app.use(bodyParser.json());

// Simple authentication middleware
const authenticate = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization;
  if (token !== authToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Retrieve all notes (showing only titles and creation dates)
app.get('/notes', authenticate, (req: Request, res: Response) => {
  const simplifiedNotes = notes.map(note => ({
    id: note.id,
    title: note.title,
    createdAt: note.createdAt,
  }));
  return res.json(simplifiedNotes);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; // Exporting the app for testing purposes
