import express from 'express';
import fs from 'fs';
import path from 'path';

import { Item, User, Users, LoginData } from './types';

const router = express.Router();

const pathDB: string = path.join(__dirname, '..', 'DBv1.JSON');

router.get('/api/v1/items', (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    res.json(req.session.user.items);
  } else {
    res.json({ error: 'forbidden' });
  }
});

router.post('/api/v1/items', (req, res) => {
  const { text }: { text: string } = req.body;
  const id: number = performance.now();
  req.session.user.items.push({ id, text, checked: false });
  res.json({ id });
});

router.put('/api/v1/items', (req, res) => {
  const item: Item = req.body;
  if (req.session.user.items.some((itm: Item) => itm.id === item.id)) {
    req.session.user.items = req.session.user.items.map((curentItem) => {
      if (curentItem.id === item.id) {
        return item;
      }
      return curentItem;
    });
  } else {
    req.session.user.items.push(item);
  }
  res.json({ ok: true });
});

router.delete('/api/v1/items', (req, res) => {
  const itemId: number = req.body.id;
  req.session.user.items = req.session.user.items.filter(
    (currentItem) => currentItem.id !== itemId
  );
  res.json({ ok: true });
});

router.post('/api/v1/login', (req, res) => {
  const data: { login: string; pass: string } = req.body;
  if (req.session.user) {
    console.log('Session:', req.session.user);
    res.json({ ok: true });
  } else if (fs.existsSync(pathDB)) {
    fs.readFile(pathDB, (err, dataDB) => {
      if (err) throw err;

      const dataBase: Users = JSON.parse(dataDB.toString());

      const currentUser: User | undefined = dataBase.users.find(
        (user: User) => user.login === data.login && user.pass === data.pass
      );
      const isLoginCurrent: boolean = currentUser !== undefined;

      if (isLoginCurrent) {
        req.session.user = currentUser as User;
        res.json({ ok: true });
      } else {
        res.json({ error: 'not found' });
      }
    });
  } else {
    res.json({ error: 'not found' });
  }
});

router.post('/api/v1/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) throw err;
    });
  }
  res.json({ ok: true });
});

router.post('/api/v1/register', (req, res) => {
  const data: LoginData = req.body;
  const now = performance.now();
  if (fs.existsSync(pathDB)) {
    fs.readFile(pathDB, (err, dataDB) => {
      const dataBase: Users = JSON.parse(dataDB.toString());
      const currentUser: User | undefined = dataBase.users.find(
        (user: User) => user.login === data.login
      );

      const isLoginCurrent: boolean = currentUser === undefined;
      if (isLoginCurrent) {
        req.session.user = {
          id: now,
          login: data.login,
          pass: data.pass,
          items: []
        };

        dataBase.users.push(req.session.user);
        fs.writeFileSync(pathDB, JSON.stringify(dataBase));
        req.session.itemsId = now;
        res.json({ ok: true });
      } else {
        res.status(400).json({ error: 'Login is uncorrect' });
      }
    });
  } else {
    req.session.user = {
      id: now,
      login: data.login,
      pass: data.pass,
      items: []
    };
    fs.writeFile(
      pathDB,
      JSON.stringify({ users: [req.session.user] }),
      (error) => {
        if (error) console.error(error);
        req.session.itemsId = now;
      }
    );
    res.json({ ok: true });
  }
});

export default router;
