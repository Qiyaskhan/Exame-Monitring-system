# https://pynative.com/python-list-files-in-a-directory/
# https://pythonexamples.org/python-get-list-of-all-files-in-directory-and-sub-directories/
# https://www.techiedelight.com/list-all-subdirectories-in-directory-python/

import os
import shutil
import pyodbc

from flask import Flask, jsonify, request, session
from flask import send_from_directory

from werkzeug.utils import secure_filename
import pprint
from fsforge import take_fs_snapshot

app = Flask(__name__)

connection = pyodbc.connect(
    'DRIVER={Sql Server};SERVER=DESKTOP-5BEQQGD\SQLEXPRESS;DATABASE=Dropbox_Replica;Trusted_Connection=yes;')

serverPath = "C:/Users/zeeshan/DR_API/Dropbox_Replica_Server/"


# SignUp

@app.route('/signup', methods=['POST'])
def signup():
    email = request.form['email']
    name = request.form['name']
    password = request.form['password']
    print(email, name, password)

    cursor1 = connection.cursor()
    cursor1.execute("Select email from users where email = '" + email + "'")
    for row in cursor1:
        if row[0] == email:
            print('Already Exist')
            return jsonify('False')

    cursor = connection.cursor()
    # User
    cursor.execute(
        " Insert Into Users (email, name, password) Values ( '" + email + "' ,'" + name + "' ,'" + password + "') ")
    connection.commit()

    _dir = os.path.join(serverPath, email)
    if not os.path.exists(_dir):
        os.makedirs(_dir)

    print('Saved')

    return jsonify('True')


# Login Function For Users And Admins

@app.route('/login', methods=['POST'])
def login():
    list1 = []
    email = request.form['email']
    password = request.form['password']
    print(id, password)

    cursor = connection.cursor()
    # User
    cursor.execute("select * from Users where email = '" + email + "' and password = '" + password + "' ")

    for row in cursor:
        list1.append({'Email': row[0], 'Name': row[1], 'Password': row[2], 'Role': row[3]})

    # Admin
    cursor.execute("select * from Admins where email = '" + email + "' and password = '" + password + "' ")
    for row in cursor:
        list1.append({'Email': row[0], 'Name': row[1], 'Password': row[2], 'Role': row[3]})

    print(list1)
    return jsonify(list1)


# Get All Files And Folders Names From Directory

@app.route('/getAll', methods=['POST'])
def getAll():
    Email = request.form['Email']
    listOfFile = []
    listOfFile = os.listdir('./Dropbox_Replica_Server/' + Email + '/')
    print(listOfFile)
    return jsonify(listOfFile)


# Get All Files And Folders By Names In Directory

@app.route('/getFile/<path:file>/<path:Email>', methods=['Get'])
def getFile(file, Email):
    print(file, Email)
    return send_from_directory(serverPath + '/' + Email, file, as_attachment=True)


# Create A New Folder

@app.route('/NewFolder', methods=['POST'])
def NewFolder():
    folderName = request.form['FolderName']
    parent = request.form['Email']
    print(folderName, parent)

    _dir = serverPath + "/" + parent + "/"

    _dir = os.path.join(_dir, folderName)
    if not os.path.exists(_dir):
        os.makedirs(_dir)
        return jsonify("Success")
    else:
        return jsonify("Already Exist")


# Save Image/Video File From Camera

@app.route('/setFile', methods=['POST'])
def setFile():
    file = request.files['file']
    parent = request.form['Email']
    print(parent)
    filename = secure_filename(file.filename)
    file.save(os.path.join('./Dropbox_Replica_Server/' + parent + '/', filename))
    print('File Received: ' + filename)

    return jsonify("Success")


@app.route("/upload", methods=["POST"])
def upload():
    uploaded_files = request.files.getlist("file[]")
    print(uploaded_files)
    return ('True')


# Get All The Sharing Record Between Users , For Admin Only

@app.route('/getSharedRecord', methods=['Get'])
def getSharedRecord():
    list1 = []
    cursor = connection.cursor()
    cursor.execute("select * from SharedRecord")
    for row in cursor:
        list1.append([row[2], row[1], row[3], row[4]])
    print(list1)
    return jsonify(list1)


sharingNotification = []

@app.route("/recieveNotification/<path:user>", methods=['GET'])
def recieve_warnings(user):
    for u in sharingNotification:
        if u == user:
            sharingNotification.pop(0)
            return jsonify('True')
    return jsonify('False')


# Share Files To Other Users

@app.route('/shareData', methods=['Post'])
def shareData():
    data = request.form['Data']
    sen = request.form['From']
    rec = request.form['To']
    date = request.form['Date']
    permission = request.form['Permission']

    _dir = serverPath + "/Sharing_Record/"

    _dir = os.path.join(_dir, "to" + rec)
    if not os.path.exists(_dir):
        os.makedirs(_dir)

    sender = "\\" + sen
    fold = "\\to" + rec

    src_folder = r"C:\Users\zeeshan\DR_API\Dropbox_Replica_Server" + sender
    dst_folder = r"C:\Users\zeeshan\DR_API\Dropbox_Replica_Server\Sharing_Record" + fold

    # file names
    src_file = src_folder + "\\" + data
    dst_file = dst_folder + "\\" + data

    shutil.copyfile(src_file, dst_file)
    print('Copied')

    cursor = connection.cursor()
    # User
    cursor.execute(
        "Insert Into SharedRecord (_to, _from, sharedData, Date) Values ( '" + rec + "' ,'" + sen + "','" + data + "','" + date + "'  ) ")
    connection.commit()

    sharingNotification.append(rec)

    if permission != 'ReadOnly':
        _dir = serverPath + "/tempRecord/"

        sender = "\\" + sen
        fold = "\\to" + rec

        src_folder = r"C:\Users\zeeshan\DR_API\Dropbox_Replica_Server" + sender
        dst_folder = r"C:\Users\zeeshan\DR_API\Dropbox_Replica_Server\tempRecord"

        # file names
        src_file = src_folder + "\\" + data
        dst_file = dst_folder + "\\" + data

        shutil.copyfile(src_file, dst_file)

    return jsonify('File Shared')


# Get All Files Name Shared To User By Other Users

@app.route('/getSharedData', methods=['Post'])
def getshareData():
    to = request.form['Email']
    file = "\\to" + to
    listOfFile = []
    listOfFile = os.listdir('./Dropbox_Replica_Server/Sharing_Record' + file + '/')
    print(listOfFile)
    return jsonify(listOfFile)


# Get All Shared Files By Name

@app.route('/getSFile/<path:file>/<path:Email>', methods=['Get'])
def getSFile(file, Email):
    print(file, Email)
    return send_from_directory(serverPath + '/Sharing_Record/to' + Email, file, as_attachment=True)


# Get All Files Name Recently Accessed By User

@app.route('/getRecentList', methods=['Post'])
def getRecentData():
    Email = request.form['Email']
    listOfFile = []
    cursor = connection.cursor()
    cursor.execute("Select * From Recents where email = '" + Email + "'")
    for row in cursor:
        listOfFile.append(
            {'RecentID': row[0], 'Email': row[1], 'FileName': row[2], 'InFolder': row[3], 'ParentName': row[4]})

    print(listOfFile)
    return jsonify(listOfFile)


# Get All Recent Files By Name

@app.route('/getRecentFile/<path:file>/<path:folder>/<path:Email>', methods=['Get'])
def getRecentFile(file, Email, folder):
    if folder == 'None':
        return send_from_directory(serverPath + '/' + Email, file, as_attachment=True)
    else:
        return send_from_directory(serverPath + '/' + Email + '/' + folder, file, as_attachment=True)


# Get All Files Name Starred By User

@app.route('/getStarredList', methods=['Post'])
def getStarredData():
    Email = request.form['Email']
    listOfFile = []

    cursor = connection.cursor()
    cursor.execute("Select * From Starred where email = '" + Email + "'")
    for row in cursor:
        listOfFile.append(
            {'StarredID': row[0], 'Email': row[1], 'FileName': row[2], 'InFolder': row[3], 'ParentName': row[4]})

    print(listOfFile)
    return jsonify(listOfFile)


# Get All Starred Files By Name

@app.route('/getStarredFile/<path:file>/<path:folder>/<path:Email>', methods=['Get'])
def getStarredFile(file, Email, folder):
    if folder == 'None':
        return send_from_directory(serverPath + '/' + Email, file, as_attachment=True)
    else:
        return send_from_directory(serverPath + '/' + Email + '/' + folder, file, as_attachment=True)


# Check If File Exist In Starred
@app.route('/checkStarred', methods=['POST'])
def checkFav():
    FileName = request.form['FileName']
    Email = request.form['Email']
    isFound = None

    cursor = connection.cursor()
    cursor.execute(
        "SELECT  CASE WHEN EXISTS ( SELECT * FROM Starred WHERE email = '" + Email + "' and fileName = '" + FileName + "' )  THEN 'TRUE'  ELSE 'FALSE' END")
    for row in cursor:
        isFound = row[0]
    print(isFound)
    return jsonify(isFound)


# Check If File Exist In Starred
@app.route('/addToStarred', methods=['POST'])
def AddToFav():
    FileName = request.form['FileName']
    Email = request.form['Email']
    InFolder = request.form['InFolder']
    ParentName = request.form['ParentName']

    print(FileName, Email, InFolder, ParentName)

    isFound = None

    cursor = connection.cursor()
    cursor.execute(
        "SELECT  CASE WHEN EXISTS ( SELECT * FROM Starred WHERE email = '" + Email + "' and fileName = '" + FileName + "' )  THEN 'TRUE'  ELSE 'FALSE' END")
    for row in cursor:
        isFound = row[0]
    print(isFound)
    if isFound == 'FALSE':
        cursor = connection.cursor()
        cursor.execute(
            "Insert Into Starred (email, filename, inFolder, parentName) Values ( '" + Email + "','" + FileName + "','" + InFolder + "','" + ParentName + "')")
        connection.commit()
        return jsonify('True')
    else:
        cursor = connection.cursor()
        cursor.execute(
            "Delete From Starred Where email = '" + Email + "' and filename = '" + FileName + "' ")
        connection.commit()
        return jsonify('False')


# To Get Uploaded Files By Users

@app.route('/NewFile', methods=['POST'])
def NewFile():
    file = request.files['file']
    parent = request.form['Email']
    print(parent)
    filename = secure_filename(file.filename)
    file.save(os.path.join('./Dropbox_Replica_Server/' + parent + '/', filename))
    print('Image Received: ' + filename)

    return jsonify("Success")


# To Delete Folders And All Data Within It

@app.route('/DeleteFolder', methods=['POST'])
def DeleteFolder():
    folderName = request.form['FolderName']
    parent = request.form['Email']
    dir_path = fr"C:\Users\zeeshan\DR_API\Dropbox_Replica_Server\{parent}\{folderName}"
    try:
        shutil.rmtree(dir_path)
    except OSError as e:
        print("Error: %s : %s" % (dir_path, e.strerror))

    return jsonify('Folder Deleted Successfully')


# To Delete File In A Folder

@app.route('/DeleteFile', methods=['POST'])
def DeleteFile():
    fileName = request.form['FileName']
    parent = request.form['Email']
    os.remove(f"./Dropbox_Replica_Server/{parent}/{fileName} ")
    return jsonify('File Deleted Successfully')


if __name__ == "__main__":
    app.run(host='192.168.196.125', debug=True)
