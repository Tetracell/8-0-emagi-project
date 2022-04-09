fetch('https://pure-cove-46727.herokuapp.com/api/emojis')
    .then((emojis) => emojis.json())
    .then((emojis) => {
        encodeForm(emojis);
        searchForm(emojis);
        randoForm(emojis);
        //console.log(emojis);
    })
    .catch((error) => {
        console.log(error);
    });

const encodeForm = (data) => {
    const encodeForm = document.querySelector('#encode form');
    encodeForm.addEventListener('submit', (x) => encodeEmoji(x, data));
};

const encodeEmoji = ((x, data) => {
    x.preventDefault();

    const toEncode = x.target.encode.value;
    x.target.encode.value = ''; //Reset the input field

    const resultP = document.querySelector('#encode .result p');
    const result = document.querySelector('#encode .result');

    if (!toEncode) {
        resultP.textContent = "Require text input!";
        result.classList.add('error');
        result.classList.remove('success');
        return;
    }

    let encodedResult = '';

    for (let char of toEncode) {
        if (char == ',' || char == ' ') {
            encodedResult += char;
        }
        for (let emoji of data) {
            if (char.toLowerCase() == emoji.letter) {
                encodedResult += emoji.symbol;
            }
        }
    }

    resultP.textContent = encodedResult;
    result.classList.remove('error');
    result.classList.add('success');
});

// Re-factoring of Christine's Code

const searchForm = (data) => {
    const searchForm = document.querySelector(`#search form`);
    searchForm.addEventListener('submit', (x) => searchEmoji(x, data));
};

const searchEmoji = ((x, data) => {
    x.preventDefault();

    const searchResultP = document.querySelector("#search .result p");
    const searchResult = document.querySelector("#search .result");

    const term = x.target.search.value;

    const errorBox = (() => {
        searchResultP.textContent = "Error. No input / no results found";
        searchResult.classList.add("error");
        searchResult.classList.remove("success");
        return;
    });
    if (!term) {
        errorBox();
        return;
    }
    const search = (term, data) => {
        return data.filter((emoji) => emoji.name.includes(term.toLowerCase()));
    };
    const result = search(term, data)
        .map((emoji) => emoji.symbol)
        .join('');

    const resultArea = document.querySelector('#search aside p');

    if (result === '') {
        errorBox();
        return;
    }
    resultArea.textContent = result;

    searchResult.classList.remove("error");
    searchResult.classList.add("success");
});

const randoForm = (data) => {
    const randoForm = document.querySelector('#random form');
    let dropDown = document.querySelector('#category');

    let categoryObject = {};
    for (let emoji of data) {
        //console.log(emoji.categories);
        for (let category of emoji.categories) {
            if (categoryObject[category]) {
                categoryObject[category].push(emoji.symbol);
            } else {
                categoryObject[category] = [emoji.symbol];
            }
        }
    }
    let categoryList = Object.keys(categoryObject);
    for (let category of categoryList) {
        dropDown.innerHTML += `<option>${category}</option>`;
    }
    randoForm.addEventListener('submit', (element) => randoMoji(element, categoryObject));
};

const randoMoji = (element, emojiCategories) => {
    element.preventDefault();
    //console.log(emojiCategories);
    let dropDown = document.querySelector('#category');
    let randomBox = document.querySelector("#random .result");
    let randomEmoji = document.querySelector('#random .result p');

    let selection = dropDown.value;
    //console.log(selection);
    if (selection == "-- Choose a Category --") {
        randomBox.classList.add('error');
        randomBox.classList.remove('success');
        randomEmoji.textContent = "Please select a category";
        return;
    }

    let chosenCategory = emojiCategories[selection];

    let randomizer = Math.floor(Math.random() * (chosenCategory.length));
    //console.log(randomizer);
    randomBox.classList.remove("error");
    randomBox.classList.add("success");
    randomEmoji.textContent = chosenCategory[randomizer];
};