window.EVT = new EventEmitter2();

var App = (function() {
  let $advForm, $advFormToggleLink;

  function init() {
    $advForm = $('#advSearch');
    $advFormToggleLink = $('#advSearchToggle');

    $advFormToggleLink.on('click', toggleAdvSearchForm);
  }

  function toggleAdvSearchForm() {
    $advForm.slideToggle();
  }

  function requestUserLocation() {
    Geolocator.getUserLocation()
      .then(function(coords) {
        let geoPoint = Geohash.encode(coords[0], coords[1]);
        EVT.emit('search', 'event', { geoPoint: geoPoint });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  EVT.on('init', init);

  return {
    requestUserLocation: requestUserLocation
  };
})();

App.requestUserLocation();

$(document).ready(function() {
  EVT.emit('init');
});
