const apiKey = '4d17579e3db744c7a830d2943eea0652';
const url = 'https://api.twelvedata.com/stocks';

fetch(`${url}?apikey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    //console.log(data[0].symbol); // Output the response data to the console
    data.data.forEach(item => {
      if (item.symbol === "AAPL" && item.currency === "USD" && item.exchange === 'NASDAQ') {
        console.log("Found AAPL:", item.values);
      }
    });
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
