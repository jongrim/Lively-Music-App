'use strict';

var Search = (function() {
  var $navbarSearchBtn,
    $navbarSearchField,
    $advSearchBtn,
    $closeSearchBtn,
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
    userGeohash,
    lastSearch;

  function init() {
    $introSearchField = $('#introSearch');
    $introSearchBtn = $('#introSearchBtn');
    $navbarSearchBtn = $('#navbarSearchBtn');
    $navbarSearchField = $('#navbarSearchText');
    $advSearchBtn = $('#advSearchBtn');
    $advSearchArtist = $('#advSearchArtist');
    $advSearchVenue = $('#advSearchVenue');
    $advSearchCity = $('#advSearchCity');
    $advSearchState = $('#advSearchState');
    $advSearchZip = $('#advSearchZip');
    $advSearchLocationToggle = $('#currentLocationToggle');

    $advSearchStartDate = $('#advSearchStartDate');
    $advSearchStartDate.attr('min', moment().format('YYYY-MM-DD'));
    $advSearchEndDate = $('#advSearchEndDate');

    $advForm = $('#advSearch');
    $advFormToggleLink = $('#advSearchToggle');
    $closeSearchBtn = $('#closeSearch');

    $closeSearchBtn.on('click', toggleAdvSearchForm);
    $advFormToggleLink.on('click', toggleAdvSearchForm);
    $navbarSearchBtn.on('click', navbarSearch);
    $advSearchBtn.on('click', advSearch);
    $introSearchBtn.on('click', introTronSearch);
    $advSearchLocationToggle.on('click', toggleAdvSearchLocationFields);
  }

  function setLastSearch(params) {
    lastSearch = params;
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
    setLastSearch({ keyword: searchInput });
  }

  function navbarSearch(evt) {
    evt.preventDefault();
    if (!$navbarSearchField.val().trim()) {
      resetSearchForms();
      return;
    }
    let searchInput = $navbarSearchField.val().trim();
    let searchType = 'event';

    let params = { keyword: searchInput };

    EVT.emit('search', searchType, params);
    setLastSearch(params);
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
    startDate = $advSearchStartDate.val().trim();
    endDate = $advSearchEndDate.val().trim();
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
    if (isValidDate(startDate)) {
      params.startDateTime = convertTime(startDate);
    }
    if (isValidDate(endDate)) {
      params.endDateTime = convertTime(endDate);
    }

    EVT.emit('search', searchType, params);
    setLastSearch(params);
  }

  function convertTime(value) {
    // converts a string of format 'YYYY-MM-DD' to 'YYYY-MM-DDTHH:mm:ssZ'
    let time = moment(value).toISOString();
    time = time.slice(0, 19) + 'Z';
    return time;
  }

  function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.match(regEx) != null;
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

  function repeatSearchWithPage(page) {
    if (typeof page === 'string') {
      lastSearch.page = page;
      EVT.emit('search', 'event', lastSearch);
    }
  }

  EVT.on('init', init);
  EVT.on('setUserLocation', setCurrentLocation);
  EVT.on('search', resetSearchForms);

  return {
    setCurrentLocation: setCurrentLocation,
    repeatSearchWithPage: repeatSearchWithPage
  };
})();
