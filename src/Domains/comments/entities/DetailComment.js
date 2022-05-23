/* eslint-disable no-undef */
/* eslint-disable camelcase */
class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.created_date;
    this.content = (payload.is_delete === '0') ? payload.content : '**komentar telah dihapus**';
  }

  _verifyPayload(payload) {
    const {
      id, username, created_date, content, is_delete,
    } = payload;

    if (!id || !username || !content || !created_date || !is_delete) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof content !== 'string'
      || typeof created_date !== 'string'
      || typeof username !== 'string'
      || typeof is_delete !== 'string'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
