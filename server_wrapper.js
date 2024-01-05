import { spawn } from 'node:child_process';
import { writeS3, readS3 } from './s3.js';
import { mkdirSync } from 'fs';

const { USE_BACKUP, DO_BACKUP, BACKUP_FREQUENCY, START_COMMAND } = process.env;

const command = START_COMMAND.split(" ")

let finishDiskSave = () => {};

try { 
  process.chdir("./server") 
} catch(err) {
  mkdirSync("./server", {});
  process.chdir("./server");
}
 

if(USE_BACKUP) await readS3();

const server_proc = spawn(command[0], command.slice(1));
process.on("beforeExit", async () => {
  if(server_proc.exitCode == null) server_proc.kill();
});

process.stdin.pipe(server_proc.stdin);

server_proc.stdout.on('data', data => {
  let str = data.toString();
  console.log(str);
  if (str.includes("Done")) {
    if(DO_BACKUP) setInterval(writeBackup, parseInt(BACKUP_FREQUENCY));
  }
  if (str.includes("Saved the game")) {
    finishDiskSave();
  }
});

server_proc.stderr.on('data', data => {
  console.error(data.toString());
});

server_proc.on('close', async code => {
  console.log(`server exited with code ${code}`);
  if(DO_BACKUP) await writeS3();
  process.exit(server_proc.exitCode);
});

async function writeBackup() {
  console.log("Starting Backup");
  // save to disk
  await new Promise((resolve, reject) => {
    let timeout;
    finishDiskSave = () => {
      if(timeout) clearTimeout(timeout);
      resolve();
      finishDiskSave = () => {};
    }
    server_proc.stdin.write('/save-all\n');
    timeout = setTimeout(reject, 10000);
  })

  await writeS3();

  console.log("Backup Complete");
}