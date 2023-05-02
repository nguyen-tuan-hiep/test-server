import chai from 'chai';
import request from 'supertest';
import app from '../server/app.js';

const { expect } = chai;

describe('API Controller Tests', () => {
    describe('GET /category', () => {
        it('should return all categories', (done) => {
            request(app)
                .get('/category')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });
});