FROM eclipse-temurin:11
# COPY --from=python:3.6 / /
# COPY requirements.txt start.py backup.py ./
# RUN python3 -m pip install -r requirements.txt
# CMD ["python3", "start.py"]
CMD ["java", "-Xmx1024M", "-Xms1024M", "-jar", "server/server.jar", "nogui"]