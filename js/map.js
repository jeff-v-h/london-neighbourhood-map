var map;

// Create a new blank array for all the listing markers
var markers = [];

function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.5088, lng: -0.1268},
    zoom: 13
  });

  // A few initial listings of bars to start off with. Later to get data from database 
  var bars = [
    {title: 'Oriole Bar', location: {lat: 51.518946, lng: -0.102813}},
    {title: 'Big Easy Bar', location: {lat: 51.510816, lng: -0.122995}},
    {title: 'Milroy's, location: {lat: 51.514851, lng: -0.131304}},
    {title: 'The Worlds End', location: {lat: 51.567018, lng: -0.108246}},
    {title: 'The Faltering Fullback', location: {lat: 51.568619, lng: -0.108182}},
    {title: 'London Cocktail Club', location: {lat: 51.523940, lng: -0.073050}},
    {title: 'Bar Kick', location: {lat: 51.526970, lng: -0.078200}},
    {title: 'Shakespeares Head', location: {lat: 51.513734, lng: -0.139550}}
  ]	;
}
