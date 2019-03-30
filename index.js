const express = require('express');
const helmet = require('helmet');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
const parser = express.json();

server.use(parser);
server.use(helmet());

// endpoints here

const port = 3300;

server.post('/api/zoos', (req, res) => {
  const zoo = req.body;
  if (zoo.name) {
    db.insert(zoo)
      .into('zoos')
      .then(ids => {
        res.status(201).json(ids[0]);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: 'Could not insert zoo.' });
      });
  } else {
    res.status(400).json({ message: "Please input a name." });
  }
});

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.json(zoos);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'Could not find zoos.' });
    });
});

server.get('/api/zoos/:id', (req, res) => {
  const { id } = req.params;

  db('zoos')
    .where({ id })
    .then(zoo => {
      if (zoo.length) {
        res.json(zoo);
      } else {
        res.status(400).json({ message: `Zoo at id:${id} does not exist.` });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'Could not find zoo.' });
    });
});

server.delete('/api/zoos/:id', (req, res) => {
  const { id } = req.params;

  db('zoos')
    .where({ id })
    .del()
    .then(count => {
      res.json(count);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Could not delete zoo." });
    });
});

server.put('/api/zoos/:id', (req, res) => {
  const { id } = req.params;
  const zooChanges = req.body;

  db('zoos')
    .where({ id })
    .update(zooChanges)
    .then(count => {
      if (count) {
        res.json(count);
      } else {
        res.status(400).json({ message: `Zoo at id:${id} does not exist.` });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'Could not update zoo.' });
    });
});





server.listen(port, function () {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
