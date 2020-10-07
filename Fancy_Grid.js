
  document.addEventListener("DOMContentLoaded", function() {
    new FancyGrid({
      theme: 'extra-gray',
      title: 'JSON Data',
      renderTo: 'container',
      width: 550,
      height: 400,
      data: {proxy: {
		    type: 'rest',
		    url: "http://127.0.0.1:5000/api/v1.0/restaurants"
		  }},
      defaults: {
        type: 'string',
        width: 100,
        sortable: true
      },
      columns: [{
        index: 'Category',
        title: 'Category'
      }, {
        index: 'Latitude',
        title: 'Latitude',
        type: 'number'
      }, {
        index: 'Longitude',
        title: 'Longitude',
        type: 'number'
      },{
        index: 'Name',
        title: 'Name'
      }, {
        index: 'Price',
        width: 60,
        title: 'Price',
      },{
        index: 'Rating',
        title: 'Rating',
        type: 'number'
      },{
        index: 'Review Count',
        title: 'Review Count',
        type: 'number'
      },{
        index: 'Address',
        title: 'Address',
      },
      {
        index: 'URL',
        title: 'URL',
      },{
        index: 'Zip Code',
        title: 'Zip Code',
        type: 'number'
        }]})});
