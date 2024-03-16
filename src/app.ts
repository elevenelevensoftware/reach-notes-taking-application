import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

const authToken = 'an_arbitrary_static_token';

// this could be better as it could be a standalone model
let notes: { id: number; title: string; content: string; createdAt: Date }[] = [];

app.use(bodyParser.json());

// Simple authentication middleware
const authenticate = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization;
  if (token !== authToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Retrieve all notes
app.get('/notes', authenticate, (req: Request, res: Response) => {
  const simplifiedNotes = notes.map(note => ({
    id: note.id,
    title: note.title,
    createdAt: note.createdAt,
  }));
  return res.json(simplifiedNotes);
});

export const getNotes = (req: Request, res: Response): void => {
  const simplifiedNotes = notes.map(note => ({ id: note.id, title: note.title, createdAt: note.createdAt }));
  res.json(simplifiedNotes);
};

app.post('/notes', authenticate, (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Please supply a title and some content' });
  }

  const newNote = {
    id: notes.length + 1,
    title,
    content,
    createdAt: new Date()
  };

  notes.push(newNote);
  return res.status(201).json(newNote);
});

// Retrieve a single note by id
app.get('/notes/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; // Exporting the app for testing purposes
