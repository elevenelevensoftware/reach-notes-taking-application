import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

const authToken = 'my_secret_token';

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

// Retrieve all notes (showing only titles and creation dates)
app.get('/notes', authenticate, (req: Request, res: Response) => {
  const simplifiedNotes = notes.map(note => ({
    id: note.id,
    title: note.title,
    createdAt: note.createdAt,
  }));
  return res.json(simplifiedNotes);
});

app.post('/notes', authenticate, (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; // Exporting the app for testing purposes
