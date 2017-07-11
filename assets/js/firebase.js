var Firebase = (function() {
  var database, searchInput, searchArr;

  function init() {
    // Initialize Firebase
    var config = {
      apiKey: 'AIzaSyBPjrttggZXgEaqFeb2Q7P6pTctxGyxlkQ',
      authDomain: 'lively-3be7f.firebaseapp.com',
      databaseURL: 'https://lively-3be7f.firebaseio.com',
      projectId: 'lively-3be7f',
      storageBucket: 'lively-3be7f.appspot.com',
      messagingSenderId: '752484036952'
    };
    firebase.initializeApp(config);
    database = firebase.database();

    searchArr = [];

    // Load database values on init event - listener detaches after
    database
      .ref()
      .once(
        'value',
        function(snap, y) {
          let obj = snap.val();
          for (var i in obj) {
            if (obj[i].searchInput != null) {
              searchArr.push(obj[i].searchInput);
            }
          }
        },
        function(error) {
          console.error('DB error: ', error);
        }
      )
      .then(() => EVT.emit('databaseReady')); // called after database values have been processed - alert that database is ready
  }

  function newSearch(event, params) {
    // params are received from 'search' event - params may be artist or venue
    // store the search term temporarily until search term is validated
    searchInput = params.keyword.replace(/\+/, ' '); // remove any + that was used for URL
  }

  function storeSearch() {
    // search term had valid results, so store in memory and DB
    if (searchArr.indexOf(searchInput) >= 0) {
      return;
    }
    searchArr.push(searchInput); // add search term to in memory array

    // add search term to database for data persistence
    database.ref().push({
      searchInput: searchInput
    });
  }

  function getNextAttraction() {
    var i = -1;
    return nextAttraction; // return a function reference
    function nextAttraction() {
      if (i === searchArr.length - 1) {
        // i is at end of array, so reset to beginning
        i = 0;
      } else {
        // i is not at end, so incrememnt
        i++;
      }
      return searchArr[i].replace(/\+/, ' '); // make sure string doesn't have a + in it
    }
  }

  EVT.on('init', init); // listen for init event
  EVT.on('search', newSearch); // listen for search event
  EVT.on('resultsValid', storeSearch); // listen for a valid search event

  // public API
  return {
    getNextAttraction: getNextAttraction
  };
})();
