const agent = require('superagent');
const chai = require('chai');
const md5 = require('md5');
const statusCode = require('http-status-codes');
const { assert } = require('chai');
chai.use(require('chai-subset'));

const baseUrl = 'https://api.github.com';

const { expect } = chai;

describe('GET Methods', () => {
  const username = 'aperdomob';
  const repo = 'jasmine-awesome-report';
  describe('Check user', () => {
    it('Then the user should be checked', async () => {
      const res = await agent.get(`${baseUrl}/users/${username}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCES_TOKEN)
      expect(res.status).to.equal(statusCode.StatusCodes.OK);
      expect(res.body.name).to.equal('Alejandro Perdomo');
      expect(res.body.company).to.equal('Perficient Latam');
      expect(res.body.location).to.equal('Colombia');
    });
  });
  
  describe('Check repository', () => {
    it(`Then the ${repo} repository should be checked`, async () => {
      const res = await agent.get(`${baseUrl}/users/${username}/repos`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN)
      expect(res.status).to.equal(statusCode.OK);
      const repository = res.body.find((repos) => repos.name === repo);
      expect(repository.name).to.equal(repo);
      expect(repository.private).to.equal(false);
      expect(repository.description).to.equal('An awesome html report for Jasmine');
    });
  });
  
  describe('Donwload ZIP repository', () => {
    const md5ToCheck = '3449c9e5e332f1dbb81505cd739fbf3f';
    let zip;
    before( async () => {
      zip = await agent.get(`https://github.com/${username}/${repo}/archive/master.zip`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .buffer(true);
    });
    it('then the repository should be downloaded', () => {
      expect(md5(zip)).to.equal(md5ToCheck);
    });
  });

  describe('Check and download README', () => {
    const readmeData = {
      name: 'README.md',
      path: 'README.md',
      sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
    };
    
    let readme;
    let files;
    before( async () => {
      const { body } = await agent.get(`${baseUrl}/repos/${username}/${repo}/contents/`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      files = body
      readme = files.find((file) => file.name === 'README.md');
    });

    it('Then the README file should be checked', async () => {            
      assert.exists(readme);
      expect(readme).containSubset(readmeData);
    });
    const md5ToCheck = '97ee7616a991aa6535f24053957596b1';
    let content;

    before( async () => {            
        const { text } = await agent.get(readme.download_url);
        content = text
      });
    it('Then the README file should be downloaded', () => {          
      expect(md5(content)).to.equal(md5ToCheck);
    });
  });
});
  