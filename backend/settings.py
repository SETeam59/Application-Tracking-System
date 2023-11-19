from os import environ
from dotenv import load_dotenv
load_dotenv()

MONGODB_USERNAME = environ.get('MONGODB_USERNAME')
MONGODB_PWD = environ.get('MONGODB_PWD')
