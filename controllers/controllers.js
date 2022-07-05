const {
  selectTopics, 
  selectArticles, 
  selectArticleByID, 
  checkIfItemExists} = require('../models/models.js');


exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();
    res.status(200).send({topics})
  } catch (err) {
    console.log(err);
    next(err)
  }

};

exports.getArticles = async (req, res, next) => { 
  try {
    const articles = await selectArticles();
    res.status(200).send({articles});
  } catch (err) {
    console.err(err);
    next(err)
  }
};

exports.getArticlesById = async (req, res, next) => {  
  try {
    const { article_id } = req.params;
    const article = await selectArticleByID(article_id);
    console.log(article, 'in the controller')
    if (article !== undefined) {
      res.status(200).send({article});
    } else {
      res.status(404).send({message:'Resource not found'})
    }
  } catch(err) {
    console.log(err)
    next(err)
  }

};

