const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../app')
const users = require('./users.fixtures.js')

describe('Auth Endpoints', function() {
  let db

  const testUsers = users.makeUsersArray()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => db.raw('TRUNCATE TABLE dance_users'))

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE dance_users'))

  //test the login functionality
  describe(`POST /api/auth/login`, () => {
    beforeEach('insert users', () =>
      users.seedUsers(
        db,
        testUsers,
      )
    )

    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      }
      //test when username or password is missing
      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
    //test with an incorrect username
    it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
      const userInvalidUser = { user_name: 'user-not', password: 'existy' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect user_name or password` })
    })

    //test with an incorrect password
    it(`responds 400 'invalid user_name or password' when bad password`, () => {
      const userInvalidPass = { user_name: testUser.user_name, password: 'incorrect' }
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPass)
        .expect(400, { error: `Incorrect user_name or password` })
    })
    //tests when the credentials are valid
    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        user_name: testUser.user_name,
        password: testUser.password

      }
      const expectedToken = jwt.sign(
        { user_id: testUser.id,
          full_name: testUser.full_name, 
          nickname: testUser.nickname,
          email: testUser.email   },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_name,
          algorithm: 'HS256',
        }
      )
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        })
    })
  })
  describe(`POST /api/user/profile`, () => {
    beforeEach('insert users', () =>
      users.seedUsers(
        db,
        testUsers,
      )
    )
    //test when a succesful call is made to profile route
    it(`responds 200 with a user message and a user object`, () => {
  
      const expectedToken = jwt.sign(
        { user_id: testUser.id,
          full_name: testUser.full_name, 
          nickname: testUser.nickname,
          email: testUser.email   },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_name,
          algorithm: 'HS256',
        }
      )

      const expectedUserObject = {
        sub: testUser.user_name,
        user_id: testUser.id,
        full_name: testUser.full_name, 
        nickname: testUser.nickname,
        email: testUser.email,
      }
      //tests the values returned by the profile route
      return supertest(app)
        .post('/api/user/profile')
        .set('Authorization', 'Bearer '+ expectedToken)
        .expect(200)
        .expect(res => {
          expect(res.body.message).to.eql('You made it to the secure route')
          expect(res.body.user.sub).to.eql(expectedUserObject.sub)
          expect(res.body.user.user_id).to.eql(expectedUserObject.user_id)
          expect(res.body.user.full_name).to.eql(expectedUserObject.full_name)
          expect(res.body.user.nickname).to.eql(expectedUserObject.nickname)
          expect(res.body.user.email).to.eql(expectedUserObject.email)
        })
    })
  })
})