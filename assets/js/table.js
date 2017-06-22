'use strict';

var Table = (function() {
  var eventObjects, $tableDiv, $tableBody, $footer, resultsVisilbe;

  function init() {
    $tableDiv = $('#overflowContent');
    $tableBody = $('#resultsTableBody');
    $footer = $('footer');
    resultsVisilbe = false;

    window.addEventListener('resize', setTablePosition);
    $('#content').on('resizestop', function() {
      setTablePosition();
    });
  }

  function setTablePosition() {
    let mapRect = document.getElementById('map').getBoundingClientRect();
    let mapHeight = mapRect.bottom - mapRect.top;
    let tableHeight = 0;
    if (resultsVisilbe) {
      $tableDiv.css('top', mapRect.bottom - mapRect.top + 'px');
      $tableDiv.css('visibility', 'hidden');
      $tableDiv.removeClass('isHidden');
      let tableRect = document.getElementById('overflowContent').getBoundingClientRect();
      tableHeight = tableRect.bottom - tableRect.top;
      $tableDiv.css('visibility', 'visible');
    }
    setFooterPosition(mapHeight, tableHeight);
  }

  function setFooterPosition(mapHeight = 0, tableHeight = 0) {
    let minTop = Math.max(window.innerHeight - 175, 667);
    let footerTop = Math.max(minTop, mapHeight + tableHeight);
    $footer.css('top', footerTop + 'px');
  }

  function hideTable() {
    $tableDiv.addClass('isHidden');
    resultsVisilbe = false;
  }

  function clearTableBody() {
    $tableBody.empty();
  }

  function createHTMLTable() {
    for (var i = 0; i < eventObjects.length; i++) {
      var eName = eventObjects[i].name;
      var eCity = eventObjects[i].venue.city;
      var eVenue = eventObjects[i].venue.name;
      var eDate = moment(eventObjects[i].startDate).format('dddd, MMM Do YYYY');

      $tableBody.append(
        '<tr><td>' + eName + '</td><td>' + eVenue + '</td><td>' + eCity + '</td><td>' + eDate + '</td></tr>'
      );
    }
    resultsVisilbe = true;
    setTablePosition();
  }

  function processEventResults(json) {
    console.log('tables got these results', json);

    var events = json._embedded.events;
    eventObjects = events.map(event => {
      return {
        name: event.name,
        startDate: event.dates.start.localDate,
        venue: {
          name: event._embedded.venues[0].name,
          city: event._embedded.venues[0].city.name
        }
      };
    });
    clearTableBody();
    createHTMLTable();
  }

  EVT.on('resultsValid', processEventResults);
  EVT.on('resetToInitialView', hideTable);
  EVT.on('resetToInitialView', setFooterPosition);
  EVT.on('init', init);
})();
