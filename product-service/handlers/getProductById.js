'use strict';
import productList from './productList.json';

export const getProductById = async (event) => {
    const requestBody = event.pathParameters;
    const productId = requestBody.productId || null;
    // console.log("id=", productId);
    // console.log("typeof id=", typeof productId);

    if (typeof productId !== 'string') {
        console.error('Validation Failed');
        return {
            statusCode: 500,
            body: JSON.stringify(
                {
                    error: 'Couldn\'t get product with this ID'
                }
            )
        };
    }

    // Try to find in array by `id`
    let foundProduct = null;
    for (let index = 0; index < productList.length; ++index) {
        let productItem = productList[index];
        if (productItem.id === productId) {
            foundProduct = productItem;
            break;
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(
            foundProduct
        ),
    };
};
