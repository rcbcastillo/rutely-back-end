const {
  selectTopics, 
  selectArticles, 
  selectArticleByID, 
  updateArticleByID,
  selectUsers,
  selectCommentsByArticleId,
  } = require('../models/models.js');


exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();
    res.status(200).send({topics})
  } catch (err) {
    next(err)
  }
};

exports.getArticles = async (req, res, next) => { 
  try {
    const articles = await selectArticles();
    if (articles !== undefined) {
      res.status(200).send({articles});
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
};

exports.getArticlesById = async (req, res, next) => {  
  try {
    const { article_id } = req.params;
    const article = await selectArticleByID(article_id);

    if (article !== undefined) {
      res.status(200).send({ article });
    } else {
      res.status(404).send({ message:'Resource not found' })
    }
  } catch(err) {
    next(err)
  }
};

exports.patchArticlesById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const  {inc_votes}  = req.body;
    const article = await updateArticleByID(inc_votes, article_id);

    if (article !== undefined) {
      res.status(200).send({article});
    } else {
      res.status(404).send({message:'Resource not found'});
    }   
  } catch(err) {
    next(err)
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    if (users!== undefined) {
      res.status(200).send({users});
    } else {
      res.status(404).send({message:'Resource not found'})
    }
  } catch (err) {
    next(err)
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    
    const comments = await selectCommentsByArticleId(article_id);
    if (comments !== undefined) {
      res.status(200).send({comments});
    } else {
      res.status(404).send({message: "Resource not found"});
    }
  } catch (err) {
    next(err)
  }
}