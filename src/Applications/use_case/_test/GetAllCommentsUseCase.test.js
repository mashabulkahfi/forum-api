const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetAllCommentsUseCase = require('../GetAllCommentsUseCase');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetAllCommentUseCase', () => {
  it('should throw error if use case payload not contain threadId', async () => {
    // Arrange
    const useCasePayload = {};
    const getAllCommentUseCase = new GetAllCommentsUseCase({});

    // Action & Assert
    await expect(getAllCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_COMMENTS_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error if use case payload not meet data specification', async () => {
    // Arrange
    const useCasePayload = { threadId: 123 };
    const getAllCommentUseCase = new GetAllCommentsUseCase({});

    // Action & Assert
    await expect(getAllCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_COMMENTS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get all comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expectedGetThread = {
      id: 'thread-123',
      title: 'test',
      body: 'test',
      created_date: '2021-12-06',
      username: 'test',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getAllComments = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetThread));

    /** creating use case instance */
    const getCommentUseCase = new GetAllCommentsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const comments = await getCommentUseCase.execute(useCasePayload);

    // Assert
    // expect(thread).toStrictEqual(expectedGetThread);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getAllComments).toBeCalledWith(useCasePayload.threadId);
  });
});
