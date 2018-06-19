// Separate JavaScript file for the ViewModel. The data is currently in map.js

// A function to create an object with observables for each bar item 
var Bar = function(data) {
  var self = this;
  self.name = ko.observable(data.name);
  self.location = ko.observable(data.location);
}

// The View Model to deal with everything that happens on the page
var ViewModel = function() {
  var self = this;

  // Initialise an observable array with all the selected bars
  self.barList = ko.observableArray([]);
  bars.forEach(function(barItem) {
    self.barList.push( new Bar(barItem) );
  });
}

// Apply bindings to get ViewModel to work
ko.applyBindings(new ViewModel());
