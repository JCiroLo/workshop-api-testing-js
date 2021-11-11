const agent = require('superagent');
const chai = require('chai');
const statusCode = require('http-status-codes');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

describe('POST and PATCH methods', () => {
  let user;
  describe('Check if the logged user has one public repo', () => { 
    let res       
    before( async () => {
      res = await agent.get(`${baseUrl}/user`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      user = res.body
    });

    it('Then a user should be logged', async() => {
      expect(res.status).to.equal(statusCode.OK);
    });

    it('Then the user has at least one public repo', () => {
      expect(user.public_repos).to.be.above(0);
    });
  });
  
  let repo
  describe('Get user first repo', () => {
    before( async () => {
      const res = await agent.get(user.repos_url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN)
      repo = res.body[0];
    });
    it('Then there should be a repo', () => {
      expect(repo).to.not.equal(undefined);
    });
  });
  let issue;
  describe('Create an issue', () => {
    before( async () => {
      const res = await agent.post(`${baseUrl}/repos/${user.login}/${repo.name}/issues`)
        .send({ title: 'This is an issue' })
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      issue = res.body;
    });

    it('Then an issue should be created', () => {
      expect(issue.title).to.equal('This is an issue');
      expect(issue.body).to.equal(null);
    });
  });

  describe('Modify the issue', () =>{
    let modIssue;
    before( async() => {
      const res = await agent.patch(`${baseUrl}/repos/${user.login}/${repo.name}/issues/${issue.number}`)
        .send({ body: 'This is the body of the issue' })
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      modIssue = res.body;
    });

    it('Then an issue should be modified', () => {
      expect(modIssue.title).to.equal(issue.title);
      expect(modIssue.body).to.equal('This is the body of the issue');
    });
  });
});