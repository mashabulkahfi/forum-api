/* eslint-disable camelcase */
const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, owner, thread_id } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const createdDate = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments(id, content, owner, created_date, thread_id) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, createdDate, thread_id],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getAllComments(threadId) {
    const query = {
      text: `SELECT c.id, username, created_date, content, is_delete
      FROM comments as c INNER JOIN users as u
        ON c.owner = u.id
      WHERE thread_id = $1
      ORDER BY created_date`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const comments = result.rows.map((comment) => new DetailComment(comment));
    return comments;
  }

  async checkAvailabilityComment({ threadId, commentId }) {
    const query = {
      text: `SELECT id FROM comments 
      WHERE id = $1 AND thread_id = $2`,
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak tersedia');
    }
  }

  async checkOwnershipComment({ threadId, commentId, owner }) {
    const query = {
      text: `SELECT id FROM comments 
      WHERE id = $1 AND thread_id = $2 AND owner = $3`,
      values: [commentId, threadId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('comment tidak bisa dihapus karena bukan pemilik comment');
    }
  }

  async deleteComment({ threadId, commentId, owner }) {
    const query = {
      text: `UPDATE comments 
      SET is_delete = 1
      WHERE id = $1 AND thread_id = $2 AND owner = $3
      RETURNING id`,
      values: [commentId, threadId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
