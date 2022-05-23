const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetAllCommentsUseCase = require('../../../../Applications/use_case/GetAllCommentsUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const ClientError = require('../../../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { title, body } = request.payload;
    const { id } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute({
      title,
      body,
      owner: id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const { threadId } = request.params;

    const thread = await getThreadUseCase.execute({
      threadId,
    });

    // console.log(thread);
    // console.log(comments);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
