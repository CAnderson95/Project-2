#################################################
# Imports
#################################################

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from bson import json_util
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin
import requests
import json
import pandas as pd

#################################################
# Flask Setup
#################################################

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_ORIGINS'] = '*'
# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/Top_100"
mongo = PyMongo(app)



######Create Function##### 
def dataload():
     restaurants = mongo.db.Top_100 
     restaurants.drop()
     data = pd.read_csv("../csv_repository/Overall_List/Top_100_NY_day.csv", encoding = 'ISO-8859-1')
     restaurants.insert_one(json.loads(data.to_json(orient = "index")))

dataload()

#################################################
# Flask Routes
#################################################

@app.route("/api/v1.0/restaurants")
def restaurant():
    restaurants = mongo.db.Top_100
    search = restaurants.find({})
    restaurant_json = json.loads(json_util.dumps(search))
    return jsonify(restaurant_json)


@app.route("/")
def welcome():
    return (
        f"Welcome to the NYC Popular Restaurant Test API!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/restaurants"
    )


if __name__ == "__main__":
    app.run(debug=True)