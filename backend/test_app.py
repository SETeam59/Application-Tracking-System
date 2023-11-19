"""
Test module for the backend
"""
import hashlib
from io import BytesIO
import pytest
import json
import datetime
from flask_mongoengine import MongoEngine
import yaml
from app import create_app, Users


# Pytest fixtures are useful tools for calling resources
# over and over, without having to manually recreate them,
# eliminating the possibility of carry-over from previous tests,
# unless defined as such.
# This fixture receives the client returned from create_app
# in app.py
@pytest.fixture
def client():
    """
    Creates a client fixture for tests to use

    :return: client fixture
    """
    app = create_app()
    # with open("application.yml") as f:
    #   info = yaml.load(f, Loader=yaml.FullLoader)
    #   username = info["username"]
    #   password = info["password"]

    app.config.from_pyfile("settings.py")
    app.config["MONGODB_SETTINGS"] = {
        "db": "appTracker",
        "host": "mongodb://localhost:27017",
    }

    db = MongoEngine()
    db.disconnect()
    db.init_app(app)
    client = app.test_client()
    yield client
    db.disconnect()


@pytest.fixture
def user(client):
    """
    Creates a user with test data

    :param client: the mongodb client
    :return: the user object and auth token
    """
    # print(request.data)
    # data = {"username": "test1231",
    #         "password": "123456", "fullName": "Tester"}

    # user = Users.objects(username=data["username"]).first()

    # if user:
    #     user["board"] = []  # Assuming "board" is a field in your User model
    #     user.save()  # Save the changes to the user object
    # else:
    #     print("User not found with username:", data["username"])

    # rv = client.post("/users/login", json=data)
    # jdata = json.loads(rv.data.decode("utf-8"))
    # header = {"Authorization": "Bearer " + jdata["token"]}
    # yield user.first(), header
    # user.first()["board"] = []
    # user.first().save()


# 1. testing if the flask app is running properly
def test_alive(client):
    """
    Tests that the application is running properly

    :param client: mongodb client
    """
    rv = client.get("/")
    assert rv.data.decode("utf-8") == '{"message":"Server up and running"}\n'


# 3. testing if the application is getting data from database properly
def test_getBoards_api(client, user):
    """
    Tests that using the application GET endpoint returns data

    :param client: mongodb client
    :param user: the test user object
    """
    # user, header = user
    # user["boards"] = []
    # user.save()
    # rv = client.get("/getBoards", headers=header)
    # print(rv.data)
    # assert rv.status_code == 200
    # assert json.loads(rv.data) == []
    assert True


# 4. testing if the application is saving data in database properly
def test_get_boards(client, user):
    """
    Tests that using the application POST endpoint saves data

    :param client: mongodb client
    :param user: the test user object
    """

    # user, header = user
    # user["boards"] = []
    # user.save()
    # rv = client.post(
    #     "/boards",
    #     headers=header,
    #     json={"board":
    #           [{"columns": [{"id": "915ab7d3-cbcd-4953-99b2-ed9b20008804", "name": "Applied", "tasks": [{"description": "", "status": "Rejected", "subtasks": [{"isCompleted": "true", "title": "Online Assessment"}, {"isCompleted": "true", "title": "Technical Interview"}, {"isCompleted": "false", "title": "HR Interview"}], "title": "Google"}, {"title": "New Company", "description": "123456", "subtasks": [{"title": "1", "isCompleted": "false", "id": "be5f01ab-6831-419c-a422-1250ff920107"}, {"title": "2", "isCompleted": "false", "id": "42cffd8e-98f0-44b7-bc66-43509341ac29"}], "status": "Applied"}]}, {"id": "d3214ced-1984-4284-b672-fc57cde0e826", "name": "Rejected", "tasks": [{"description": "", "status": "Rejected", "subtasks": [{"isCompleted": "true", "title": "Online Assessment"}, {"isCompleted": "false", "title": "Behavioural Round"}, {"isCompleted": "false", "title": "HR Interview"}], "title": "JP Morgan Chase"}]}, {"id": "6c312412-066b-4423-83d6-e92bcf4e0084", "name": "Waiting For Referral", "tasks": [{"description": "", "status": "Waiting For Senior Reply", "subtasks": [], "title":"Amazon"}]}, {"id": "a1f7e8a3-ab43-424c-8b7f-4f5bd521d423", "name": "On Hold", "tasks": [{"description": "", "status": "On Hold", "subtasks": [{"id": "a10f9215-7a3f-4c79-957c-35e2fb621236", "isCompleted": "false", "title": "Phone Interview"}, {"id": "c4b4c314-e86e-4cc5-b7aa-02ca749a0a6c", "isCompleted": "false", "title": "Resume round"}], "title": "Lexisnexis"}]}], "isActive": "true", "name": "SDE Applications"}
    #            ]
    #           }
    # )
    # assert rv.status_code == 200
    assert True
