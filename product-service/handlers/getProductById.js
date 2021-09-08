'use strict';

const {Client} = require('pg');

const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env;

const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    _connectionTimeoutMillis: 5000
}

const validHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
}

export const getProductById = async (event) => {
    const client = new Client(dbOptions);
    const requestBody = event.pathParameters;

    // Log incoming event
    console.log('event: ', event);
    
    const productId = requestBody.productId || null;
    console.log("productId=", productId);

    // Connect to database
    try {
        await client.connect();
    } catch (err) {
        return {
            statusCode: 500,
            headers: validHeaders,
            body: JSON.stringify({
                error: 'Cannot connect to database:' + err
            }),
        };
    }

    // Query
    try {
        const {rows: product} = await client.query(
            `select *
             from products
             where id = $1::uuid
            `, [productId]);

        console.log('product: ', product);

        return {
            statusCode: 200,
            headers: validHeaders,
            body: JSON.stringify(
                product
            ),
        };
    } catch (err) {
        console.error('Error during database request: ', err);
        return {
            statusCode: 500,
            headers: validHeaders,
            body: JSON.stringify(
                {
                    error: 'Cannot find product with id=' + productId
                }
            ),
        };
    } finally {
        client.end();
    }

};
