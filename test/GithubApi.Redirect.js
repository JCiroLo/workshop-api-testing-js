const agent = require('superagent');
const chai = require('chai');
const statusCode = require('http-status-codes');
chai.use(require('chai-subset'));

const baseUrl = 'https://github.com';

const { expect } = chai;;

describe('HEAD Mehtods', () => {
  let axuRes;
  describe('Check page with HEAD', () => {
    before(async() => {
      try {
        await agent.head(`${baseUrl}/aperdomob/redirect-test`);
      } catch (res) {
        axuRes = res;
      }
    });
    
    it('The the page should redirect', () => {
      expect(axuRes.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(axuRes.response.headers.location).to.equal(`${baseUrl}/aperdomob/new-redirect-test`);
    });
  });

  describe('When checking the page with GET', () => {
    let res;
    before(async() => {
      res = await agent.get(`${baseUrl}/aperdomob/redirect-test`);
    });

    it('The the page should redirect', async () => {      
      expect(res.status).to.equal(statusCode.OK);
    });
  });
});