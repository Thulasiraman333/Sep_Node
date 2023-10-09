let chai = require('chai');
let chaihttp = require('chai-http');
let expect = chai.expect;
chai.use(chaihttp);

describe('Testing Api',()=>{
  it('should return 200 for health',()=>{
    chai.request('http:127.0.0.1:7710')
    .get('/health')
    .then((res)=>{
      expect(res).to.have.status(200);
      expect(res.text).to.equal('Health ok');
      done()
    })
    .catch((err)=>{
      throw err;
    })
  })
})