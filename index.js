'use strict';
const apiKey = 'owZnObSdciQJLKWaXQW7Dn0eFtq8FXVOnInKW1DL';
const searchURL = `https://developer.nps.gov/api/v1/parks`

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function displayResults(responseJson) {
  $('#results-list').empty();
  // iterate through the array
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3 id="class">${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].url}" class="officialWebsite">Official Website</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParks(query, maxResults) {
  const apiFormat = "&api_key=" + apiKey
  const stateQuery = "?statecode=" + query + "&"
  const limitQuery = "limit=" + maxResults
    const params = {
      q: stateQuery,
      limit: limitQuery,
      api_key: apiKey
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + stateQuery + limitQuery + apiFormat;

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
    const userState = $('#js-search-state').val();
    const maxResults = $('#js-max-results').val();
    getParks(userState, maxResults);
  });
}

$(watchForm);

/*
this is what I was using for the addresses but it wasn't working since not all of the parks have official addresses.
I guess I will have to figure out how to use coordinates?
  <p class="address">
      ${responseJson.data[i].addresses[0].stateCode}</p>
      ${responseJson.data[i].addresses[0].line1}
      ${responseJson.data[i].addresses[0].postalCode}
      ${responseJson.data[i].addresses[0].city}
      ${responseJson.data[i].addresses[0].stateCode}</p>

      I could use something like this:

      <p>https://maps.googleapis.com/maps/api/geocode/json?address=statue+of+liberty,
      +New+York+NY&key=YOUR_API_KEY</p>
*/