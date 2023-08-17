import chai from 'chai';
import request from 'supertest';
import app from '../app.js';

const { expect } = chai;

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
    }).timeout(10000);
  });

  let createdCustomerId = null;
  describe('POST /customers/create', () => {
    it('should create a new customer', (done) => {
      const customer = {
        name: 'John Doe',
        gender: 'Male',
        phone: '0433871340',
        address: '71 Laurel Circle',
        point: '0',
      };
      request(app)
        .post('/customers/create')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Customer was created!');
          createdCustomerId = res.body.customer.id;
          done();
        });
    });

    it('should return an error if name is missing', (done) => {
      const customer = {
        gender: 'Male',
        phone: '1234567',
        address: '71 Laurel Circle',
        point: '0',
      };
      request(app)
        .post('/customers/create')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Name is required');
          done();
        });
    });

    it('should return an error if phone is missing', (done) => {
      const customer = { name: 'Jane Doe' };
      request(app)
        .post('/customers/create')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Phone is required');
          done();
        });
    });

    it('should return an error if point is missing', (done) => {
      const customer = {
        name: 'Jane Doe',
        phone: '12345146',
        address: '71 Laurel Circle',
      };
      request(app)
        .post('/customers/create')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Point is required');
          done();
        });
    });

    it('should return an error if phone is already in use', (done) => {
      const customer = {
        name: 'Jane Doe',
        phone: '0433871340',
        point: '0',
      };
      request(app)
        .post('/customers/create')
        .send(customer)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Phone is already in use');
          done();
        });
    });

    after((done) => {
      if (createdCustomerId) {
        // Perform the deletion of the created customer here
        request(app)
          .delete(`/customers/${createdCustomerId}`)
          .end((err, res) => {
            // You might want to add assertions here to ensure deletion was successful
            done();
          });
      } else {
        done();
      }
    });
  });

  describe('DELETE /customers/:id', () => {
    it('should delete an existing customer', (done) => {
      request(app)
        .delete('/customers/18')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Customer was deleted!');
          done();
        });
    });

    it('should return an error if customer does not exist', (done) => {
      request(app)
        .delete('/customers/1000000')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Customer not found');
          done();
        });
    });
  });
});
