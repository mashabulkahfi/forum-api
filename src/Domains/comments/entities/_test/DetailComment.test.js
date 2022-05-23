/* eslint-disable camelcase */
const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      created_date: 1,
      content: 123,
      is_delete: 1,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailComment object correctly when is_delete = 0', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'testuser',
      created_date: '2021-08-08T07:19:09.775Z',
      content: 'isi comment',
      is_delete: '0',
    };

    // Action
    const {
      id, username, date, content,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.created_date);
    expect(username).toEqual(payload.username);
  });

  it('should create detailComment object correctly when is_delete = 1', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'testuser',
      created_date: '2021-08-08T07:19:09.775Z',
      content: 'isi comment',
      is_delete: '1',
    };

    // Action
    const {
      id, username, date, content,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(date).toEqual(payload.created_date);
    expect(username).toEqual(payload.username);
  });
});
