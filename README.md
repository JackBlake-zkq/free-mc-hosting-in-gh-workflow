# Easy MCS

Docs Coming Soon

<!-- Run your Minecraft server IN A Github Workflow such that people can join it. This gives you 50h of free hosting per month, with unlimited customizability and 7GB of RAM. You could even get 14GB of RAM if you can get this working on a Mac or Windows GH Action Runner.

This repo also has a system for automatic backups to AWS S3, which will probably be free depending on the size of your server folder, but could incur a few cents a month if you have a huge one. If you do a bit of your own customization, you could use your own system.

The workflow starts the server and print the IP address in one of the steps (labelled so that it is obvious).

The workflow can be run manually, or on a schedule (default is to run every Saturday from 8-11pm UTC). You can modify (or remove) the schedule in the workflow.

## Setup

### Step 1: AWS

First, you'll need to do a few things in AWS:

1. Create an S3 Bucket. Zip your server folder and upload it into `backup.zip` within the bucket
2. Create an IAM Policy that only allows `GetObject` and `PutObject`, and only on the S3 Bucket for your backups
3. Create IAM User for the policy. Generate credentials for this user.

### Step 2: Ngrok

Next, [sign up for ngrok](https://dashboard.ngrok.com/signup) and save your auth token for the next step.

### Step 3: GitHub

Finally, configure the GitHub repository with your credentials and preferences by creating these Variables and Secrets for Actions in the repo settings:

Secrets:
- `AWS_ACCESS_KEY_ID` - from credentials you generated earlier
- `AWS_SECRET_ACCESS_KEY` - from credentials you generated earlier
- `NGROK_AUTHTOKEN` - the auth token you saved earlier

Variables:
- `BACKUP_FREQUENCY` - how often to run backups to S3
- `IMAGE_REPO` - path within ghcr.io to store your image at, something like `GH_USERNAME_LOWERCASE/IMAGE_NAME`. I'm doing `jackblake-zkq/mc-server`
- `S3_BUCKET_NAME` - name of S3 bucket you created
- `S3_REGION` - region of your S3 bucket
- `START_COMMAND` - command to start your minecreaft server e.g. `java -Xmx4G -Xms2G -jar server.jar nogui` -->

