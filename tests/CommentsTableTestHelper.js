/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'isi comment', owner = 'user-123', createdDate = new Date().toISOString(), thread_id = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comments(id, content, owner, created_date, thread_id) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, owner, createdDate, thread_id],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
