import chai from 'chai';
import request from 'supertest';
import app from '../server/app.js';

const { expect } = chai;

describe('API Controller Tests', () => {
    describe('GET /dish', () => {
        it('should return all dishes', (done) => {
            request(app)
                .get('/dish')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body["data"]).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /dish/:id', () => {
        it('should return a single dish with given id', (done) => {
            let id = 1;
            request(app)
                .get('/dish/' + id)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body["data"]).to.be.an('array');
                    done();
                });
        });
        it('should return an error if dish does not exist', (done) => {
            request(app)
                .get('/dish/99999999')
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.message).to.equal('Dish not found');
                    done();
                });
        });
    });

    describe('POST /dish/search/', () => {
        it('should return an error if the request.body does not contain field name', (done) => {
            let body = {
                name: ""
            };
            request(app)
                .post('/dish/search')
                .send(body)
                .end((err, res) => {
                    expect(res.status).to.equal(400)
                    expect(res.body.message).to.equal('Name is required');
                    done();
                })

        })
        it('should return one or more dishes whose name includes the specified string', (done) => {
            let body = {
                name: "burger"
            };
            request(app)
                .post('/dish/search')
                .send(body)
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body["data"]).to.be.an('array')
                    done();
                })
        });
    });

    describe('POST /dish/create/', () => {
        it('should create a new dish', (done) => {
            let body = {
                dish_name: "Chicken Sandwich",
                discription: "Lemon pepper fried chicken sandwich, honey mustard mayo",
                price: 160.00,
                dish_status: 0,
                category_id: 1,
                menu_id: 1
            };
            request(app)
                .post('/dish/create')
                .send(body)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    // expect(res.body["status"]).to.equal('success');
                    expect(res.body["message"]).to.equal('Dish was created!')
                    expect(res.body["data"]).to.be.an('object')
                    done();
                })
        });
        it('should return an error if name is missing', (done) => {
            const body = {};
            request(app)
                .post('/dish/create')
                .send(body)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.message).to.equal('Name is required');
                    done();
                });
        });
    })

    describe('PUT /dish/:id', () => {
        it('should update an existing dish', (done) => {
            let body = {
                dish_name: "Chicken Sandwich 2.0",
                discription: "Lemon pepper fried chicken sandwich, honey mustard mayo",
                price: 165.00,
                dish_status: 0,
                category_id: 1,
                menu_id: 1
            };
            request(app)
                .put('/dish/1')
                .send(body)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.message).to.equal('Dish was updated!');
                    expect(res.body.data).to.be.an('object');
                    done();
                });
        });
    })

    describe('DELETE /dish/:id', () => {
        it('should delete an existing dish', (done) => {
            let id = 54;
            request(app)
                .delete('/dish/' + id)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.message).to.equal('Dish was deleted!');
                    done();
                });
        });

        it('should return an error if dish does not exist', (done) => {
            request(app)
                .delete('/dish/99999999')
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.message).to.equal('Dish not found');
                    done();
                });
        });
    })
});
