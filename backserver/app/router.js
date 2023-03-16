'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ app });
  router.get('/', controller.home.index);


  // 事件管理接口
  router.group({
    name: 'event',
    prefix: '/event',
  }, router => {
    const { queryEventList, addEvent, deleEvent, updateEvent } = controller.event;
    router.get('/queryEventList', jwt, queryEventList);
    router.post('/addEvent', jwt, addEvent);
    router.post('/deleEvent', jwt, deleEvent);
    router.post('/updateEvent', jwt, updateEvent);
  });

  // 部分工具接口
  router.group({
    name: 'util',
    prefix: '/util',
  }, router => {
    const { captche, sendCode, uploadFile } = controller.util;
    // 获取验证码
    router.get('/captche', captche);
    router.get('/sendCode', sendCode);
    router.post('/uploadFile', uploadFile);

  });

  // 用户相关接口
  router.group({
    name: 'auth',
    prefix: '/auth',
  }, router => {
    const { register, update, login, logout, info } = controller.auth;
    router.post('/register', register);
    router.post('/update', jwt, update);
    router.post('/login', login);
    router.post('/logout', jwt, logout);
    router.get('/info', jwt, info);
  });
};
