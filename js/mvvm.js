// Separate JavaScript file for the ViewModel. The data is currently in map.js

// A function to create an object with observables for each bar item 
var Bar = function(data) {
  var self = this;
  self.name = ko.observable(data.name);
  self.location = ko.observable(data.location);
  self.id = ko.observable(data.id);
}

// The View Model to deal with everything that happens on the page
var ViewModel = function() {
  var self = this;
  self.barList = ko.observableArray([]);

  // Push initial default bars into the barList
  bars.forEach(function(barItem) {
    self.barList.push( new Bar(barItem) );
  });


  createMarkers(bars);

  // When the zoom button is clicked, call the zoomToArea function which
  // zooms into the area specified and call the FourSquaredata function to 
  // get places data for that location
  document.getElementById('zoom-btn').addEventListener('click', function() {
    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-text').value;
    // Make sure the address isn't blank
    if (address == '') {
      window.alert('You must enter an area or address.');
    } else {
      // Call functions to zoom to the are on google maps
      // and to obtain data from FourSquare to make markers and infowindows
      zoomToArea(address);
      getFourSquareData(address);
    }
  });

  // Function to remove all bars from bars Aray
  self.cleanList = function() {
    self.barList([]);
    console.log(self.barList());
  }

  // When this function is called, the barList is cleaned and replaced with the current 
  // list of bars in the bars array
  self.updateList = function() {
    bars.forEach(function(barItem) {
      self.barList.push( new Bar(barItem) );
    });
    console.log(self.barList())
  }
}
