'use strict';

const BaseController = require('./base');
const svgCaptcha = require('svg-captcha');
const path = require('path');
const fse = require('fs-extra');

const emailRule = {
  email: {
    type: 'email',
    require: true,
  },
};

class UtilController extends BaseController {
  async captche() {
    const { ctx } = this;
    const captcha = svgCaptcha.create({ size: 4 });
    console.log('captcha =>' + captcha.text);
    ctx.session.captche = captcha.text;
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }

  // 发送邮箱验证码
  async sendCode() {
    const { ctx } = this;
    try {
      ctx.validate(emailRule, ctx.query);
    } catch (e) {
      return this.error('email必传', -1, e);
    }
    const { email } = ctx.query;
    const code = Math.random().toString().slice(2, 6);
    ctx.session.emailcode = code;
    console.log('【邮件】' + email + ', 【验证码】 ' + code);

    const subject = '【验证码】todolist';
    const message = code;

    const html = `<div>
      <p>
        你的验证码是：<span style="color:'blue';fontsize:'20px'">${message}</span>
      </p>
      
    </div>`;

    const hasSend = await ctx.service.tools.sendEmail(email, subject, subject, html);
    if (hasSend) {
      return this.message('发送成功');
    }
    return this.error('发送失败');
  }

  async uploadFile() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const fileName = file.filename;
    const url = '/public/' + fileName;

    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/avater/' + fileName);
    this.message({ url, fileName });
  }
}

module.exports = UtilController;
