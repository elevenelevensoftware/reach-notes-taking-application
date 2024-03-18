import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

const authToken = 'an_arbitrary_static_token';

// this could be better as it could be a standalone model
let notes: { id: number; title: string; content: string; createdAt: Date }[] = [];

app.use(bodyParser.json());

/***
 * Simple auth middleware using the authorization header
 * @param req
 * @param res
 * @param next
 */
const authenticate = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization;
  if (token !== authToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// will authenticate first and then get all notes as json if authenticated
app.get('/notes', authenticate, (req: Request, res: Response) => {
  const allNotes = notes.map(note => ({
    id: note.id,
    title: note.title,
    createdAt: note.createdAt,
  }));
  return res.json(allNotes);
});

// will authenticate first and then create a note if authenticated
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

// will authenticate first and then retrieve a single note by id if authenticated
app.get('/notes/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id); //TODO: could this be optimised?
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
});

app.listen(PORT, () => {
  console.log('                             .__                     __                                        \n' +
      '_______   ____ _____    ____ |  |__     ____   _____/  |_  ____   ______ _____  ______ ______  \n' +
      '\\_  __ \\_/ __ \\\\__  \\ _/ ___\\|  |  \\   /    \\ /  _ \\   __\\/ __ \\ /  ___/ \\__  \\ \\____ \\\\____ \\ \n' +
      ' |  | \\/\\  ___/ / __ \\\\  \\___|   Y  \\ |   |  (  <_> )  | \\  ___/ \\___ \\   / __ \\|  |_> >  |_> >\n' +
      ' |__|    \\___  >____  /\\___  >___|  / |___|  /\\____/|__|  \\___  >____  > (____  /   __/|   __/ \n' +
      '             \\/     \\/     \\/     \\/       \\/                 \\/     \\/       \\/|__|   |__|    ');
  console.log(`\nHappy days, the server is running on port ${PORT}`);
});

export default app; // Exporting the app for testing purposes
