import { readS3 } from "../s3.mjs";
import { mkdirSync } from 'fs';


//make directory ./server if it doesn't exist
try { 
    process.chdir("./server")
}   catch(err) {
    mkdirSync("./server");
    process.chdir("./server");
}

readS3();