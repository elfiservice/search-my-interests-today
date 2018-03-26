(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID 795f815f9db950af216b40bc64a9bdfd4a5805d5387f88c8fa5d6a88a682aa31'
            }
        }).done(addImage)
            .fail(function (error) {
                requestError(error, 'image');
            });

        function addImage(images) {
            let htmlResult = '';
            if (images && images.results && images.results[0]) {
                const imageData = images.results[0];

                htmlResult = `
                                <figure>
                                    <img src="${imageData.urls.regular}" alt="${imageData.description}">
                                    <figcaption>${imageData.description}<br> by <i>${imageData.user.name}</i><br> from <i>${imageData.user.location}</i></figcaption>
                                </figure>`;
            } else {
                htmlResult = '<p class="network-warning">Unfortunately, no <i>image</i> was returned for your search.</p>';
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlResult);
        }
        //Request related articles by NYT API
        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=5ed067b15e7c4deeb029547379606584`,
        }).done(addArticle)
            .fail(function (error) {
                requestError(error, 'articles');
            });

        //if sucess
        function addArticle(articles) {
            let htmlResult = '';
            if (articles && articles.response.docs && articles.response.docs[0]) {
                console.log(articles.response.docs[0]);
                const articlesData = articles.response.docs;
                htmlResult = '<ul>' + articlesData.map(article =>
                    `<li class="article">
                    <img src="img/icon-article.png" >
                    <div>
                        <a href="${article.web_url}" target="_blank">
                            <h2>${article.headline.main}</h2>
                        </a>
                        <p>${article.snippet}</p>
                    </div>
                    </li>`
                ).join('') + '</ul>';
            } else {
                htmlResult = '<p class="network-warning">Unfortunately, no <i>articles</i> was returned for your search.</p>';
            }
            responseContainer.insertAdjacentHTML('beforeend', htmlResult);
        }

        function requestError(err, part) {
            console.log(err);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }
    });
})();
