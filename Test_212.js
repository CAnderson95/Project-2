//BASIC MAP SETUP
// TEST 212
queryUrl = "http://127.0.0.1:5000/api/v1.0/restaurants"


// var myMap = L.map("map", {
//   center: [40.7128, -74.0059],
//   zoom: 11
// });

// Adding tile layer


// MARKERS
// Initialize all of the LayerGroups we'll be using
var layers = {
  Pizza: new L.LayerGroup(),
  Bagels: new L.LayerGroup(),
  Street_Carts: new L.LayerGroup(),
  Delis: new L.LayerGroup()
};
// Create the map with our layers
var map = L.map("map", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [
    layers.Pizza,
    layers.Bagels,
    layers.Street_Carts,
    layers.Delis
  ]
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: "pk.eyJ1IjoibWluZGllcGFpZ2UiLCJhIjoiY2tmNzRuYXRiMGJxZDJydDJmaDB0aWRjZiJ9.axosagi2CNlU8dhurKyKJQ"
}).addTo(map);

// Add our 'lightmap' tile layer to the map

// Create an overlays object to add to the layer control
var overlays = {
  "Pizza": layers.Pizza,
  "Bagels": layers.Bagels,
  "Street_Carts": layers.Street_Carts,
  "Delis": layers.Delis
};
// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);
// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});
// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);
// Initialize an object containing icons for each layer group
//CHANGE THE ICONS TO BE SPECIFIC TO THIS ACTIVITY AND NOT PAST ACTIVITIES
var icons = {
  Pizza: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  Bagels: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  Street_Carts: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "blue-dark",
    shape: "penta"
  }),
  Delis: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  })
};
// Turn this entire thing into a fucntion BuildMap
d3.request(queryUrl).get(response => {
  // Once we get a response, send the data.features object to the createFeatures function
  //createFeatures(data.features);
  // console.log(JSON.parse(response.response));
  var RestaurantMarker;
  response = JSON.parse(response.response)
  console.log(response)
  for (var i = 0; i < response.length; i++) {

    // Conditionals for countries points
    var color = "";
    if (response[i].category = "Pizza") {
      color = "yellow";
      RestaurantMarker = "Pizza"
    }
    else if (response[i].category = "Bagel") {
      color = "blue";
      RestaurantMarker = "Bagel"
    }
    else if (response[i].category = "Deli") {
      color = "green";
      RestaurantMarker = "Deli"
    }
    else {
      color = "red";
      RestaurantMarker = "Street_Carts"
    }

    var newMarker = L.marker([response[i].Latitude, response[i].Longitude], {
      icon: icons[RestaurantMarker]
      // scale: 300,
    }).addTo(map);


    // Add the new marker to the appropriate layer
    newMarker.addTo(layers[RestaurantMarker]);

    // Bind a popup to the marker that will  display on click. This will be rendered as HTML
    newMarker.bindPopup("<h1>" + response[i].Name + "</h1> <hr> <h2>" + "Rating: " + response[i].Rating + "</h2> <h2>" + "Price: " + response[i].Price + " </h2>");

    newMarker.customName = response[i].Name

    // L.marker([10.496093,-66.881935]).addTo(map).on('mouseover', onClick);
    newMarker.on("click", onClick)

    d3.request(queryUrl).get(data => {
      data = JSON.parse(data.response)
      var tableData = data;
      
      var table = d3.select("tbody");
      function buildtable(data) {
          table.html("");
          data.forEach((filter) => {
              var rowinfo = table.append("tr");
              Object.entries(filter).forEach(([key, value]) => {
                var cell = rowinfo.append("td");
                cell.text(value);
              });
      });
      }
      buildtable(tableData) 
    
      
    //create a function for multple filters to take the input and find the data associated with it
    function multiplefilter() {
      //select the use input
      var element = d3.select(this).select("input");
      //find the value associated with the input 
      var item = element.property("value");
      var id = element.attr("id");
      //if the value matches the filter id in the table, show only that information and do not show the other information matching with it 
      if (item) {
        filters[id] = item;
      }
      else {
        delete filters[id];
      }
      //when you click the button
      buttonclick();
    }
    
    
    //add a function for when you click the button 
    function buttonclick(){
        d3.event.preventDefault();
        //create variables using the user input from the filtered data
        var filtered = tableData;
        //uses the entries from the different filters to determine what to search for using the keys and values 
        Object.entries(filters).forEach(([key, value]) => {
          if(key == "Zip Code" | key == "Rating"){
            filtered = filtered.filter(row => row[key] === parseInt(value))
          } else{
            filtered = filtered.filter(row => row[key] === value)
          }
        });
          //build a new table depending on the filtered data - if the user input does not match any of the existing data
        //it will return a blank table
          buildtable(filtered);
      };
      //uses d3 on the class of the button in the HTML to run this function when the button is clicked on 
      //the webpage
      d3.selectAll("#filter-btn").on("click", buttonclick);
      //uses d3 to change the filter 
      d3.selectAll(".filter").on("change", multiplefilter);
    
    
      
      function onClick(e) {
        console.log(e);
        console.log(e.target.customName)
        
        d3.request(queryUrl).get(data => {
          
          data = JSON.parse(data.response)
          var tableData = data;
          tableData = tableData.filter(row => row.Name === e.target.customName)
          buildtable(tableData)
        })
      }
    
    });
    
    // // Add circles to map
    // L.circle(response[i].location, {
    //   fillOpacity: 0.75,
    //   color: "white",
    //   fillColor: color,
    //   // Adjust radius
    //   // radius: response[i].points * 1500 SEE WHAT ADJUSTMENTS WE NEED TO MAKE
    // }).bindPopup("<h1>" + response[i].name + "</h1> <hr> <h3>Points: " + response[i].points + "</h3>").addTo(myMap);
  }

});

// cd Leafunction markerClick(event){
//   console.log(event.latlng)
//   lat = event.latlng.Lat
//   lng = event.latlng.lng
//   INSTRUCTIONS FOR TYING THE TABLE AND MAP VIA EVENT HANDLERS
//   create dynamic route in app.py that takes in a latlng, 
//   then we would call a d3 on that and it would pass back all of the data based on what we filtered
//   in the promise, you would call RenderTable(data) function

//   // from data.js


// };



// /// NTA SEPERATIONS
function chooseColor(borough) {
  switch (borough) {
    case "Brooklyn":
      return "yellow";
    case "Bronx":
      return "red";
    case "Manhattan":
      return "orange";
    case "Queens":
      return "green";
    case "Staten Island":
      return "purple";
    default:
      return "black";
  }
}

var link = "http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
  "35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";

d3.json(link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function (feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.properties.borough),
        fillOpacity: 0.2,
        weight: 1.0
      };
    },
    // Called on each feature
    onEachFeature: function (feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function (event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.2
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function (event) {
          console.log(event.target.getBounds())
          myMap.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");

    }
  }).addTo(map);
});