var Firebase = (function() {
  var database, searchInput, searchArr;

  function init() {
    // Initialize Firebase
    var config = {
      apiKey: 'AIzaSyDRp6dE1LX_Fa9jdjfPMwxy9e2rhN0T0IA',
      authDomain: 'lively-music-app.firebaseapp.com',
      databaseURL: 'https://lively-music-app.firebaseio.com',
      projectId: 'lively-music-app',
      storageBucket: '',
      messagingSenderId: '524607575754'
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
  // --------------------------------------------------

  function jsUcfirst(string) {
    searchInput = string.charAt(0).toUpperCase() + string.slice(1);
  }

  // --------------------------------------------------
  function newSearch(event, params) {
    // params are received from 'search' event - params may be artist or venue
    // store the search term temporarily until search term is validated
    searchInput = params.keyword.replace(/\+/, ' '); // remove any + that was used for URL
    jsUcfirst(searchInput);
  }

  function storeSearch() {
    // search term had valid results, so store in memory and DB
    searchArr.push(searchInput); // add search term to in memory array

    // add search term to database for data persistence
    database.ref().push({
      searchInput: searchInput
    });
  }

  // --------------------------------------------------

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
