'use strict';

const AWS = require("aws-sdk");

const {BUCKET, REGION} = process.env;

import {errorResponse, successResponse} from "./utils/responseBuilder";

export const importProductsFile = async (event) => {
    console.log('event: ', event);
    
    try {
        const catalogName = event.queryStringParameters.name;
        const catalogPath = `uploaded/${catalogName}`;

        const params = {
            Bucket: BUCKET,
            Key: catalogPath,
            Expires: 60,
            ContentType: 'text/csv'
        };
        console.log('params: ', params);
        const s3 = new AWS.S3({region: REGION});
        const url = await s3.getSignedUrlPromise('putObject', params)

        return successResponse(url, 200);
    } catch (error) {
        errorResponse(error);
    }
}