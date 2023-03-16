const Service = require('egg').Service;
const dayjs = require('dayjs');
class AuthService extends Service {
  async register(params) {
    const isRegistered = await this.app.mysql.get('todolist.account', { email: params.email });
    if (isRegistered != null) {
      return {
        msg: '重复邮箱，已注册',
      };
    }
    const result = await this.app.mysql.query(`
    INSERT  INTO todolist.account 
    (username,email ,password) 
    VALUES 
    ("${params.username}","${params.email}","${params.password}");`);
    if (result) {
      return {
        msg: '注册成功，请使用邮箱登录',
      };
    }
  }

  async update(params) {
    const user = await this.app.mysql.get('todolist.account', { id: params.id });
    if (user.password !== params.oldPassword) {
      return {
        msg: '密码错误',
      };
    }

    const result = await this.app.mysql.query(`
    UPDATE todolist.account a
    SET ${'updateTime = "' + dayjs().format('YYYY/MM/DD HH:mm:ss') + '"'}
    ${params.username ? ',username = "' + params.username + '"' : ''}${params.newPassword ? ',password = "' + params.newPassword + '"' : ''}
    WHERE id=${params.id};`);

    if (result) {
      return {
        msg: '修改用户信息成功',
      };
    }
  }
}

module.exports = AuthService;
