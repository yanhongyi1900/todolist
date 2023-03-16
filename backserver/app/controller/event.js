'use strict';
const dayjs = require('dayjs');
const { Controller } = require('egg');

const queryRule = {
  userID: { type: 'string', require: true, desc: 'userID必传' },
};
const addRule = {
  userID: {
    type: 'string', require: true, desc: 'userID必传',
  },
};

const deleRule = {
  id: {
    type: 'string', require: true, desc: 'id必传',
  },
};

const updateRule = {
  id: {
    type: 'number', require: true, desc: 'id必传',
  },
};
class EventController extends Controller {
  async queryEventList() {
    const { ctx } = this;
    const data = ctx.query;
    ctx.validate(queryRule, data);
    const page = (data.page || 1) - 1;
    const pageSize = data.pageSize || 10;
    const userID = data.userID || null;
    const levelID = data.levelID || null;
    const categoryID = data.categoryID || null;
    const statusID = data.statusID || null;
    const resultList = await ctx.service.event.list(page, pageSize, userID, levelID, categoryID, statusID);
    ctx.body = { data: resultList };
    ctx.status = 200;
  }

  async addEvent() {
    const { ctx } = this;
    const data = ctx.request.body;
    // ctx.validate(addRule, data);
    const content = data.content || '';
    const userID = data.userID || null;
    const categoryID = data.categoryID || 3;
    const levelID = data.levelID || 4;
    const statusID = data.statusID || 5;
    const remindTime = data.remindTime || dayjs().format('YYYY/MM/DD HH:mm:ss');

    const result = await ctx.service.event.add({
      content, userID, levelID, categoryID, statusID, remindTime,
    });
    if (result) {
      ctx.body = {
        data: {
          msg: '添加成功',
        },
      };
      ctx.status = 200;
    }
  }

  async deleEvent() {
    const { ctx } = this;
    const data = ctx.request.body;
    // ctx.validate(deleRule, data);
    const result = await ctx.service.event.dele(data);

    if (result) {
      ctx.body = {
        data: {
          msg: '删除成功',
        },
      };
      ctx.status = 200;
    }
  }

  async updateEvent() {
    const { ctx } = this;
    const data = ctx.request.body;
    // ctx.validate(updateRule, data);
    const id = data.id;
    const content = data.content || null;
    const categoryID = data.categoryID || null;
    const levelID = data.levelID || null;
    const statusID = data.statusID || null;
    const remindTime = data.remindTime || null;
    const updateTime = dayjs().format('YYYY/MM/DD HH:mm:ss');

    const result = await ctx.service.event.update({
      id, content, categoryID, levelID, statusID, remindTime, updateTime,
    });

    if (result) {
      ctx.body = {
        data: {
          msg: '更新成功',
        },
      };
      ctx.status = 200;
    }
  }
}

module.exports = EventController;
