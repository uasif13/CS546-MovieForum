(function ($) {
    let apiKey = '2c5709ff90e8aeb0f12febf13b682fa8'
    var form = $('#searchMovieForm'),
    input = $('#searchMovieQuery'),
    showList = $('#apiMovieList');

    form.submit (function (event) {
        event.preventDefault();
        const spaceRegex = /^\s*$/;
        let query = input.val();
        if (!spaceRegex.test(query)) {
            showList.empty();
            let requestConfig = {
                method: "GET",
                data: {
                    api_key: apiKey,
                    language: 'en-US',
                    query: query,
                    page: 1,
                    include_adult: false,
                },
                url: "http://api.themoviedb.org/3/search/movie"
            }
            $.ajax(requestConfig).then((data) => {
                data.results.map((movie) => {
                    let element = `<li><a class="apiMovie" href='/movies/${movie.id}'>${movie.original_title}</li>`
                    showList.show();
                    showList.append(element);
                });
                $("a.apiMovie").click((event) => {
                    event.preventDefault();
                    linkClick(event.target.href);
                });
            });
        };
        
    });
    // This needs to create a document in the movie collection and move to create a post page
    function linkClick(link) {
        console.log(link)
        showList.hide()
        var requestConfig = {
            method: 'POST',
            url: link
        }
        $.ajax(requestConfig)
    }

})(window.jQuery);