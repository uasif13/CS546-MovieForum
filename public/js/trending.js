$(document).ready(function () {
  $("a#rec").click(function (event) {
    event.preventDefault();
    $("#post").css({ display: "none" });
    $("#recommendations").empty();
    let currentId = $(this).attr("href");
    $.ajax({
      method: "GET",
      data: {
        api_key: "2c5709ff90e8aeb0f12febf13b682fa8",
      },
      url: "http://api.themoviedb.org/3/movie" + currentId + "/recommendations",
    })
      .then(function (movies) {
        $.each(movies.results, function (i, data) {
          $("#recommendations").append("<li>" + data.title + "</a></li");
        });
      })
      .then(function () {
        $("#reccomendations").css({ display: "block" });
        $("#rec").css({ display: "none" });
        $("#postLink").css({ display: "block" });
        $("#recTitle").css({ display: "block" });
      });
  });
});
