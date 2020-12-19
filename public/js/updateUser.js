(function () {
  var userForm = $("#userForm"),
    firstName = $("#firstName"),
    lastName = $("#lastName"),
    userName = $("#userName"),
    email = $("#email"),
    errorArea = $("#errorStatements"),
    successArea = $("#successStatements");
  errorArea.empty();
  errorArea.hide();
  successArea.hide();
  function errorHandleUserUpdate(firstName, lastName, userName, email) {
    // console.log("error Checking");
    // A post must have all the components below
    const spaceRegex = /^\s*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let error = [];
    if (!firstName || !lastName || !userName || !email || !name) {
      error.push("Missing Component for Movie");
    }
    // console.log("error Checking 1");
    // title must be string
    if (typeof firstName !== "string" || spaceRegex.test(firstName)) {
      error.push("FirstName must be a string");
    }
    // description must be string
    // console.log("error Checking 2");
    if (typeof lastName !== "string" || spaceRegex.test(lastName)) {
      error.push("LastName must be a string");
    }
    // console.log("error Checking 3");
    if (typeof userName !== "string" || spaceRegex.test(userName)) {
      error.push("UserName must be a string");
    }
    if (typeof email !== "string" || emailRegex.test(email)) {
      error.push("Email must be a string");
    }
    // tags must be an array
    // images must be an array
    // console.log(images);
    // console.log(typeof images);
    // console.log(spaceRegex.test(images));
    // console.log("error Checking 5");
    // console.log(error);
    return error;
  }
  // console.log("hello");
  userForm.submit(function (event) {
    event.preventDefault();
    // console.log("inside");
    errorArea.empty();
    errorArea.hide();
    successArea.hide();
    let firstNameVal = firstName.val();
    let lastNameVal = lastName.val();
    let userNameVal = userName.val();
    let emailVal = email.val();
    // console.log(
    //   `title: ${titleVal} description: ${descriptionVal} budgetVal: ${budgetVal} imageVal: ${imageVal} genresVal: ${genresVal}`
    // );
    let errors = errorHandleUserUpdate(
      firstNameVal,
      lastNameVal,
      userNameVal,
      emailVal
    );
    // console.log(errors);
    if (errors.length === 0) {
      var requestConfig = {
        method: "POST",
        url: "/user",
        contentType: "application/json",
        data: JSON.stringify({
          firstname: firstNameVal,
          lastname: lastNameVal,
          userName: userNameVal,
          email: emailVal,
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
