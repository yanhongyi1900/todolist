/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

const path = require('path');
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1677245000918_6158';

  // add your middleware config here
  config.middleware = [];

  // 允许文件上传
  config.multipart = {
    mode: 'file',
    whitelist: () => true,
  };

  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public');

  // add your user config here
  const userConfig = {
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: 'localhost',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '000000',
        // 数据库名
        database: 'todolist',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/todolist',
        //  你数据库的地址/仓库名字；
        options: {
          useNewUrlParser: true,
        },
      },
    },
    jwt: {
      secret: '@yanhongyi',
    },
    nodemailer: {
      userEmail: '18107993872@163.com',
      pass: 'NMADGKULAKFRDJKP',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
