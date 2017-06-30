'use strict';

var Nav = (function() {
  let $navbarCollapse;

  function init() {
    $navbarCollapse = $('#navbar-collapse');
  }

  function toggleCollapse() {
    $navbarCollapse.collapse('toggle');
  }

  function handleSearch() {
    if (window.innerWidth < 768) {
      if ($('#navbar-collapse:visible').length === 1) {
        toggleCollapse();
      }
    }
  }

  EVT.on('init', init);
  EVT.on('search', handleSearch);
})();
