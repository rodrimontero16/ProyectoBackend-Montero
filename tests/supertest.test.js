import * as chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Test general' , () => {
    describe('Test of sessions', () => {
        it.only('Debe registrar un usuario de forma exitosa', async function() {
            const userMock = {
                first_name: 'Juan',
                last_name: 'Perez',
                email: `jp${Date.now()}@gmail.com`,
                age: 27,
                password: 'qwerty'
            };
            const response = await requester.post('/api/auth/register').send(userMock);
            expect(response.statusCode).to.be.equals(302);
            expect(response._body).to.be.has.property('_id');
            expect(response._body).to.be.has.property('role', 'user');
        });
        
        it('Debe loguear un usuario de forma exitosa', async function() {
            
        }); 
    })
})