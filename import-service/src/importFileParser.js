const AWS = require("aws-sdk");
const util = require("util");
const stream = require("stream");
const csv = require("csv-parser");

const {BUCKET, REGION} = process.env;

const finished = util.promisify(stream.finished);

export const importFileParser = () => async (event) => {
    console.log('start importFileParser')
    const s3 = new AWS.S3({region: REGION});


    for (const record of event.Records) {
        const results = [];
        const s3Stream = s3.getObject({
            Bucket: BUCKET,
            Key: record.s3.object.key
        }).createReadStream();

        await finished(
            s3Stream.pipe(csv())
                .on('data', (data) => {
                    console.log(data);

                    results.push(data);
                })
                .on('end', async () => {
                    console.log(`Copy from ${BUCKET}/${record.s3.object.key}`);

                    await s3.copyObject({
                        Bucket: BUCKET,
                        CopySource: `${BUCKET}/${record.s3.object.key}`,
                        Key: record.s3.object.key.replace('uploaded', 'parsed')
                    }).promise();

                    console.log(`Copied into ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`);
                })
        )


    }
}