var center;
var pos;
var input = "Grocery Store";
var origin;
var destination;

var directionsService;
var directionsDisplay;

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a pick list containing a mix of places and predicted search terms.
function initMap() {

  // Create the search box and link it to the UI element.
  var input = document.getElementById('searchInput');
  console.log(input);


  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    mapTypeId: 'roadmap'
  });
  var infoWindow = new google.maps.InfoWindow;

  // GETS USERS GEOLOCATION
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        pos = center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(pos);
        console.log(infoWindow);
        console.log(directionsService);
        console.log(directionsDisplay);

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
      },

      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  var searchBox = new google.maps.places.SearchBox(input);


  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// Browser doesn't support Geolocation Function
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


directionsService = new google.maps.DirectionsService;
directionsDisplay = new google.maps.DirectionsRenderer;
map = new google.maps.Map(document.getElementById('map'), {});


directionsDisplay.setMap(map);

var onChangeHandler = function () {
  calculateAndDisplayRoute(directionsService, directionsDisplay);
};


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: pos,
    destination: google.maps.Place,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}


initMap();