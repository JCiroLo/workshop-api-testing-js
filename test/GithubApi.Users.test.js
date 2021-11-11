const agent = require('superagent');
const chai = require('chai');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

describe('Query parameters test', () => {
  describe('Check 10 users', () => {
    let res;
    before( async () => {
      res = await agent.get(`${baseUrl}/users`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN)
        .query({ per_page: 10 });
    });

    it('Then there should be 10 users ', () => {        
      expect(res.body.length).to.equal(10);
    }); 
  });

  describe('Check 50 users', () => {
    let res;
    before( async () => {
      res = await agent.get(`${baseUrl}/users`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN)
        .query({ per_page: 50 });
    });

    it('Then there should be 50 users ', () => {        
      expect(res.body.length).to.equal(50);
    });
  });
});