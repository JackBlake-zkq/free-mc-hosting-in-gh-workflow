# Easy MCS

Docker image that runs your minecraft server so that people can join with **no port forwarding** required, completely **agnostic of what kind of server you are using**. There is also an **optional built-in backup system** (also agnostic of server type). 

## Quick Start

1. [sign up for ngrok](https://dashboard.ngrok.com/signup) and grab your auth token
2. create a directory including your server directory, renamed to `server`, and a file named `.env` in the format:
```
NGROK_AUTHTOKEN="your ngrok auth token"
START_COMMAND="the command to start your server (from within the server's directory) e.g. java -Xmx4G -Xms2G -jar server.jar nogui"
```
3. Install docker if it's not already installed (see [the docs](https://docs.docker.com/get-docker/)) and run the daemon
4. download [this docker compose file](https://github.com/JackBlake-zkq/easy-mcs/blob/main/docker-compose.yaml)
5. run `docker compose up -d && docker attach mcs`
6. grab the ip address that got printed out and send it to anyone who wants to join!

You can run server commands directly through the standard in. Use `/stop` to close the server.

There are some [limits on ngrok's free tier](https://ngrok.com/docs/guides/limits/)

## Backups (Optional)

This images provides the option to backup to, and load from backups in AWS S3.

To setup backups, first do the following in AWS:

1. Create an S3 Bucket. Zip your server folder and upload it into `backup.zip` within the bucket
2. Create an IAM Policy that only allows `GetObject` and `PutObject`, and only on the S3 Bucket for your backups
3. Create IAM User for the policy. Generate credentials for this user.

Add the following to your `.env` file:

```
BACKUP_FREQUENCY="integer of how often to run backups, in milliseconds"
S3_BUCKET_NAME="name of the S3 bucket you created"
S3_REGION="region of your S3 bucket"
AWS_ACCESS_KEY_ID="from generated credentials"
AWS_SECRET_ACCESS_KEY="from generated credentials"
USE_BACKUP="optional, if set (to anything other than empty string), downloads the backup from S3 and uses that instead of a local server directory"
```

## Versatility Options

If you'd like to use this image in a more versatile fashion, e.g. without using an env file, on a different port, different terminal configurations, etc. you can do so with no trouble as long as the following are true:

1. all necessary and desired environment variables are set, e.g. with the `-e` flag with `docker run`
2. either your local server directory is mapped as a volume into `/server` in the container, or the `USE_BACKUP` environment variable is set
3. there is a port mapping to `25565` in the container

Recommended: 
1. leave the standard in of the container open
2. don't use the `-t` flag or `tty: true` (compose). The image is not built to handle terminal controls.
3. run the image as a daemon, then attach to its standard in, like in the quick start. This will allow you to run commands in the server.

## Experiments

One cool idea is to run this docker image in a GitHub Workflow. I currently have [this workflow](https://github.com/JackBlake-zkq/easy-mcs/blob/main/.github/workflows/run.yaml) set up to do that. This lets you run the server remotely, triggered by certain events, and/or on a schedule, with 50h of free hosting per month with 7GB of RAM. You could even get 14GB of RAM if you can get this working on a Mac or Windows runner. I'm not sure if this ok with the TOS, so I'm not using it.