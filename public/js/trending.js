$(document).ready(function () {
  counter = 0;
  $.ajax({
    method: "GET",
    data: {
      api_key: "2c5709ff90e8aeb0f12febf13b682fa8",
    },
    url: "http://api.themoviedb.org/3/movie/popular",
  })
    .then(function (movies) {
      $.each(movies.results, function (i, data) {
        counter++;
        $("#movieList").append(
          "<li class='link'><a href=" + data.id + ">" + data.title + "</a></li>"
        );
      });
    })
    .then(function () {
      $("#movieList").css({ display: "block" });
    });
});
// apikey 2c5709ff90e8aeb0f12febf13b682fa8

(function ($) {
  $("#movieList").on("click", "li.link a", function (event) {
    event.preventDefault();
    $("#movieList").css({ display: "none" });
    $("#movie").empty();
    let currentId = $(this).attr("href");
    $.ajax({
      method: "GET",
      data: {
        api_key: "2c5709ff90e8aeb0f12febf13b682fa8",
      },
      url: "http://api.themoviedb.org/3/movie/" + currentId,
    })
      .then(function (data) {
        if (!data.title) {
          data.title = "N/A";
        }
        if (!data.genres) {
          data.genres = "N/A";
        }
        if (!data.overview) {
          data.overview = "N/A";
        }
        if (!data.budget) {
          data.budget = "N/A";
        }
        if (!data.vote_average) {
          data.vote_average = "N/A";
        }
        $("#movie").append("<h1>" + data.title + "</h1>");

        if (!data.image) {
          $("#show").append(
            "<img src=" + "../public/no_image.jpeg" + "></img>"
          );
        } else {
          $("#show").append("<img src=" + data.image.medium + "></img>");
        }
        $("#movie").append(
          "<dl class='defList' ><dt>Title </dt><dd>" +
            data.title +
            "</dd>" +
            "<dt>Genres</dt><dd>" +
            makeUnorderedList(data.genres).innerHTML +
            "</dd><dt>Overview</dt><dd>" +
            data.overview +
            "</dd>" +
            "</dd><dt>Budget</dt><dd>" +
            data.budget +
            "</dd>" +
            "</dd><dt>vote_average</dt><dd>" +
            data.vote_average +
            "</dd></dl>"
        );
        $.ajax({
          method: "GET",
          data: {
            api_key: "2c5709ff90e8aeb0f12febf13b682fa8",
          },
          url:
            "http://api.themoviedb.org/3/movie/" +
            currentId +
            "/recommendations",
        }).then(function (movies) {
          console.log(movies);
          $.each(movies.results, function (i, data) {
            counter++;
            $("#recommendations").append(
              "<li class='link'><a href=" +
                data.id +
                ">" +
                data.title +
                "</a></li"
            );
          });
        });
      })
      .then(function () {
        $("#movie").css({ display: "block" });
        $("#homeLink").css({ display: "block" });
        $("#recommendations").css({ display: "block" });
      });
  });
  function makeUnorderedList(array) {
    var list = document.createElement("ul");
    for (var i = 0; i < array.length; i++) {
      var item = document.createElement("li");
      item.appendChild(document.createTextNode(array[i]));
      list.appendChild(item);
    }
    return list;
  }
})(window.jQuery);
