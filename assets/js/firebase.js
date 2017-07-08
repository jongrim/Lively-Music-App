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
      .then(() => EVT.emit('databaseReady'));
  }
  // --------------------------------------------------

  function jsUcfirst(string) {
    searchInput = string.charAt(0).toUpperCase() + string.slice(1);
  }

  // --------------------------------------------------

  function newSearch(event, params) {
    searchInput = params.keyword.replace(/\+/, ' ');

    jsUcfirst(searchInput);
    searchArr.push(searchInput);

    database.ref().push({
      searchInput: searchInput
    });
  }

  // --------------------------------------------------


  function getNextAttraction() {
    var i = -1;
    return nextAttraction;
    function nextAttraction() {
      if (i === searchArr.length - 1) {
        i = 0;
      } else {
        i++;
      }
      return searchArr[i].replace(/\+/, ' ');
    }
  }

  EVT.on('init', init);
  EVT.on('search', newSearch);

  // public API
  return {
    getNextAttraction: getNextAttraction
  };
  
})();