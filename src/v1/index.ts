import express from 'express';
import cors from 'cors';
import session from 'express-session';
import router from './router';

const PORT = 3005;
const HOST_NAME = 'localhost';
const app = express();

app.use(
  cors({
    origin: [
      'http://127.0.0.1:8080',
      `http://127.0.0.1:${PORT}`
      // 'https://web.postman.co/',
    ],
    credentials: true
  })
);
app.use(express.json());

app.use(
  session({
    name: 'sid',
    secret: 'random frase for make koding a sid in cookies',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true
    }
  })
);

app.use('/static', express.static('static'));
app.use(router);
app.listen(PORT, HOST_NAME, () => console.log(`Port: ${PORT}`));
