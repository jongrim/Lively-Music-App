window.EVT = new EventEmitter2();

var App = (function() {
  var $introTron, $trendingTron, $trendingAttraction, trendingInterval, $noResultsModal, $loadingSpinner, $brandLetter;
  let cycleAttractions = getNextAttraction();

  function init() {
    $introTron = $('.introTron');
    $trendingTron = $('.trendingTron');
    $trendingAttraction = $('#trendingAttraction');
    $noResultsModal = $('#noResultsModal');
    $loadingSpinner = $('#loadingSpinner');
    $brandLetter = $('#brandLetter');

    updateTrending();
    trendingInterval = setInterval(updateTrending, 3000);

    $brandLetter.on('click', resetToInitialView);
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

  function resetToInitialView() {
    EVT.emit('resetToInitialView');
    $introTron.fadeIn();
    $trendingTron.fadeIn();
    trendingInterval = setInterval(updateTrending, 3000);
  }

  function executeSearch(searchType, params) {
    hideTrons();

    // for now, everything points to an event search
    if (searchType === 'event') {
      toggleLoadingSpinner();
      TicketMaster.eventSearch(params)
        .then(function(results) {
          toggleLoadingSpinner();
          EVT.emit('eventResultsReturned', results);
        })
        .catch(function(err) {
          console.error(err);
          resetToInitialView();
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

  function displayNoResultsModal() {
    $('#noResultsModal').modal({
      keyboard: true,
      show: true
    });
  }

  function toggleLoadingSpinner() {
    if (!$loadingSpinner.hasClass('spinner')) {
      $loadingSpinner.addClass('spinner');
    } else {
      $loadingSpinner.removeClass('spinner');
    }
  }

  EVT.on('init', init);
  EVT.on('search', executeSearch);
  EVT.on('noResults', displayNoResultsModal);

  return {
    requestUserLocation: requestUserLocation
  };
})();

App.requestUserLocation();

$(document).ready(function() {
  EVT.emit('init');
});
