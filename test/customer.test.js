const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../server/app');

describe('API Controller Tests', () => {
  describe('GET /customers', () => {
    it('should return all customers', (done) => {
      request(app)
        .get('/customers')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /customers', () => {
    it('should create a new customer', (done) => {
      const customer = { name: 'John Doe' };
      request(app)
        .post('/customers')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Customer was created!');
          done();
        });
    });

    it('should return an error if name is missing', (done) => {
      const customer = {};
      request(app)
        .post('/customers')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Name is required');
          done();
        });
    });
  });

  describe('PUT /customers/:id', () => {
    it('should update an existing customer', (done) => {
      const customer = { name: 'Michel' };
      request(app)
        .put('/customers/6')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Customer was updated!');
          expect(res.body.customer).to.be.an('object');
          done();
        });
    });

    it('should return an error if name is missing', (done) => {
      const customer = {};
      request(app)
        .put('/customers/1')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Name is required');
          done();
        });
    });

    it('should return an error if customer does not exist', (done) => {
      const customer = { name: 'Jane Doe' };
      request(app)
        .put('/customers/999')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Customer not found');
          done();
        });
    });
  });

  describe('GET /customers/:id', () => {
    it('should return a single customer', (done) => {
      request(app)
        .get('/customers/5')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should return an error if customer does not exist', (done) => {
      request(app)
        .get('/customers/999')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Customer not found');
          done();
        });
    });
  });

  describe('DELETE /customers/:id', () => {
    it('should delete an existing customer', (done) => {
      request(app)
        .delete('/customers/4')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Customer was deleted!');
          done();
        });
    });

    it('should return an error if customer does not exist', (done) => {
      request(app)
        .delete('/customers/9999')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Customer not found');
          done();
        });
    });
  });
});
