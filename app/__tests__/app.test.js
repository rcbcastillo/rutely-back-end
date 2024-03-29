const app = require('../app.js');
const db = require('../../db/connection.js')
const request = require('supertest');
const seed = require('../../db/seeds/seed.js');

const {topicData, articleData, userData, commentData} = require('../../db/data/test-data/index.js');

beforeEach(() => seed({topicData, articleData, userData, commentData})); 
afterAll(() => db.end()); 

describe('GET:/api/topics --happy path', () => {
  test('200: responds with an an array of topic objects having slug and description properties', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body: {topics}}) => {
        const actual = topics;
        const topic = {
          description: 'The man, the Mitch, the legend',
          slug: 'mitch'
        }
        expect(actual[0]).toEqual(topic);
        expect(topics.length).toBeGreaterThan(0);
    })
  });
  
});

describe(`GET:/api/topics --sad path`, () => {
  test("404: invalid path", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid path");
      });
  });
});



describe('GET: /api/articles/:article_id (comment_count) --happy path', () => {
  test('200: with an object of an article containing eight properties', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body: {article}}) => {
      expect(typeof article).toBe('object');
      expect(Object.keys(article)).toHaveLength(8);
    })
  });

  test('200: responds with an object containing article_id, title, topic, author, body, created_at, votes properties and comment_count', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body: {article}}) => {
      const numberOfKeys = Object.keys(article);
      expect(numberOfKeys.includes('article_id')).toBe(true);
      expect(numberOfKeys.includes('title')).toBe(true);
      expect(numberOfKeys.includes('topic')).toBe(true);
      expect(numberOfKeys.includes('author')).toBe(true);
      expect(numberOfKeys.includes('body')).toBe(true);
      expect(numberOfKeys.includes('created_at')).toBe(true);
      expect(numberOfKeys.includes('votes')).toBe(true);       
      expect(numberOfKeys.includes('comment_count')).toBe(true);       
    })
  });

  test('200: responds with an object containing eight properties and given values', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body: {article}}) => {    
      expect(article.article_id).toBe(1),
      expect(article.title).toBe('Living in the shadow of a great man'),
      expect(article.topic).toBe('mitch'),
      expect(article.author).toBe('butter_bridge'),
      expect(article.body).toBe('I find this existence challenging'),
      expect(article.created_at).toBe('2020-07-09T20:11:00.000Z'),
      expect(article.votes).toBe(100)
      expect(article.comment_count).toBe('11')
      })     
    });

  test('404: responds with an error message if the resource is not found', () => {
    return request(app)
    .get('/api/articles/37')
    .expect(404)
    .then(({body:{message}}) => {
      expect(message).toBe('Resource not found')
    })
  });
});

describe('PATCH: /api/articles/:article_id --happy path', () => {
  const dataToAdd = { inc_votes : 1 };
  test('200: the requested body updates the value of the votes property, when passed an object with a property called inc_votes', () => {
    return request(app)
    .patch('/api/articles/1')
    .send(dataToAdd)
    .expect(200)
    .then(({body: {article}}) => {      
      expect(article.votes).toBe(101)
    });
  });

  test('200: the requested article object responds with seven properties', () => {
    return request(app)
    .patch('/api/articles/1')
    .send(dataToAdd)
    .expect(200)
    .then(({body:{article}}) => {
      expect(article.article_id).toBe(1),
      expect(article.title).toBe('Living in the shadow of a great man'),
      expect(article.topic).toBe('mitch'),
      expect(article.author).toBe('butter_bridge'),
      expect(article.body).toBe('I find this existence challenging'),
      expect(article.created_at).toBe('2020-07-09T20:11:00.000Z'),
      expect(article.votes).toBe(101)
    })
  });

  test('404: responds with an error message if the resource is not found', () => {
    return request(app)
    .patch('/api/articles/13')
    .send(dataToAdd)
    .expect(404)
    .then(({body:{message}}) => {
      expect(message).toBe('Resource not found')
    })
  });

  test('400: responds with a message when an invalid property in the body object is send', () => {
    const incorrectDataToAdd = { B4N4N4: 1 };
    return request(app)
    .patch("/api/articles/1")
    .send(incorrectDataToAdd)
    .expect(400)
    .then(({body:{message}}) => {
      expect(message).toBe('Invalid data')
    })
  });

  test('400: responds with a message when an invalid data type is send in the body object', () => {
    const incorrectDataToAdd = { inc_votes: 'I-must-be-INT' };
    return request(app)
    .patch("/api/articles/1")
    .send(incorrectDataToAdd)
    .expect(400)
    .then(({body: {message}}) => {
      expect(message).toBe('Invalid request')
    })
  });
});

describe('PATCH: /api/articles/:article_id --sad path', () => {
  const dataToAdd = { inc_votes : 1 };
  test("400: responds a message when passed an invalid id, i.e., bad request", () => {
    return request(app)
      .patch("/api/articles/I-must-be-INT")
      .send(dataToAdd)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid request");
      });
  });  
});

describe('GET:/api/users --happy path', () => {
  test('200: responds with an an array of users objects each containing three properties', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body: {users}}) => {
      expect(users.length).toBeGreaterThan(0);
      users.forEach((user) => {
        expect(user).toEqual(expect.objectContaining({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        }));
      });
    })
  });

  test('200: each user object has username, name and avatar_url', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body: {users}}) => {
      expect(users[0].username).toBe('butter_bridge')
      expect(users[0].name).toBe('jonny')
      expect(users[0].avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')
    })
  });  
});

describe(`GET:/api/users --sad path`, () => {
  test("404: invalid path", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid path");
      });
  });
});

describe('GET /api/articles --happy path', () => {
  test('200: responds with an an array of articles objects having eight properties', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body: {articles}}) => {
      expect(articles.length).toBeGreaterThan(0);
      expect(Array.isArray(articles)).toBe(true);
      expect(articles).toBeSorted({ descending: true });
      expect(articles).toBeSortedBy('created_at', {descending: true});
      articles.forEach((article) => {
        expect(article).toEqual(expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String)
        }));
      });
        
    })
  });

  test('200: responds with an an array of one article containing eight properties', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body: {articles}}) => {
      const actual = articles[0];
      const article = {
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: '2020-11-03T09:12:00.000Z',
        votes: 0,
        comment_count: '2'
      };
     expect(actual).toEqual(article);      
    })
  });  
});

describe('GET /api/articles/:article_id/comments --happy path', () => {
  test('200: responds with an array of comments objects having five properties', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body:{comments}}) => {
      expect(comments.length).toBeGreaterThan(0);
      expect(Array.isArray(comments)).toBe(true);
      comments.forEach((comment) => {
        expect(comment).toEqual(expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          body: expect.any(String),
          author: expect.any(String)
        }));
      });
    })
  });

  test('200: responds with an an array of one article containing eight properties', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body: {comments}}) => {
      const actual = comments[0];
      const comment1 = {
        comment_id: 18,
        votes: 16,
        created_at: '2020-07-21T00:20:00.000Z',
        body: 'This morning, I showered for nine minutes.',
        author: 'butter_bridge'
      };
     expect(actual).toEqual(comment1);      
    })
  }); 

});