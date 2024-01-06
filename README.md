# MC Server

Setup to run containerized mc server with backups to S3

## development

- build image with `docker build -t mc .`
- run container with `docker compose up -d`
    - loads environment variables from a `.env` file
    - maps in aws creds as a volume
    - sets up port forwarding
- write to stdin of server with `docker attach mc-server`
    - only stop server by doing this then running `/stop`, mc server won't save to disk if it is killed (or any other way of it exiting other than /stop)