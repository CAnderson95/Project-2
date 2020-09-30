from flask import Flask, jsonify

# Dictionary of Restaurants
restaurants = [
    {"Name": "pizza1", "Rating": 5, "Review_Count":600, "Price":"$",
    "Street_Address":"254 S 2nd St","Zip_code":"11211","Lat":"40.711620","Long":"-73.957830	",
    "url":"aaaa","category":"pizza"},
    {"Name": "pizza2", "Rating": 4.5, "Review_Count":80000, "Price":"$$",
    "Street_Address":"370 W 51st St","Zip_code":"10019","Lat":"40.763940","Long":"-73.988340	",
    "url":"bbbbb","category":"pizza"},
    {"Name": "pizza3", "Rating": 4, "Review_Count":500, "Price":"$",
    "Street_Address":"227 Lenox Ave","Zip_code":"10027","Lat":"40.805587","Long":"-73.947547	",
    "url":"ccccccc","category":"pizza"},
    {"Name": "deli1", "Rating": 5, "Review_Count":10, "Price":"$",
    "Street_Address":"94 Ave B","Zip_code":"10003","Lat":"40.724653","Long":"-73.981702",
    "url":"ddddd","category":"pizza"},
    {"Name": "deli2", "Rating": 4.5, "Review_Count":7777777, "Price":"$",
    "Street_Address":"7803 15th Ave","Zip_code":"11228","Lat":"40.615720","Long":"-74.004820	",
    "url":"eeeeeee","category":"pizza"},
 
]

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/api/v1.0/restaurants")
def restaurant():
    """Return the justice league data as json"""

    return jsonify(restaurants)


@app.route("/")
def welcome():
    return (
        f"Welcome to the NYC Popular Restaurant Test API!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/restaurant"
    )


if __name__ == "__main__":
    app.run(debug=True)
