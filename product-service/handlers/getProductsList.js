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

export const getProductsList = async (event) => {
    const client = new Client(dbOptions);

    // Log incoming event
    console.log('event: ', event);

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

    // Query all products
    try {
        const {rows: products_list} = await client.query(
            `select *
             from products
                      left join stocks on products.id = stocks.product_id
            `);

        console.log('products: ', products_list);

        return {
            statusCode: 200,
            headers: validHeaders,
            body: JSON.stringify(
                products_list
            ),
        };
    } catch (err) {
        console.error('Error during database request: ', err);
        return {
            statusCode: 500,
            headers: validHeaders,
            body: JSON.stringify(
                {
                    error: 'Error during database request'
                }
            ),
        };
    } finally {
        client.end();
    }
};
