const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error if use case payload not contain threadId', async () => {
    // Arrange
    const useCasePayload = {};
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error if use case payload not contain right type', async () => {
    // Arrange
    const useCasePayload = { threadId: 123 };
    const getThreadUseCase = new GetThreadUseCase({});

    // Action & Assert
    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'test',
      body: 'test',
      created_date: '2021-08-09T07:19:09.775Z',
      username: 'test',
    });

    const mockListComment = [
      new DetailComment({
        id: 'comment-123',
        content: 'isi comment',
        username: 'dicoding',
        created_date: '2021-08-09T07:19:09.775Z',
        is_delete: '0',
      }),
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getAllComments = jest.fn()
      .mockImplementation(() => Promise.resolve(mockListComment));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(useCasePayload);
    // console.log(detailThread);

    // Assert
    expect(detailThread).toStrictEqual({ ...mockDetailThread, comments: mockListComment });
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getAllComments).toBeCalledWith(useCasePayload.threadId);
  });
});
