const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comment',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};
