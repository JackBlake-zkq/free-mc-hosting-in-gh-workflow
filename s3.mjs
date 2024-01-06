import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Extract } from "unzip-stream";
import { zip } from "zip-a-folder";
import fs from "fs"
import { pipeline } from "stream/promises";

const { S3_BUCKET_NAME, S3_REGION } = process.env;

const client = new S3Client({region: S3_REGION});

/**
 * zip all files in working directory and upload to S3 bucket specified by S3_BUCKET_NAME
 */
export const writeS3 = async () => {
    //zip all files in working directory matching BACKUP_REGEX
    console.log("Zipping");
    await zip(".", "../backup.zip");
    console.log("Zipped");

    //write the zip to the S3 bucket specified by S3_BUCKET_NAME
    console.log("Writing to S3");
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: "backup.zip",
        Body: fs.createReadStream("../backup.zip")
    });

    await client.send(command);
    console.log("Write to S3 Successful");
}

/**
 * read the zip from the AWS S3 bucket specified by S3_BUCKET_NAME and extract to working directory
 */
export const readS3 = async () => {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: "backup.zip",
     });
    console.log("Reading from S3 and extracting");
    const response = await client.send(command);
    await pipeline(response.Body, Extract({ path: '.' }));
    console.log("Read/Extraction Successful");
     // if(fs.readdirSync(".").some(ename => fs.statSync(ename).mtime > response.LastModified)) {
    //     response.Body.destroy();
    //     console.log("Local files newer than S3 backup, skipping read");
}