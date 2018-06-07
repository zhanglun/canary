class MusicService {
  constructor(app) {
    this.app = app;
  }

  async getVols(params = {page_size: 10, page: 1}) {
    let options = {};

    options.limit = params.page_size;
    options.offset = params.page_size * (params.page - 1);

    options.order_by = params.order_by || 'vol_number';
    options.order = params.order || 'desc';

    let result = await this.app.models.music.getVols(options);
    
    return result;
  }

  async getVolById(id) {
    let result = await this.app.models.music.getVolById(id);

    return result;
  }

  async getTags() {
    let result = await this.app.models.music.getTags();
    let list = [];

    let tagString = result.reduce((pre, cur, i, arr) => {
      pre.tags = pre.tags + cur.tags;

      return pre;
    }).tags;

    let tags = tagString.replace(/,/igm, '').split('#')
      .filter((tag) => {
        return tag;
      });

    return [...new Set(tags)];
  }
}

module.exports = MusicService;
