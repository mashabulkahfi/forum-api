/* eslint-disable camelcase */
const AddComment = require('../AddComment');

describe('an AddComment entities', () => {
  it('should throw error when payload did not certain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      thread_id: 'thread-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 'user-123',
      thread_id: 'thread-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'isi comment',
      owner: 'user-123',
      thread_id: 'thread-123',
    };

    // Action
    const { content, owner, thread_id } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(thread_id).toEqual(payload.thread_id);
  });
});
