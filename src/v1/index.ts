import express from 'express';
import cors from 'cors';
import session from 'express-session';
import fileStore from 'session-file-store';
import router from './router';
import { User } from './types';

declare module 'express-session' {
  interface Session {
    user: User;
    itemsId: number;
  }
}

const FileStore = fileStore(session);
const PORT = 3005;
const app = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:8080', `http://127.0.0.1:${PORT}`],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new FileStore(),
    secret: 'cookies',
    resave: false,
    saveUninitialized: false
  })
);

app.use('/static', express.static('static'));
app.use((req, res, next) => {
  console.log(req.cookies);
  console.log(req.body);
  next();
});

app.use(router);

app.listen(PORT, () => console.log(`Port: ${PORT}`));
