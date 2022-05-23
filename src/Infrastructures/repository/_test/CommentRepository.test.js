const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const addComment = new AddComment({
        content: 'isi comment',
        owner: 'user-123',
        thread_id: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const addComment = new AddComment({
        content: 'isi comment',
        owner: 'user-123',
        thread_id: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'isi comment',
        owner: 'user-123',
      }));
    });
  });

  describe('getAllComments function', () => {
    it('should persist get comments', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      // Action
      const comments = await commentRepositoryPostgres.getAllComments(threadId);

      // Assert
      expect(comments).toHaveLength(1);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw not found error when there is no comment', async () => {
      // Arrange
      // await UsersTableTestHelper.addUser({ id: 'user-123' });
      // await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      // await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const commentId = 'comment-124';

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAvailabilityComment({ threadId, commentId }))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw not found error when there is a comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAvailabilityComment({ threadId, commentId }))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkOwnershipComment function', () => {
    it('should throw authorization error when the owner is not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-124';

      // Action & Assert
      await expect(commentRepositoryPostgres.checkOwnershipComment({ threadId, commentId, owner }))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw authorization error when the owner is match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';

      // Action & Assert
      await expect(commentRepositoryPostgres.checkOwnershipComment({ threadId, commentId, owner }))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should persist delete the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';

      // Action
      // eslint-disable-next-line max-len
      await commentRepositoryPostgres.deleteComment({ threadId, commentId, owner });
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);

      // Action & Assert
      // expect(comments[0].is_delete).t(1);
      // const comments = await commentRepositoryPostgres.getComments(threadId);
      // expect(testComment.content).toEqual('**komentar telah dihapus**');
      expect(comments[0].is_delete).toEqual('1');
    });
  });
});
