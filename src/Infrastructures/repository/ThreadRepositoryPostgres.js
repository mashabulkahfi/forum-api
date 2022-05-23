const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const createdDate = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads(id, title, body, owner, created_date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, createdDate],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak tersedia');
    }
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT t.id, title, body, created_date, username  
      FROM threads as t INNER JOIN users as u
        ON t.owner = u.id
      WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const thread = { ...result.rows[0] };
    return new DetailThread(thread);
  }
}

module.exports = ThreadRepositoryPostgres;
