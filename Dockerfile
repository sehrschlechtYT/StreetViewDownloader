FROM python:3.11-alpine
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
COPY . /app
CMD [ "python3", "-m" , "flask", "--app", "app", "run", "--host=0.0.0.0"]
