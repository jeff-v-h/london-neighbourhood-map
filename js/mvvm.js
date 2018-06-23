// Separate JavaScript file for the ViewModel. The data is currently in map.js

// A function to create an object with observables for each bar item 
var Bar = function(data) {
  var self = this;
  self.name = data.name;
  self.location = data.location;
  self.id = data.id;  
}

// The View Model to deal with everything that happens on the page
var ViewModel = function() {
  var self = this;
  self.barList = ko.observableArray([]);

  // Push initial default bars into the barList
  bars.forEach(function(bar) {
    self.barList.push( new Bar(bar) );
  });

  // Create markers for each of the default bars
  createMarkers(bars);

  self.searchLocation = function() {
    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-text').value;
    // Make sure the address isn't blank
    if (address == '') {
      window.alert('You must enter an area or address.');
    } else {
      // Call functions to zoom to the are on google maps
      // and to obtain data from FourSquare to make markers and infowindows
      zoomToArea(address);
      self.getFourSquareData(address);
      
    }
  };

  // function for a get request to FourSquare to search the address specified
  // On success, it will call a function to create markers for each place
  self.getFourSquareData = function(address) {
    var fourSquareUrl = 'https://api.foursquare.com/v2/venues/search';
    $.ajax({
      method: 'GET',
      url: fourSquareUrl,
      dataType: 'json',
      data: {
        'client_id': client_id,
        'client_secret': client_secret,
        'near': address,
        // date/v is required for API call to work for FourSquare
        'v': '20180618',
        // categoryId specifies search to bars, breweries and lounges
        'categoryId': '4bf58dd8d48988d116941735,50327c8591d4c4b30a586d5d,4bf58dd8d48988d121941735',
        'radius': '300'
      },
      success: function(data) {
        var venueList = data.response.venues;
        console.log(venueList);
        // Check to see if there are any venues returned
        if (venueList.length == 0) {
          window.alert('No bars were found in this area.');
        } else {
          // Clear barList first
          self.barList([]);
          // Push each bar into the barList array. This should automatically update html <ul>
          venueList.forEach(function(bar) {
            self.barList.push( new Bar(bar) );
          });
          // Create markers for each of the venues
          createMarkers(venueList);
        }
      },
      error: function(err) {
        console.log('error:' + err);
        window.alert('An error occurred when finding bars in your specified location. Please check spelling');
        return false;
      }
    });
  }

}
