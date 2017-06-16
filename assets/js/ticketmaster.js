'use strict';

var TicketMaster = (function() {
  let apiKey = '8XlOGLUKhcwBVxoH5g39eY2mBvyz8iAm';

  // Build URL
  function buildUrl(rootUrl, params) {
    for (var n in params) {
      if (params.hasOwnProperty(n)) {
        if (typeof params[n] === 'string') {
          params[n] = params[n].replace(/ /g, '%20');
        }
        rootUrl += `&${n}=${params[n]}`;
      }
    }

    rootUrl += `&apikey=${apiKey}`;
    return rootUrl;
  }

  // Event search
  function eventSearch(params) {
    return new Promise((resolve, reject) => {
      let rootUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?';
      let url = buildUrl(rootUrl, params);
      console.log(url);
      $.ajax({
        type: 'GET',
        url: url,
        async: true,
        dataType: 'json',
        success: function(json) {
          resolve(json);
        },
        error: function(xhr, status, err) {
          reject(err);
        }
      });
    });
  }

  // Artist search
  return {
    eventSearch: eventSearch
  };
})();

TicketMaster.eventSearch({
  keyword: 'kings of leon',
  size: 5
})
  .then(function(json) {
    console.log(json);
  })
  .catch(function(err) {
    console.log(err);
  });
