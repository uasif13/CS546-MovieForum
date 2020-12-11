$(document).ready(function () {
  counter = 0;
  $.ajax({
    method: "GET",
    data: {
      api_key: "2c5709ff90e8aeb0f12febf13b682fa8",
    },
    url: "http://api.themoviedb.org/3/movie/popular",
  })
    .then(function (shows) {
      $.each(shows.results, function (i, data) {
        counter++;
        $("#movieList").append("<li class='link'>" + data.title + "</li>");
      });
    })
    .then(function () {
      $("#movieList").css({ display: "block" });
    });
});
// apikey 2c5709ff90e8aeb0f12febf13b682fa8
