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

export const createProduct = async (event) => {
    const client = new Client(dbOptions);

    // Log incoming event
    console.log('event: ', event);

    let body = event.body;

    let {
        title = '',
        description = '',
        price = '',
        count = 0
    } = body;

    // Check if product data is invalid
    if (title === '' || description === '' || price === '' || count === '') {
        return {
            statusCode: 400,
            headers: validHeaders,
            body: JSON.stringify({
                error: 'Wrong post data'
            }),
        };
    }

    // Connect to database
    try {
        await client.connect();
        await client.query("BEGIN"); // Start transaction
    } catch (err) {
        return {
            statusCode: 500,
            headers: validHeaders,
            body: JSON.stringify({
                error: 'Cannot connect to database:' + err
            }),
        };
    }

    // Insert
    try {
        const newProductResult = await client.query(
            `insert into products(title, description, price)
             values ($1::text, $2::text, $3::int)
             RETURNING id
            `, [
                title,
                description,
                price
            ]);
        const newProductId = newProductResult.rows[0].id;

        // Try to add stock
        const stockResult = await client.query(`
                    insert into stocks (product_id, count)
                    values ($1::text, $2::int)
                    RETURNING product_id, count `,
            [
                newProductId,
                count
            ]
        )

        const stockCount = stockResult.rows[0].count;
        const stockProductId = stockResult.rows[0].product_id;

        if (stockCount === '' || stockProductId !== newProductId) {
            console.log("Rolling back the transaction...");
            client.query("ROLLBACK");
        } else {
            console.log("Committing the transaction");
            client.query("COMMIT");
        }

        return {
            statusCode: 200,
            headers: validHeaders,
            body: JSON.stringify({
                id: newProductId
            }),
        };

    } catch (err) {
        console.error('Error during database request: ', err);
        return {
            statusCode: 500,
            headers: validHeaders,
            body: JSON.stringify(
                {
                    error: 'Cannot create new product: ' + err
                }
            ),
        };
    } finally {
        client.end();
    }
};
