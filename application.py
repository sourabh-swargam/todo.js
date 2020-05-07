from flask import Flask, render_template, request, session, url_for, redirect, jsonify
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
import os
import datetime
import json
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

task_list = {}

with open('data.json', 'r') as openfile:
	try:
		task_list = json.load(openfile)
	except:
		pass

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/init", methods=['POST'])
def init():
	return jsonify(task_list)

@app.route("/api/add", methods=['POST'])
def add() :
	data = dict(request.args)
	task_list[data['id']] = data
	data_json = json.dumps(task_list) 
	with open("data.json", "w") as outfile: 
	    outfile.write(data_json) 

	return 'nothing'


@app.route("/api/delete", methods=['POST'])
def delete():
	data = dict(request.args)
	task_list.pop(data['id'])
	data_json = json.dumps(task_list) 
	with open("data.json", "w") as outfile: 
	    outfile.write(data_json) 
	return 'nothing'

@app.route("/api/update", methods=['POST'])
def update():
	data = dict(request.args)
	task_id = data['id'] 
	temp = task_list[task_id]
	temp['done'] = data['done']
	task_list[task_id] = temp
	data_json = json.dumps(task_list) 
	with open("data.json", "w") as outfile: 
	    outfile.write(data_json) 
	return 'nothing'