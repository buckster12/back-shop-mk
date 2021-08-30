const handler = require('../handler');
import MyJSON from '../MyJSON.json';

test('correct greeting is generated', () => {
    const expectedObject = {
        body: "{\"count\":2,\"description\":\"Vortex Core Dye Sub PBT Mechanical Keyboard\",\"id\":\"7567ec4b-b10c-48c5-9445-fc73c48a80a2\",\"price\":89,\"title\":\"Vortex Core Dye Sub PBT Mechanical Keyboard\"}",
        statusCode: 200
    }
    const result = handler.getProductById(MyJSON);
    result
        .then(data => {
            expect(data).toMatchObject(expectedObject);
        })
        .catch(e => {
            // expect(e).toBe(`Missing productId field`)
        });
});

test('Expect error due to empty request', () => {
    const requestNonExistentProduct = {
        "pathParameters": {
            "productId": "7567ec4b-b10c-48c5-9445-fc73c48a80a2---"
        }
    };
    const expectedObject = {
        body: "null",
        statusCode: 404
    }
    const result = handler.getProductById(requestNonExistentProduct);
    result
        .then(data => {
            expect(data).toMatchObject(expectedObject);
        })
        .catch(e => {
            // console.log(e);
            expect(e).toBe(`Couldn\'t get product with this ID`)
        });
});