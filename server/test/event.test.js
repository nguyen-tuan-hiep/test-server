import chai from 'chai';
import request from 'supertest';
import app from '../app.js';

const { expect } = chai;

describe('API Controller Tests', () => {
  describe('DELETE /event/:id', () => {
    it('should delete an existing event', (done) => {
      request(app)
        .delete('/event/1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Event was deleted!');
          done();
        });
    });

    it('should return an error if event does not exist', (done) => {
      request(app)
        .delete('/event/99999999')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Customer not found');
          done();
        });
    });
  });
});
