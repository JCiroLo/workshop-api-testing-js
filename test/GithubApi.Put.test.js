const agent = require('superagent');
const chai = require('chai');
const md5 = require('md5');
const statusCode = require('http-status-codes');
const { assert } = require('chai');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

describe('PUT Methods', () => {
  let res;
  describe('Follow the user aperdomob', () => {
    before( async () => {
      res = await agent.put(`${baseUrl}/user/following/aperdomob`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });
    it('then the user aperdomob should be followed', () => {
      expect(res.status).to.eql(statusCode.NO_CONTENT);
      expect(res.body).to.eql({});
    });
  });

  describe('Check user in the user list', () => {
    let user;
    before( async () => {
      const res = await agent.get(`${baseUrl}/user/following`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      user = res.body.find(list => list.login === 'aperdomob');
    });

    it('then the user aperdomob is followed', () => assert.exists(user));
  });

  describe('Check idempotence', () => {
    let res;
    describe('Follow user aperdomob again', () => {
      before( async () => {
        res = await agent.put(`${baseUrl}/user/following/aperdomob`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });
      it('then the user aperdomob should be followed', () => {
        expect(res.status).to.eql(statusCode.NO_CONTENT);
        expect(res.body).to.eql({});
      });
    });

    describe('Check user list again', () => {
      let user;
      before( async() => {
        const res = await agent.get(`${baseUrl}/user/following`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
        user = res.body.find(list => list.login === 'aperdomob');
      });
      it('then the user aperdomob is followed', () => assert.exists(user));
    });
  });    
});