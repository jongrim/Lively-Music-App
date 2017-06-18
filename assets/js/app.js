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
        let geoPoint = Geohash.encode(coords[0], coords[1], 8);
        EVT.emit('search', 'event', { geoPoint: geoPoint });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function executeSearch(searchType, params) {
    // for now, everything points to an event search
    if (searchType === 'event') {
      TicketMaster.eventSearch(params)
        .then(function(results) {
          console.log(results);
        })
        .catch(function(err) {
          console.error(err);
        });
    } else if (searchType === 'artist') {
      TicketMaster.eventSearch(params)
        .then(function(results) {
          console.log(results);
        })
        .catch(function(err) {
          console.error(err);
        });
    } else if (searchType === 'venue') {
      TicketMaster.eventSearch(params)
        .then(function(results) {
          console.log(results);
        })
        .catch(function(err) {
          console.error(err);
        });
    }
  }

  EVT.on('init', init);
  EVT.on('search', executeSearch);

  return {
    requestUserLocation: requestUserLocation
  };
})();

App.requestUserLocation();

$(document).ready(function() {
  EVT.emit('init');
});
