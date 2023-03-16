const Service = require('egg').Service;

class EventService extends Service {
  async list(page, pageSize, userID, levelID, categoryID, statusID) {

    let options = {
      userID,
    };

    if (levelID) {
      options = { ...options, levelID };
    }
    if (categoryID) {
      options = { ...options, categoryID };
    }
    if (statusID) {
      options = { ...options, statusID };
    }

    const eventList = await this.app.mysql.query(`
    SELECT
      a.id,
      a.content,
      e.username user,
      b.levelName level,
      d.statusName status,
      c.categoryName category,
      DATE_FORMAT(a.remindTime,'%Y-%m-%d %H:%i:%S') remindTime,
	    DATE_FORMAT(a.createTime,'%Y-%m-%d %H:%i:%S') createTime,
	    DATE_FORMAT(a.updateTime,'%Y-%m-%d %H:%i:%S') updateTime
    FROM
      todolist.event a
    INNER JOIN todolist.level b ON
      a.levelID = b.id
    INNER JOIN todolist.category c ON
      a.categoryID = c.id
    INNER JOIN todolist.status d ON
      a.statusID = d.id
    INNER JOIN todolist.account e ON
      a.userID = e.id 
    WHERE a.deleFlag = 0 ${options.userID ? 'AND a.userID =' + options.userID : ''}
    ${options.levelID ? 'AND a.levelID =' + options.levelID : ''}
    ${options.categoryID ? 'AND a.categoryID =' + options.categoryID : ''}
    ${options.statusID ? 'AND a.statusID =' + options.statusID : ''}
    ORDER BY updateTime DESC
    LIMIT ${page * pageSize + ',' + pageSize};`);
    return eventList;
  }

  async add(params) {
    const result = await this.app.mysql.query(`
      INSERT  INTO todolist.event 
      (userID,content,categoryID ,levelID ,statusID,remindTime,updateTime,createTime) 
      VALUES 
      (${params.userID},${JSON.stringify(params.content)},${params.categoryID},${params.levelID},${params.statusID},${JSON.stringify(params.remindTime)},now(),now())`);
    return result;
  }

  async dele(params) {
    const result = await this.app.mysql.query(`
    UPDATE todolist.event a
    SET deleFlag  = 1
    WHERE id=${params.id};`);
    return result;
  }

  async update(params) {
    const result = await this.app.mysql.query(`
    UPDATE todolist.event a
    SET  ${params.updateTime ? 'updateTime="' + params.updateTime + '"' : ''}
      ${params.content ? ',content="' + params.content + '"' : ''}
      ${params.levelID ? ',levelID=' + params.levelID : ''}
      ${params.categoryID ? ',categoryID=' + params.categoryID : ''}
      ${params.statusID ? ',statusID=' + params.statusID : ''}
      ${params.remindTime ? ',remindTime="' + params.remindTime + '"' : ''}
    WHERE id=${params.id};`);
    return result;
  }
}

module.exports = EventService;
