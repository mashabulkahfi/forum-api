const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentsUseCase = require('../DeleteCommentUseCase');
const GetAllCommentsUseCase = require('../GetAllCommentsUseCase');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain needed', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentsUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data specification', async () => {
    // Arrange
    const useCasePayload = { threadId: 123, commentId: 'comment-123', owner: 'user-123' };
    const deleteCommentUseCase = new DeleteCommentsUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const expectedGetThread = {
      id: 'thread-123',
      title: 'test',
      body: 'test',
      created_date: '2021-12-06',
      username: 'test',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkOwnershipComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentsUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    // expect(thread).toStrictEqual(expectedGetThread);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.checkOwnershipComment).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload);
  });
});
