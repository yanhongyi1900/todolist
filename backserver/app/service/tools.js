const BaseService = require('./base');
const nodemailer = require('nodemailer');
const userEmail = '18107993872@163.com';
const pass = 'NMADGKULAKFRDJKP';

const transporter = nodemailer.createTransport({
  service: '163',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass,
  },
});

class ToolsService extends BaseService {
  async sendEmail(email, subject, text, html) {
    const mailOption = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(mailOption);
      return true;
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }
}

module.exports = ToolsService;
