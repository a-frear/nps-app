'use strict';
const apiKey = 'owZnObSdciQJLKWaXQW7Dn0eFtq8FXVOnInKW1DL';
const searchURL = `https://developer.nps.gov/api/v1/parks`

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the array
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3 id="parkName">${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p id="address">${responseJson.data[i].addresses[0].line1}
      ${responseJson.data[i].addresses[0].postalCode}
      ${responseJson.data[i].addresses[0].city}
      ${responseJson.data[i].addresses[0].stateCode}</p>
      <a href="${responseJson.data[i].url}" id="officialWebsite">Official Website</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParks(query, maxResults) {
    const params = {
      q: query,
      limit: maxResults,
      api_key: apiKey
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
    console.log(url);
    console.log(queryString);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
};

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const userState = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    console.log(userState);
    getParks(userState, maxResults);
  });
}

$(watchForm);