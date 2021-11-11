const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
require('dotenv').config()

const urlBase = 'https://api.github.com';
const githubUserName = 'JCiroLo';
const repository = 'workshop-api-testing-js';

describe('Github Api Test', () => {
  console.log(process.env.ACCESS_TOKEN)
  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', async () => {
      const res = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      expect(res.status).to.equal(statusCode.OK);
      expect(res.body.description).equal('This is a Workshop about Api Testing in JavaScript');
    });
    it('Via OAuth2 Tokens by parameter', async () => {
      const res = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .set('access_token', process.env.ACCESS_TOKEN) 
        .set('User-Agent', 'agent')
      // I changed the query function to set function in the line 20 because the agent query need auth headers
      // to proccess the request correctly, it didnt work with the parameters.
      expect(res.status).to.equal(statusCode.OK);
      expect(res.body.description).equal('This is a Workshop about Api Testing in JavaScript');
    });
  });
});
