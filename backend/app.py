"""
The flask application for our program
"""
# importing required python libraries
from bson import ObjectId
from flask import Flask, jsonify, request, send_file
from flask_mongoengine import MongoEngine
from flask_cors import CORS, cross_origin
import json
from datetime import datetime, timedelta
import hashlib
import uuid
from mongoengine import ReferenceField

existing_endpoints = ["/applications", "/resume", "/boards", "/getBoards"]


def create_app():
    """
    Creates a server hosted on localhost

    :return: Flask object
    """
    app = Flask(__name__)
    # make flask support CORS
    CORS(app)
    app.config["CORS_HEADERS"] = "Content-Type"

    @app.errorhandler(404)
    def page_not_found(e):
        """
        Returns a json object to indicate error 404

        :return: JSON object
        """
        return jsonify({"error": "Not Found"}), 404

    @app.errorhandler(405)
    # pylint: disable=C0103
    def page_not_allowed(e):
        """
        Returns a json object to indicate error 405

        :return: JSON object
        """
        return jsonify({"error": "Method not Allowed"}), 405

    @app.before_request
    def middleware():
        """
        Checks for user authorization tokens and returns message

        :return: JSON object
        """
        try:
            if request.method == "OPTIONS":
                return jsonify({"success": "OPTIONS"}), 200
            if request.path in existing_endpoints:
                headers = request.headers
                try:
                    token = headers["Authorization"].split(" ")[1]
                except:
                    return jsonify({"error": "Unauthorized"}), 401
                userid = token.split(".")[0]
                user = Users.objects(id=userid).first()

                if user is None:
                    return jsonify({"error": "Unauthorized"}), 401

                expiry_flag = False
                for tokens in user["authTokens"]:
                    if tokens["token"] == token:
                        expiry = tokens["expiry"]
                        expiry_time_object = datetime.strptime(
                            expiry, "%m/%d/%Y, %H:%M:%S"
                        )
                        if datetime.now() <= expiry_time_object:
                            expiry_flag = True
                        else:
                            delete_auth_token(tokens, userid)
                        break

                if not expiry_flag:
                    return jsonify({"error": "Unauthorized"}), 401

        except:
            return jsonify({"error": "Internal server error"}), 500

    def get_token_from_header():
        """
        Evaluates token from the request header

        :return: string
        """
        headers = request.headers
        token = headers["Authorization"].split(" ")[1]
        return token

    def get_userid_from_header():
        """
        Evaluates user id from the request header

        :return: string
        """
        headers = request.headers
        token = headers["Authorization"].split(" ")[1]
        userid = token.split(".")[0]
        return str(userid)

    def delete_auth_token(token_to_delete, user_id):
        """
        Deletes authorization token of the given user from the database

        :param token_to_delete: token to be deleted
        :param user_id: user id of the current active user
        :return: string
        """
        user = Users.objects(id=user_id).first()
        auth_tokens = []
        for token in user["authTokens"]:
            if token != token_to_delete:
                auth_tokens.append(token)
        user.update(authTokens=auth_tokens)

    @app.route("/")
    @cross_origin()
    def health_check():
        return jsonify({"message": "Server up and running"}), 200

    @app.route("/users/signup", methods=["POST"])
    def sign_up():
        """
        Creates a new user profile and adds the user to the database and returns the message

        :return: JSON object
        """
        try:
            # print(request.data)
            data = json.loads(request.data)
            try:
                _ = data["username"]
                _ = data["password"]
                _ = data["fullName"]
            except:
                return jsonify({"error": "Missing fields in input"}), 400

            username_exists = Users.objects(username=data["username"])
            if len(username_exists) != 0:
                return jsonify({"error": "Username already exists"}), 400
            password = data["password"]
            password_hash = hashlib.md5(password.encode())
            user = Users(
                fullName=data["fullName"],
                username=data["username"],
                password=password_hash.hexdigest(),
                authTokens=[],
            )
            user.save()
            return jsonify("User Created"), 200
        except Exception as error:
            print(error)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/users/login", methods=["POST"])
    def login():
        """
        Logs in the user and creates a new authorization token and stores in the database

        :return: JSON object with status and message
        """
        try:
            try:
                data = json.loads(request.data)
                _ = data["username"]
                _ = data["password"]
            except:
                return jsonify({"error": "Username or password missing"}), 400
            password_hash = hashlib.md5(data["password"].encode()).hexdigest()
            user = Users.objects(
                username=data["username"], password=password_hash
            ).first()
            if user is None:
                return jsonify({"error": "Wrong username or password"})
            token = str(user["id"]) + "." + str(uuid.uuid4())
            expiry = datetime.now() + timedelta(days=1)
            expiry_str = expiry.strftime("%m/%d/%Y, %H:%M:%S")
            auth_tokens_new = user["authTokens"] + [
                {"token": token, "expiry": expiry_str}
            ]
            user.update(authTokens=auth_tokens_new)
            return jsonify({"token": token, "expiry": expiry_str})
        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/users/logout", methods=["POST"])
    def logout():
        """
        Logs out the user and deletes the existing token from the database

        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()
            auth_tokens = []
            incoming_token = get_token_from_header()
            for token in user["authTokens"]:
                if token["token"] != incoming_token:
                    auth_tokens.append(token)
            user.update(authTokens=auth_tokens)

            return jsonify({"success": ""}), 200

        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/application", methods=["POST"])
    def application():
        """
        Creates a new application profile and adds the application to the database and returns the message

        :return: JSON object
        """
        try:
            userid = get_userid_from_header()
            print(request.json, userid)
            data = json.loads(request.data)
            print(data)
            try:
                _ = data["jobTitle"]
                _ = data["companyName"]
                _ = data["date"]
                _ = data["jobLink"]
                _ = data["location"]
            except:
                return jsonify({"error": "Missing fields in input"}), 400

            jobTitle = data["jobTitle"]
            application = Applications(
                jobTitle=data["jobTitle"],
                companyName=data["companyName"],
                date=data["date"],
                jobLink=data["jobLink"],
                location=data["location"],
                user_id=userid,
                board=data["board"],
            )
            application.save()
            return jsonify("Application Created"), 200
        except Exception as error:
            print(error)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/application", methods=["GET"])
    def get_application():
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()
            if user:
                apps = Applications.objects.filter(user_id=userid)
                app_list = []
                if len(apps) > 0:
                    for app in apps:
                        app_dict = app.to_mongo()
                        if (
                            isinstance(app_dict["user_id"], ObjectId)
                            or isinstance("_id", ObjectId)
                            or isinstance("board", ObjectId)
                        ):
                            app_dict["user_id"] = str(app_dict["user_id"])
                            app_dict["board"] = str(app_dict["board"])
                            app_dict["_id"] = str(app_dict["_id"])
                        app_list.append(app_dict)
                return jsonify(app_list), 200
            else:
                return jsonify([]), 200
        except Exception as e:
            print(e)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/getBoards", methods=["GET"])
    def get_boards():
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()

            if user:
                boards = Boards.objects.filter(user_id=userid)
                boards_list = []

                if len(boards) > 0:
                    for board in boards:
                        board_dict = board.to_mongo()
                        if isinstance(board_dict["user_id"], ObjectId) or isinstance(
                            board_dict["board_id"], ObjectId
                        ):
                            board_dict["user_id"] = str(board_dict["user_id"])
                            board_dict["_id"] = str(
                                board_dict["_id"]
                            )  # Convert ObjectId to string
                        columns = Columns.objects.filter(board_id=board.id)
                        # print(type(columns))
                        column_data = []
                        for col in columns:
                            col_dict = col.to_mongo()
                            # print(type(col_dict))
                            if isinstance(col_dict["_id"], ObjectId) or isinstance(
                                col_dict["board_id"], ObjectId
                            ):
                                col_dict["_id"] = str(
                                    col_dict["_id"]
                                )  # Convert ObjectId to string
                                col_dict["board_id"] = str(col_dict["board_id"])
                            column_data.append(col_dict)

                        board_dict["columns"] = column_data
                        boards_list.append(board_dict)

                    return jsonify(boards_list), 200
                else:
                    return (
                        jsonify([]),
                        200,
                    )  # Return an empty page if board does not exist
            else:
                return jsonify({"error": "User not found"}), 404

        except Exception as e:
            print(e)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/boards", methods=["POST"])
    def add_boards():
        """
        Add board for the user

        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            # user = Users.objects(_id=userid).first()
            data = request.form
            data_dict = data.to_dict()
            print(data_dict)
            json_string = next(iter(data_dict.keys()))
            board_data_dict = json.loads(json_string)
            request_data = {}
            try:
                request_data = board_data_dict["board"]
                print("Type:", type(request_data))
                print("Data:", request_data)
            except:
                return jsonify({"error": "Missing fields in input"}), 400

            """Logic for adding a board"""
            board = Boards(
                name=request_data["name"],
                user_id=userid,
            )
            board.save()
            """Logic for adding a column"""
            columns_dict = request_data["columns"]
            if len(columns_dict) > 0:
                for col in columns_dict:
                    column = Columns(
                        name=col["name"], tasks=col["tasks"], board_id=board.id
                    )
                    column.save()
            resp, code = get_boards()
            return resp, code
        except Exception as error:
            print(error)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/columns", methods=["POST"])
    def addColumns():
        data = request.json
        print(data)
        print("Extension has called this")
        boardid = data["column"]["boardid"]
        columnName = data["column"]["name"]
        columns = Columns.objects(board_id=boardid).all()
        print(columns)
        if len(columns) == 0:
            newColumn = Columns(
                name=columnName, tasks=data["column"]["tasks"], board_id=boardid
            )
            newColumn.save()
            return jsonify(newColumn), 200
        for column in columns:
            print(len(columns))
            print(column)
            if column.name.lower() == columnName.lower():
                # column present
                currentTasks = column.tasks
                if len(currentTasks) != 0:
                    currentTasks.append(data["column"]["tasks"])
                else:
                    currentTasks = data["column"]["tasks"]
                column.save()
                return jsonify(column), 200
            else:
                newColumn = Columns(
                    name=columnName, tasks=data["column"]["tasks"], board_id=boardid
                )
                newColumn.save()
                return jsonify(newColumn), 200

    @app.route("/editcolumns", methods=["POST"])
    def update_column():
        try:
            userid = get_userid_from_header()
            data = request.json
            print("data ", data)
            if "id" in data["column"]:
                columnid = data["column"]["id"]
                column = Columns.objects(id=columnid).first()
                if column:
                    print("Column exists")
                    column.update(name=data["column"]["name"])
                    column.update(tasks=data["column"]["tasks"])
                    column.save()
                else:
                    return jsonify("Column does not exist"), 500
            else:
                return jsonify({"error": "Column should be present for update"}), 500
            return jsonify(column), 200
        except Exception as e:
            print(e)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/columns/<string:columnid>", methods=["DELETE"])
    def deleteColumn(columnid):
        try:
            userid = get_userid_from_header()
            if userid:
                column = Columns.objects(id=columnid).first()
                if column:
                    column.delete()
                return jsonify(columnid), 200
            else:
                return jsonify("Userid does not exist to delete"), 401
        except Exception as error:
            print(error)
            return jsonify(error), 500

    @app.route("/boards/<string:boardid>", methods=["DELETE"])
    def deleteBoard(boardid):
        try:
            board = Boards.objects(id=boardid).first()
            if board:
                board.delete()
                return jsonify(boardid), 200
        except Exception as error:
            print(error)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/api/items", methods=["GET"])
    def get_items():
        names = Boards.objects.only("name", "id")
        print(list(names))
        return jsonify(list(names))

    @app.route("/updateapplications", methods=["POST"])
    def update_application():
        """
        Updates the existing job application for the user

        :param application_id: Application id to be modified
        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            try:
                request_data = json.loads(request.data)["application"]
            except:
                print("jhere")
                return jsonify({"error": "No fields found in input"}), 400

            user = Users.objects(id=userid).first()
            current_applications = Applications.objects(user_id=userid)

            if len(current_applications) == 0:
                return jsonify({"error": "No applications found"}), 400
            else:
                updated_applications = []
                app_to_update = None
                application_updated_flag = False
                for application in current_applications:
                    if application["id"] == application.id:
                        app_to_update = application
                        application_updated_flag = True
                        for key, value in request_data.items():
                            application[key] = value
                    updated_applications += [application]
                if not application_updated_flag:
                    return jsonify({"error": "Application not found"}), 400
                user.update(applications=updated_applications)

            return jsonify(app_to_update), 200
        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/application/<string:application_id>", methods=["DELETE"])
    def delete_application(application_id):
        """
        Deletes the given job application for the user

        :param application_id: Application id to be modified
        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()

            current_applications = user["applications"]

            application_deleted_flag = False
            updated_applications = []
            app_to_delete = None
            for application in current_applications:
                if application["id"] != application_id:
                    updated_applications += [application]
                else:
                    app_to_delete = application
                    application_deleted_flag = True

            if not application_deleted_flag:
                return jsonify({"error": "Application not found"}), 400
            user.update(applications=updated_applications)
            return jsonify(app_to_delete), 200
        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/resume", methods=["POST"])
    def upload_resume():
        """This method uploads a resume file into the database and gives a message as response if successfully uploaded"""
        try:
            id = get_userid_from_header()
            print(request.files)
            try:
                file = request.files["file"].read()
            except:
                return jsonify({"error": "File not found"}), 400
            user = Users.objects(id=id).first()
            if not user.resume.read():
                user.resume.put(file)
                user.save()
                return jsonify({"message": "resume  uploaded"}), 200
            else:
                user.resume.replace(file)
                user.save()
                return jsonify({"message": "resume  replaced"}), 200
        except Exception as e:
            print(e)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/resume", methods=["GET"])
    def get_resume():
        """
        Retrieves the resume file from the database
        Response: return the file from database
        """
        try:
            id = get_userid_from_header()
            try:
                user = Users.objects(id=id).first()
                if len(user.resume.read()) == 0:
                    raise FileNotFoundError
                else:
                    user.resume.seek(0)
            except:
                return jsonify({"error": "resume not be found"}), 400
            response = send_file(
                user.resume,
                mimetype="application/pdf",
                attachment_filename="resume.pdf",
                as_attachment=True,
            )
            response.headers["x-filename"] = "resume.pdf"
            response.headers["Access-Control-Expose-Headers"] = "x-filename"
            return response, 200
        except:
            return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()


app.config.from_pyfile("settings.py")
app.config["MONGODB_SETTINGS"] = {
    "db": "appTracker",
    "host": "mongodb://localhost:27017",
}

db = MongoEngine()
db.init_app(app)


# ODM model to denote the schema of a user
class Users(db.Document):
    """
    Users class. Holds full name, username, password, as well as applications and resumes
    """

    # id = db.IntField(primary_key=True)
    fullName = db.StringField()
    username = db.EmailField()
    password = db.StringField()
    authTokens = db.ListField()
    resume = db.FileField()

    def to_json(self):
        """
        Returns the user details in JSON object

        :return: JSON object
        """
        return {"id": self.id, "fullName": self.fullName, "username": self.username}


# ODM model to denote the schema of the board.
class Boards(db.Document):
    name = db.StringField()
    user_id = ReferenceField(Users, reverse_delete_rule="CASCADE")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "columns": self.columns,
        }


# ODM model to denote the schema of a column inside a board. Ex. Applied, waiting for referral
class Columns(db.Document):
    name = db.StringField()
    tasks = db.ListField()
    board_id = ReferenceField(Boards, reverse_delete_rule="CASCADE")

    def to_json(self):
        return {"id": self.id, "name": self.name, "tasks": self.tasks}


class Applications(db.Document):
    jobTitle = db.StringField()
    companyName = db.StringField()
    board = ReferenceField(Boards)
    user_id = ReferenceField(Users, reverse_delete_rule="CASCADE")
    date = db.StringField()
    jobLink = db.StringField()
    location = db.StringField()

    def to_json(self):
        """
        Returns the user details in JSON object

        :return: JSON object
        """
        return {
            "id": self.id,
            "Job Title": self.jobTitle,
            "company Name": self.companyName,
        }


if __name__ == "__main__":
    app.run(debug=True)
