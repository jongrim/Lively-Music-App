'use strict';

var Table = (function() {
  var eventObjects, $tableDiv, $tableBody, $footer, $paginator, $paginatorList, resultsVisilbe, currentPage, totalPages;

  function init() {
    $tableDiv = $('#overflowContent');
    $tableBody = $('#resultsTableBody');
    $footer = $('footer');
    $paginator = $('#paginator');
    $paginatorList = $('#paginatorList');
    resultsVisilbe = false;

    (function() {
      window.addEventListener('resize', resizeThrottler, false);

      var resizeTimeout;
      function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
          resizeTimeout = setTimeout(function() {
            resizeTimeout = null;
            setPageElements();

            // The actualResizeHandler will execute at a rate of 15fps
          }, 66);
        }
      }
    })();

    $('#content').on('resizestop', function() {
      setPageElements();
    });
  }

  function setPageElements() {
    let mapRect = document.getElementById('map').getBoundingClientRect();
    let mapHeight = mapRect.height;
    if (resultsVisilbe) {
      setTablePosition(mapHeight);
      setPaginatorPosition();
    }
    setFooterPosition(mapHeight, $tableDiv.height());
  }

  function setTablePosition(mapHeight) {
    $tableDiv.css('top', mapHeight + 'px');
    $tableDiv.removeClass('isHidden');
  }

  function setPaginatorPosition() {
    $paginator.css('top', $tableDiv.position().top + $tableDiv.height() + 'px');
    let leftBorder = window.innerWidth / 2 - $paginator.width() / 2;
    $paginator.css('left', leftBorder);
    showPagination();
  }

  function setFooterPosition(mapHeight = 0, tableHeight = 0) {
    let minTop = Math.max(window.innerHeight - 175, 628);
    let footerTop = Math.max(minTop, mapHeight + tableHeight);
    $footer.css('top', footerTop + 'px');
    if ($paginator.position().top > $footer.position().top) {
      footerTop = $paginator.position().top + 91; // to account for pagination element height
    }
    $footer.css('top', footerTop + 'px');
  }

  function createPages(pageCount) {
    let pageArray = [];
    let $pagePrev = $(`<li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`);
    $pagePrev.on('click', previousPage);
    pageArray.push($pagePrev);
    for (var i = 0; i < pageCount; i++) {
      let $page = $(`<li data-page=${i}><a href="#">${i + 1}</a></li>`);
      $page.on('click', loadPage);
      pageArray.push($page);
    }
    let $pageNext = $(`<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`);
    $pageNext.on('click', nextPage);
    pageArray.push($pageNext);
    $paginatorList.html(pageArray);
  }

  function showPagination() {
    $paginator.removeClass('isHidden');
  }

  function hidePagination() {
    $paginator.addClass('isHidden');
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
    setPageElements();
  }

  function processEventResults(json) {
    // console.log('tables got these results', json);
    currentPage = json.page.number;
    totalPages = json.page.totalPages;
    createPages(totalPages);
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

  function previousPage(evt) {
    evt.preventDefault();
    if (currentPage > 0) {
      let page = String(currentPage - 1);
      Search.repeatSearchWithPage(page);
    }
  }

  function nextPage(evt) {
    evt.preventDefault();
    if (currentPage < totalPages - 1) {
      let page = String(currentPage + 1);
      Search.repeatSearchWithPage(page);
    }
  }

  function loadPage(evt) {
    evt.preventDefault();
    Search.repeatSearchWithPage($(this).attr('data-page'));
  }

  EVT.on('resultsValid', processEventResults);
  EVT.on('resetToInitialView', hideTable);
  EVT.on('resetToInitialView', hidePagination);
  EVT.on('resetToInitialView', setFooterPosition);
  EVT.on('init', init);
})();
