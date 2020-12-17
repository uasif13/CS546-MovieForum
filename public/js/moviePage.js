$(document).ready(function () {
  $("a#rec").click(function (event) {
    event.preventDefault();
    $("#post").css({ display: "none" });
    $("#recommendations").empty();
    let title = $("#title");
    $.ajax({
      method: "GET",
      data: {
        api_key: "2c5709ff90e8aeb0f12febf13b682fa8",
        query: title.text(),
        language: "en-US",
        page: 1,
      },
      url: "http://api.themoviedb.org/3/search/movie",
    }).then(function (movies) {
      $.ajax({
        method: "GET",
        data: {
          api_key: "2c5709ff90e8aeb0f12febf13b682fa8",
        },
        url:
          "http://api.themoviedb.org/3/movie/" +
          movies.results[0].id +
          "/recommendations",
      })
        .then(function (recs) {
          $.each(recs.results, function (i, data) {
            $("#recommendations").append("<li>" + data.title + "</a></li");
          });
        })
        .then(function () {
          $("#hideLink").css({ display: "block" });
          $("#recomendations").css({ display: "block" });
          $("#rec").css({ display: "none" });
          $("#recTitle").css({ display: "block" });
        });
    });
  });
});
