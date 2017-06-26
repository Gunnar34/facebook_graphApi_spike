$(document).ready(function(){
  getAccess();
  $('#run').on('click', getEvents);
  $('#run2').on('click', getLocate);
  $("#loc").click(function() {
    navigator.geolocation.getCurrentPosition(foundLocation);
  });
});
  var lat;
  var lon;

function foundLocation(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(lat, lon);
  }

function getLocate(){
  var address = $('#address').val();
  $('#address').val('');
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDkOxLuMR4oPJ_3UYb_40xr3ZsM4melZz4';
  $.ajax({
      type: 'GET',
      url:  url,
      success: function( response) {
        console.log(response);
        console.log(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng);
        lat = response.results[0].geometry.location.lat;
        lon = response.results[0].geometry.location.lng;
      }
    });
}



var accessToken;

function getAccess() {
  $.ajax({
      type: 'GET',
      url: '/access',
      success: function( response) {
        console.log(response);
         accessToken = response;
      }
    });
}

function getEvents() {
  var time = (Math.floor(Date.now() / 1000)) + 172800;    //current time in unix code
  console.log(time);
  console.log(accessToken);     //access to graph API
  if (lat === undefined || lon === undefined) {
      lat = 44.986656;
      lon = -93.258133;
  }
  url = 'http://localhost:3000/events?lat=' + lat + '&lng=' + lon + '&distance=9000&until=' + time + '&sort=popularity&accessToken=';
  url += accessToken;
  $.ajax({
      type: 'GET',
      url:  url,
      success: function( response) {
        console.log(response);
        var events = response.events;
        $('#output').empty();
        for (var i = 0; i < events.length; i++) {
          if (events[i].coverPicture === null) {
            events[i].coverPicture = '/images/no-image-available.png';
          }
          var start = new Date(events[i].startTime);
          var startTime = (dateFormat(start, "dddd, mmmm dS, yyyy, h:MM:ss TT")); //beutify date with JS vendor
          var end = new Date(events[i].endTime);
          var endTime = (dateFormat(end, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
          $('#output').append('<h1>' + events[i].name + ':</h1><img src="' + events[i].coverPicture + '"><br><p>' +
          'Attending: ' + events[i].stats.attending + ' Maybe: ' + events[i].stats.maybe + '</p></br><p>' +
          events[i].venue.location.city + ', ' + events[i].venue.location.street + ', ' + events[i].venue.location.zip +
          '</p><br><p>' + events[i].description + '</p><br><p>' + startTime + ' - ' + endTime + '</p>');
        }
      }
    });
}
