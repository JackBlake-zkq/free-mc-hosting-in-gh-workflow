# MC Server

Extra-simple setup to run Minecraft Server on AWS EC2 with backups to S3. It uses a Node.js script which runs the server as a subprocess.

## AWS Resources

- S3 Bucket - zipped server folder in `backup.zip`
- Security Group that opens inbound TCP on port 25565
- IAM Policy - only allow `GetObject` and `PutObject`, and only to S3 Bucket for this project
- IAM Role with policy
- EC2 Instance with Security Group and IAM Policy attached, as much RAM as your willing to pay for
    - Need to install node, jre (at least java 17 for mc 1.20.4), and screen (if not already installed)
    - I'm using Amazon Linux 3 t3-medium, so example install is: `sudo yum install -y nodejs java-17-amazon-corretto-headless`

Might setup some CloudFormation for these

## Environment Variables

You'll need to set some environment variables in a `.env` file (or set otherwise) for the server to run properly.

```
# command to start the server (as subprocess of node script)
START_COMMAND=java -Xmx4G -Xms1G -jar server.jar nogui

# How often to run a backup in milliseconds. Every 10 minutes shown below
BACKUP_FREQUENCY=600000

# Self-explanatory
S3_BUCKET_NAME=jblake-mc-server-backup
S3_REGION=us-east-2
```

## Running the Server

### Locally

As long as you have your AWS credentials, just run `npm run start`!

### In EC2

SSH into your EC2 instance

Start up a new shell by running `screen` [manual](https://www.gnu.org/software/screen/manual/screen.html)

`screen`

Run the server in that shell with `npm run start`

Run any commands you'd like to

Send the screen to the background with `C-a d`

Exit your ssh session

If you want to run a command later, ssh back in and run `screen -r` to bring that screen to the foreground

Stop the server with the `/stop` command from the screen session

Run `exit` from a screen session to end it

## Modifying Server Configs

To update server configs, modify the files while your server is running in the detached screen session. Then, if you want the changes to take effect, restart the server by entering the screen session, running `/stop`, then re-running `npm run start`.

## DNS (to use a custom domain)

Add an A record to your EC2 Instance's Ipv4