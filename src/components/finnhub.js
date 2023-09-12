const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "ck0cklhr01qtrbkm13m0ck0cklhr01qtrbkm13mg"
const finnhubClient = new finnhub.DefaultApi()

finnhubClient.quote("FORD", (error, data, response) => {
  console.log(data.o)
});