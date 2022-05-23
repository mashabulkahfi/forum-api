/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');
const ThreadsTableTestHelper = require('./ThreadsTableTestHelper');

const Server2TestHelper = {
  async getAccessToken() {
    const users = await UsersTableTestHelper.findUsersById('user-123');
    if (users.length < 1) {
      const payload = {
        id: 'user-123',
        username: 'myUser',
        password: 'myPassword',
        fullname: 'My User',
      };
      await UsersTableTestHelper.addUser(payload);
    }
    const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
    if (threads.length < 1) {
      const payload = {
        id: 'thread-123',
        title: 'abc',
        body: 'isi abc',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(payload);
    }
    return Jwt.token.generate(
      {
        id: 'thread-123',
        title: 'abc',
        body: 'isi abc',
        owner: 'user-123',
      },
      process.env.ACCESS_TOKEN_KEY,
    );
  },
};

module.exports = Server2TestHelper;
