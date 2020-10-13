const bcrypt = require('bcryptjs');
//create the database seed users to test with
function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      email:'email1',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      email:'email2',
      password: 'password',
    }
  ]
}
//seed the users with the appropriate encrypted password
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into('dance_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('dance_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    );
};

module.exports =  {makeUsersArray, seedUsers};