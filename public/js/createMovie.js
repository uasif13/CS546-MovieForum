(function () {
  var movieForm = $("#movieForm"),
    title = $("#movieTitleInput"),
    description = $("#movieDescriptionInput"),
    budget = $("#movieBudgetInput"),
    image = $("#movieImageInput"),
    genres = $("#movieGenresInput"),
    errorArea = $("#errorStatements"),
    successArea = $("#successStatements");
  errorArea.empty();
  errorArea.hide();
  successArea.hide();
  function errorHandleMovieCreation(title, description, budget, image, genres) {
    // console.log("error Checking");
    // A post must have all the components below
    const spaceRegex = /^\s*$/;
    const numRegex = /^[\d]+$/;
    let error = [];
    if (!title || !description || !budget || !genres || !image) {
      error.push("Missing Component for Movie");
    }
    // console.log("error Checking 1");
    // title must be string
    if (typeof title !== "string" || spaceRegex.test(title)) {
      error.push("Movie title must be a string");
    }
    // description must be string
    // console.log("error Checking 2");
    if (typeof description !== "string" || spaceRegex.test(description)) {
      error.push("Movie description must be a string");
    }
    // console.log("error Checking 3");
    if (typeof budget !== "string" || !numRegex.test(budget)) {
      error.push("Movie budget must be a number");
    }
    // tags must be an array
    if (
      !Array.isArray(genres) ||
      genres[0] === "Choose the genres of the movie" ||
      genres.length === 0
    ) {
      error.push("Genres must be an array");
    }
    // images must be an array
    // console.log(images);
    // console.log(typeof images);
    // console.log(spaceRegex.test(images));
    // console.log("error Checking 5");
    if (typeof image !== "string" || spaceRegex.test(image)) {
      error.push("Images must be a string");
    }
    // console.log(error);
    return error;
  }
  // console.log("hello");
  movieForm.submit(function (event) {
    event.preventDefault();
    // console.log("inside");
    errorArea.empty();
    errorArea.hide();
    successArea.hide();
    let titleVal = title.val();
    let descriptionVal = description.val();
    let budgetVal = budget.val();
    let imageVal = image.val();
    let genresVal = genres.val();
    // console.log(
    //   `title: ${titleVal} description: ${descriptionVal} budgetVal: ${budgetVal} imageVal: ${imageVal} genresVal: ${genresVal}`
    // );
    let errors = errorHandleMovieCreation(
      titleVal,
      descriptionVal,
      budgetVal,
      imageVal,
      genresVal
    );
    // console.log(errors);
    if (errors.length === 0) {
      let temp = imageVal.slice(12, imageVal.length);
      imageVal = temp;
      var requestConfig = {
        method: "POST",
        url: "/movies",
        contentType: "application/json",
        data: JSON.stringify({
          title: titleVal,
          description: descriptionVal,
          budget: parseInt(budgetVal),
          image: imageVal,
          genres: genresVal,
        }),
      };
      $.ajax(requestConfig);
      successArea.show();
    } else {
      errors.map((err) => {
        // console.log(err);
        let element = `<li>${err}</li>`;
        errorArea.show();
        errorArea.append(element);
      });
    }
  });
})(window.jQuery);
