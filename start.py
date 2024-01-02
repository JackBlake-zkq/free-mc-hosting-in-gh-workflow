from subprocess import Popen, PIPE
import time, os
from backup import read_backup, write_backup
from dotenv import load_dotenv

load_dotenv()

backup = os.environ.get("USE_REMOTE_BACKUP") == "true"

if backup: read_backup()

command = 'java -Xmx1024M -Xms1024M -jar server.jar nogui'

# run server w stdin open
try:
    p = Popen(command.split(" "), stdout=PIPE, stdin=PIPE, stderr=PIPE)
except:
    print("oof")

print(p.stdout.readlines())

# periodically backup
while True:
    time.sleep(5)
    stdout_data = p.communicate(input=bytes('/save-all', 'utf-8'))[0]
    if backup: write_backup()