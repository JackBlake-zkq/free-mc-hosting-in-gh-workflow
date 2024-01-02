

# Modify these implementations to suit needs! e.g. use something other than s3

def read_backup():
    """
    Reads remote server backup and writes to ./server

    Implementation: reads zip file from s3 and unzips it to ./server
    """
    pass

def write_backup():
    """
    writes ./server to remote server backup

    Implementation: zips ./server and uploads to s3
    """
    pass