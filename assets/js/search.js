'use strict';

var Search = (function() {
  var $navbarSearchBtn,
    $navbarSearchSelector,
    $navbarSearchField,
    $advSearchBtn,
    $advSearchArtist,
    $advSearchVenue,
    $advSearchCity,
    $advSearchState,
    $advSearchZip,
    $advSearchLocationToggle,
    $advSearchStartDate,
    $advSearchEndDate,
    $advForm,
    $advFormToggleLink,
    $introSearchBtn,
    $introSearchField,
    userGeohash;

  function init() {
    $introSearchField = $('#introSearch');
    $introSearchBtn = $('#introSearchBtn');
    $navbarSearchBtn = $('#navbarSearchBtn');
    $navbarSearchField = $('#navbarSearchText');
    $navbarSearchSelector = $('#navbarSearchType');
    $advSearchBtn = $('#advSearchBtn');
    $advSearchArtist = $('#advSearchArtist');
    $advSearchVenue = $('#advSearchVenue');
    $advSearchCity = $('#advSearchCity');
    $advSearchState = $('#advSearchState');
    $advSearchZip = $('#advSearchZip');
    $advSearchLocationToggle = $('#currentLocationToggle');
    $advSearchStartDate = $('#advSearchStartDate');
    $advSearchEndDate = $('#advSearchEndDate');
    $advForm = $('#advSearch');
    $advFormToggleLink = $('#advSearchToggle');

    $advFormToggleLink.on('click', toggleAdvSearchForm);
    $navbarSearchBtn.on('click', navbarSearch);
    $advSearchBtn.on('click', advSearch);
    $introSearchBtn.on('click', introTronSearch);
    $advSearchLocationToggle.on('click', toggleAdvSearchLocationFields);
  }

  function toggleAdvSearchLocationFields() {
    if ($advSearchCity.prop('disabled')) {
      $("[rel='locationField']").each(function() {
        $(this).prop('disabled', false);
      });
    } else {
      $("[rel='locationField']").each(function() {
        $(this).prop('disabled', true);
      });
    }
  }

  function toggleAdvSearchForm() {
    $advForm.slideToggle();
  }

  function introTronSearch(evt) {
    evt.preventDefault();
    if (!$introSearchField.val().trim()) {
      resetSearchForms();
      return;
    }
    let searchInput = $introSearchField.val().trim();
    EVT.emit('search', 'event', { keyword: searchInput });
  }

  function navbarSearch(evt) {
    evt.preventDefault();
    if (!$navbarSearchField.val().trim()) {
      resetSearchForms();
      return;
    }
    let searchInput = $navbarSearchField.val().trim();
    let searchType = 'event'; // hardcoding for the moment
    // let searchType = $navbarSearchSelector.val();

    let params = { keyword: searchInput };

    EVT.emit('search', searchType, params);
  }

  function advSearch(evt) {
    evt.preventDefault();
    toggleAdvSearchForm();

    let artist, venue, city, state, zip, location, startDate, endDate;
    artist = $advSearchArtist.val().trim();
    venue = $advSearchVenue.val().trim();
    city = $advSearchCity.val().trim();
    state = $advSearchState.val();
    zip = $advSearchZip.val().trim();
    location = $('#currentLocationToggle').prop('checked');
    startDate = $advSearchStartDate.val();
    endDate = $advSearchEndDate.val();
    let searchType = evaluateSearchType([artist, venue, city, state, zip, startDate, endDate]);
    let params = { keyword: '' };

    if (artist) {
      params.keyword += artist;
    }
    if (venue) {
      params.keyword += ' ' + venue;
    }
    if (city) {
      params.city = city;
    }
    if (zip) {
      params.postalCode = zip;
    }
    if (state) {
      params.stateCode = state;
    }

    if (location) {
      params.geoPoint = userGeohash;
    }
    if ($advSearchStartDate.val()) {
      params.startDateTime = convertTime($advSearchStartDate.val());
    }
    if ($advSearchEndDate.val()) {
      params.endDateTime = convertTime($advSearchEndDate.val());
    }

    EVT.emit('search', searchType, params);
  }

  function convertTime(value) {
    // converts a string of format 'YYYY-MM-DD' to 'YYYY-MM-DDTHH:mm:ssZ'
    let time = moment(value).toISOString();
    time = time.slice(0, 19) + 'Z';
    return time;
  }

  function resetSearchForms() {
    $introSearchField.val('');
    $navbarSearchField.val('');
    $advSearchArtist.val('');
    $advSearchVenue.val('');
    $advSearchCity.val('');
    $advSearchState.val('');
    $advSearchZip.val('');
    $advSearchStartDate.val('');
    $advSearchEndDate.val('');
  }

  function evaluateSearchType(searchParams) {
    // TODO update with city, state, and zip
    // let [artist, venue, location, startDate, endDate] = searchParams;
    // let searchType = null;

    // if (artist & !venue & !location & !startDate & !endDate) {
    //   searchType = 'artist';
    // } else if (venue & !artist & !location & !startDate & !endDate) {
    //   searchType = 'venue';
    // } else if (venue & location & !artist & !startDate & !endDate) {
    //   searchType = 'venue';
    // } else {
    //   searchType = 'event';
    // }

    // for now, let's limit search to only events
    let searchType = 'event';
    return searchType;
  }

  function setCurrentLocation(geoPoint) {
    userGeohash = geoPoint;
    $advSearchLocationToggle.prop('disabled', false);
    console.log('User location stored as', geoPoint);
  }

  EVT.on('init', init);
  EVT.on('setUserLocation', setCurrentLocation);
  EVT.on('search', resetSearchForms);

  return {
    setCurrentLocation: setCurrentLocation
  };
})();
