window.EVT = new EventEmitter2();

var App = (function() {
  var $introTron, $trendingTron, $trendingAttraction, trendingInterval;
  let cycleAttractions = getNextAttraction();

  function init() {
    $introTron = $('.introTron');
    $trendingTron = $('.trendingTron');
    $trendingAttraction = $('#trendingAttraction');

    updateTrending();
    trendingInterval = setInterval(updateTrending, 3000);
  }

  function updateTrending() {
    $trendingAttraction.fadeOut(600, function() {
      $trendingAttraction.text(cycleAttractions());
      $trendingAttraction.fadeIn();
    });
  }

  function getNextAttraction() {
    var i = -1;
    let trendingAttractions = ['Beyonce', 'Kings of Leon', 'Muse', 'The Killers'];
    function nextAttraction() {
      if (i === trendingAttractions.length - 1) {
        i = 0;
      } else {
        i++;
      }
      return trendingAttractions[i];
    }
    return nextAttraction;
  }

  function requestUserLocation() {
    Geolocator.getUserLocation()
      .then(function(coords) {
        let geoPoint = Geohash.encode(coords[0], coords[1], 8);
        EVT.emit('setUserLocation', geoPoint);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function hideTrons() {
    window.clearInterval(trendingInterval);
    $introTron.hide();
    $trendingTron.hide();
  }

  function executeSearch(searchType, params) {
    hideTrons();

    // for now, everything points to an event search
    if (searchType === 'event') {
      TicketMaster.eventSearch(params)
        .then(function(results) {
          EVT.emit('eventResultsReturned', results);
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
