/* eslint-disable camelcase */
class AddComment {
  constructor({ content, owner, thread_id }) {
    if (!content || !owner || !thread_id) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof thread_id !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.content = content;
    this.owner = owner;
    this.thread_id = thread_id;
  }
}

module.exports = AddComment;
