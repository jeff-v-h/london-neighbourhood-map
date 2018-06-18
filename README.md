# London Neighbourhood Map

## Map Description
This project allows a user to search for businesses within London. It uses the KnockoutJS organisational library for a responsive display alongside the Google Maps API


## Requirements

### Required Libraries and Dependencies

- jQuery 3.3.1
- KnockoutJS 3.4.2
- Google Maps API
- FourSquare API

#### Additional dependencies

These may be required to install the above listed libraries if they are not already there.
- node.js/npm to install bower
- Bower to install jQuery and knockoutJS

### Project Contents

- london-map.html contains the basic layout of the maps page
- css/style.css creates the styling for the page
- js/map.js contains all the JavaScript functioning of the page
- js/mvvm.js contains the ViewModel using KnockoutJS

### Installing jQuery and KnockoutJS

Steps to install if the files are not alrdy within the js and js/lib folders respectively

- Ensure you have node.js installed to use npm. In the command line run `node -v` to see if node.js is installed. If it isn't, visit https://nodejs.org/en/ and download it.
- Ensure Bower is installed via npm with `npm install -g bower`.
- Ensure jQuery is installed with `npm install jquery`. Alternatively visit https://jquery.com/ to download.
- Ensure KnockoutJS is installed with `bower install knockout`.

### Google and FourSquare Developer Accounts
Please visit https://developers.google.com/ and https://developer.foursquare.com to create a developer account. Then create an app for this application to obtain a client_id and client_secret to be able to access the Google Maps API and FourSquare API.