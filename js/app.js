(function () {
    const ju = 'junior';
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 795f815f9db950af216b40bc64a9bdfd4a5805d5387f88c8fa5d6a88a682aa31');
        unsplashRequest.send();

        function addImage() {
            let htmlResult = '';
            const data = JSON.parse(this.responseText);
            if (data && data.results && data.results[0]) {
                const imageData = data.results[0];

                htmlResult = `
                                <figure>
                                    <img src="${imageData.urls.regular}" alt="${imageData.description}">
                                    <figcaption>${ju} - ${imageData.description}<br> by <i>${imageData.user.name}</i><br> from <i>${imageData.user.location}</i></figcaption>
                                </figure>`;

                responseContainer.innerHTML = htmlResult;
            }
        }
        //Request related articles by NYT API
        const nytArticlesRequest = new XMLHttpRequest();
        nytArticlesRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=5ed067b15e7c4deeb029547379606584`);
        nytArticlesRequest.onload = addArticle;
        nytArticlesRequest.send();

        //if sucess
        function addArticle() {
            let htmlResult = '';
            const data = JSON.parse(this.responseText);
            if (data && data.response.docs && data.response.docs[0]) {
                console.log(data.response.docs[0]);
                const articlesData = data.response.docs;
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
                responseContainer.insertAdjacentHTML('beforeend', htmlResult);
            }
        }
    });
})();
