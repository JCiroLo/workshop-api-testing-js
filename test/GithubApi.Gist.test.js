const agent = require('superagent');
const chai = require('chai');
const statusCode = require('http-status-codes');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

const jsCode = `
function wait(method, time) {
  return new Promise((resolve) => {
    setTimeout(resolve(method()), time);
  });
}
`;

describe('DELETE Methods', () => {    
  const createGist = {
    description: 'this is an example about promise',
    public: true,
    files: {
      'promise.js': {
        content: jsCode
      }
    }
  };
  let gist;
  describe('Create GIST', () => {        
    let res;    
    before(async() => {
      res = await agent.post(`${baseUrl}/gists`)
        .send(createGist)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      gist = res.body;
    });

    it('Then a gist should be created', () => {        
      expect(gist).to.containSubset(createGist);
      expect(res.status).to.equal(statusCode.CREATED);
    });
  });
  
  describe('Check if GIST exists', () => {
    let res;
    before(async() => {
      res = await agent.get(gist.url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Then the gist should exist', () => {
      expect(res.status).to.equal(statusCode.OK);
    });
  });

  describe('Delete GIST', () => {
    let res;
    before(async() => {
      res = await agent.del(gist.url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });
    
    it('Then the gist should be deleted', () => {      
      expect(res.status).to.equal(statusCode.NO_CONTENT);
    });
  });

  describe('Check if GIST exists again', () => {
    let resStatus;
    before(async() => {
      try {
        await agent.get(gist.url)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      } catch (res) {
        resStatus = res.status;
      }
    });
    
    it('Then the gist should not exist anymore', () => {  
      expect(resStatus).to.equal(statusCode.NOT_FOUND);
    });
  });
});