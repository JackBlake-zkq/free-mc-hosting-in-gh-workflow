import { spawn } from 'child_process';
import { writeS3, readS3 } from './s3.mjs';
import { connect } from "ngrok"

const { BACKUP_FREQUENCY, START_COMMAND, USE_BACKUP, NGROK_AUTHTOKEN } = process.env;

const command = START_COMMAND.split(" ")

let finishDiskSave = () => {};

let starting = true;

process.chdir("./server") 

if(USE_BACKUP) await readS3();

const server_proc = spawn(command[0], command.slice(1));

process.stdin.pipe(server_proc.stdin);

server_proc.stdout.on('data', data => {
  let str = data.toString();
  console.log(str);
  if (str.includes("Done") && starting) {
    starting = false;
    startNgrok();
    if(BACKUP_FREQUENCY) setInterval(writeBackup, parseInt(BACKUP_FREQUENCY));
  } else if (str.includes("Saved the game")) {
    finishDiskSave();
  }
});

server_proc.stderr.on('data', data => {
  console.error(data.toString());
});

server_proc.on('close', async code => {
  console.log(`server exited with code ${code}`);
  
  if(code == 0) {
    //must have saved to disk already, can write backup
    if(BACKUP_FREQUENCY) await writeS3();
  }
  process.exit(server_proc.exitCode);
});

async function writeBackup() {
  server_proc.stdin.write('/say Starting Backup\n');
  console.log("Starting Disk Write")
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
  console.log("Disk Write Complete")

  await writeS3();

  server_proc.stdin.write('/say Backup Complete\n');
}

async function startNgrok() {
  connect({
    proto: 'tcp', // http|tcp|tls, defaults to http
    addr: 25565, // port or network address, defaults to 80
    authtoken: NGROK_AUTHTOKEN, // your authtoken from ngrok.com
    region: 'us', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
    onStatusChange: status => {
      if(status === 'closed') {
        server_proc.stdin.write('/stop\n');
      }
    }
  }).then(url => {
    console.log("------------------------------------------------------")
    console.log("SERVER URL: " + url.slice(6))
    console.log("------------------------------------------------------")
  })
}