let chai = require('chai');
let chaihttp = require('chai-http');
let expect = chai.expect;
chai.use(chaihttp);

describe('Testing Api',()=>{
  it('should return 200 for users',()=>{
    chai.request('http:127.0.0.1:7710')
    .get('/users')
    .then((res)=>{
      expect(res).to.have.status(200);
      done()
    })
    .catch((err)=>{
      throw err;
    })
  })

  it('should return 200 for health',()=>{
    chai.request('http:127.0.0.1:7710')
    .get('/user')
    .then((res)=>{
      expect(res).to.have.status(404);
      done()
    })
    .catch((err)=>{
      throw err;
    })
  })
  it('should return 200 for adduser',()=>{
    chai.request('http:127.0.0.1:7710')
    .post('/addUser')
    .send({"name":"Testing Sep","isActive":true})
    .then((res)=>{
      expect(res).to.have.status(202);
      done()
    })
    .catch((err)=>{
      throw err;
    })
  })
})