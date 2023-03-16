'use strict';
// const dayjs = require('dayjs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const BaseController = require('./base');
const createRule = {
  email: {
    type: 'email',
  },
  username: {
    type: 'string',
  },
  password: {
    type: 'string',
  },
  captche: {
    type: 'string',
  },
  emailcode: {
    type: 'string',
  },
};
const loginRule = {
  email: {
    type: 'email',
  },
  password: {
    type: 'string',
  },
  captche: {
    type: 'string',
  },
};
const HashSlat = '@yanhongyi';

class AuthController extends BaseController {
  // 注册
  async register() {
    const { ctx } = this;
    try {
      ctx.validate(createRule);
    } catch (e) {
      return this.error('参数校验失败', -1, e.error);
    }
    const { email, username, password, captche, emailcode } = ctx.request.body;

    if (captche.toUpperCase() !== ctx?.session?.captche?.toUpperCase()) {
      return this.error('验证码错误');
    }

    if (emailcode.toUpperCase() !== ctx?.session?.emailcode?.toUpperCase()) {
      return this.error('邮箱验证码错误');
    }

    if (await this.checkEmail(email)) {
      return this.error('邮箱重复');
    }

    const ret = await ctx.model.User.create({
      email,
      password: md5(password + HashSlat),
      username,
    });
    this.success(username + '注册成功');
  }

  async checkEmail(email) {
    const user = this.ctx.model.User.findOne({ email });
    return user;
  }

  // 修改用户信息
  async update() {
    const { ctx } = this;
    const data = ctx.request.body;
    const username = data.username;
    const newPassword = data.newPassword;
    const oldPassword = data.oldPassword;
    const id = data.id;
    const result = await ctx.service.auth.update({ username, id, newPassword, oldPassword });
    ctx.body = {
      data: result,
    };
    ctx.status = 200;
  }

  // 登录
  async login() {
    const { ctx, app } = this;

    try {
      ctx.validate(loginRule);
    } catch (e) {
      return this.error('参数校验失败', -1, e.error);
    }

    const { email, password, captche } = ctx.request.body;

    if (captche.toUpperCase() !== ctx?.session?.captche?.toUpperCase()) {
      return this.error('验证码错误');
    }
    const user = await ctx.model.User.findOne({
      email, password: md5(password + HashSlat),
    });
    console.log(user);

    if (!user) {
      return this.error('用户名密码错误');
    }

    const token = jwt.sign({
      _id: user._id,
      email: user.email,
    }, app.config.jwt.secret, {
      expiresIn: '3h',
    });
    this.success({ token, email, username: user.username });

  }

  // 注销
  async logout() {
    const { ctx } = this;
    ctx.service.auth.logout();
  }

  // 注销
  async info() {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({
      email: ctx.state.email,
      _id: ctx.state.userid,
    });
    console.log(user);
    if (user) {
      return this.success(user);
    }
    return this.error('用户不存在');
  }

}


module.exports = AuthController;
