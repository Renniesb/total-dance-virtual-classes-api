const knex = require('knex');
const app = require('../app');
const makeVideosArray = require('./videos.fixtures.js');


describe('test getting dance videos', function() {
    let db
    
    const testVideos = makeVideosArray()
    
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db);
    })
  
    after('disconnect from db', () => db.destroy());
  
    before('cleanup', () => db.raw('TRUNCATE TABLE videos'));
  
    afterEach('cleanup', () => db.raw('TRUNCATE TABLE videos'));
  
    describe(`GET /api/videos/:dancetype/:dancelevel`, () => {
      beforeEach('insert videos', () => {
        return db
            .into('videos')
            .insert(testVideos)
      });
      //tests with specific user values to get the curated list
      it('responds with 200 and all of the questions', () => {
        const dancetype = 'Salsa';
        const level = 'intermediate';
        let testfilteredVideos = testVideos.filter(video => video.dancetype == dancetype && video.dancelevel == level);
        return supertest(app)
          .get(`/api/videos/${dancetype}/${level}`)
          .expect(200, testfilteredVideos);
      });
  
      
  
      
    });
  });

  module.exports = {
      makeVideosArray
  };