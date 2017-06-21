var Validator = (function() {
  function validateEventResults(json) {
    if (json.page.totalElements === 0) {
      EVT.emit('noResults');
    } else {
      EVT.emit('resultsValid', json);
    }
  }
  EVT.on('eventResultsReturned', validateEventResults);
})();
