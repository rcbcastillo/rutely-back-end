const express = require('express');
const {
  getTopics, 
  getArticles, 
  getArticlesById, 
  patchArticlesById} = require('../controllers/controllers.js')

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticlesById);

app.patch('/api/articles/:article_id', patchArticlesById);

app.use('*', (req, res) => {
  res.status(404).send({ message:'Invalid path' })
})


app.use((err, req, res, next) => {
  console.log(err, 'in the app custom error')
  if (err.status && err.message) {
    res.status(err.status).send({message: err.message})
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.status(500).send({message: 'something went wrong', err: err})
})

module.exports = app;