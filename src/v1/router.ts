import express from 'express';
import fs from 'fs';
import path from 'path';
import { Item, Items } from './types';

const router = express.Router();

const pathDB: string = path.join(__dirname, '..', 'DBv1.JSON');
const pathDBId: string = path.join(__dirname, '..', 'DBv1Id.txt');

router.get('/api/v1/items', (req, res) => {
  if (fs.existsSync(pathDB)) {
    fs.readFile(pathDB, (error, data) => {
      if (error) throw error;

      res.end(data.toString());
    });
  } else {
    res.json({ items: [] });
  }
});

router.post('/api/v1/items', (req, res) => {
  const { text }: { text: string } = req.body;
  let id = 0;

  if (fs.existsSync(pathDBId)) id = Number(fs.readFileSync(pathDBId));

  if (fs.existsSync(pathDB)) {
    id++;
    fs.writeFile(pathDBId, id.toString(), (err) => console.error(err));
    fs.readFile(pathDB, (error, data) => {
      if (error) throw error;

      const strData: Items = JSON.parse(data.toString());

      strData.items.push({ id, text, checked: false });

      fs.writeFile(pathDB, JSON.stringify(strData), (err) => {
        if (err) throw err;
        res.end(JSON.stringify({ id }));
      });
    });
  } else {
    const newObj: Items = { items: [{ id, text, checked: false }] };

    fs.writeFile(pathDBId, '0', (error) => console.error(error));

    fs.writeFile(pathDB, JSON.stringify(newObj), (err) => {
      if (err) console.error(err);
      res.json({ id });
    });
  }
});
router.put('/api/v1/items', (req, res) => {
  const item: Item = req.body;

  if (fs.existsSync(pathDB)) {
    fs.readFile(pathDB, (error, data) => {
      if (error) throw error;

      const strData: Items = JSON.parse(data.toString());

      strData.items = strData.items.map((currentItem) => {
        if (currentItem.id !== item.id) {
          return currentItem;
        }
        return item;
      });

      fs.writeFile(pathDB, JSON.stringify(strData), (err) => {
        if (err) throw err;
        console.log(strData);
        res.json({ ok: true });
      });
    });
  } else {
    const newObj: Items = {
      items: [item]
    };

    fs.writeFile(pathDBId, '0', (error) => console.error(error));

    fs.writeFile(pathDB, JSON.stringify(newObj), (err) => {
      if (err) throw err;
      console.log(newObj);
      res.json({ ok: true });
    });
  }
});

router.delete('/api/v1/items', (req, res) => {
  const itemId: number = req.body.id;

  if (fs.existsSync(pathDB)) {
    fs.readFile(pathDB, (error, data) => {
      if (error) throw error;

      const strData: Items = JSON.parse(data.toString());

      strData.items = strData.items.filter(
        (currentItem) => currentItem.id !== itemId
      );

      fs.writeFile(pathDB, JSON.stringify(strData), (err) => {
        if (err) throw err;
        res.json({ ok: true });
      });
    });
  } else {
    res.json({ ok: true });
  }
});

export default router;
