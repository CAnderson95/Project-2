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



#################################################
# Create Function to Import Data
#################################################
def dataload():
     #pull database as a variable
     restaurants = mongo.db.Top_100
     #drop any existing data inside of the table - this will prevent you from adding multiple 
     # sets of the same data if you were to ever run this app more than once  
     restaurants.drop()
     #read the data in
     data = pd.read_csv("../csv_repository/Overall_List/Top_100_NY_day.csv", encoding = 'ISO-8859-1')
     #insert the data into the database loading it in json format 
     #the orient = "index" reads it in as rows as opposed to columns
     restaurants.insert_one(json.loads(data.to_json(orient = "index")))
#run the function
dataload()

#################################################
# Flask Routes
#################################################

#build route in API
@app.route("/api/v1.0/restaurants")
#define function 
def restaurant():
    #read in the information from the database that was loaded in by the previous function 
    restaurants = mongo.db.Top_100
    #look through the information, could specify to find something specific, in this case it is pulling in everything
    search = restaurants.find({})
    #load all this information into a json to display in the API generated by this app 
    restaurant_json = json.loads(json_util.dumps(search))
    #display the API in json format 
    return jsonify(restaurant_json)

##Test Code from Mindy
##@app.route("/api/categories/<category>")
#def latlngFilter(category):
 #   restaurants = mongo.db.Top_100
  #  searchRest = restaurants.findOne({})
   # searchCat = restauratns.find({"Category": searchRest.})
   # restaurant_json = json.loads(json_util.dumps(search))

@app.route("/")
def welcome():
    return (
        f"Welcome to the NYC Popular Restaurant Test API!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/restaurants"
    )

if __name__ == "__main__":
    app.run(debug=True)