
const symbolInput = document.getElementById("symbol-input");
const symbolDropdown = document.getElementById("symbol-dropdown");

let symbolsList = [];

symbolInput.addEventListener('change', function () {
    fetchSymbolValue();
})

symbolInput.addEventListener("input", handleInput);

function handleInput() {
    const userInput = symbolInput.value.toLowerCase();
    const filteredSymbols = symbolsList.filter(symbol => symbol.toLowerCase().includes(userInput));
            
    symbolDropdown.innerHTML = "";
    filteredSymbols.forEach(symbol => {
      const option = document.createElement("div");
      option.classList.add("dropdown-option");
      option.textContent = symbol;
      option.addEventListener("click", () => {
        symbolInput.value = symbol;
        symbolDropdown.innerHTML = "";
      });
      symbolDropdown.appendChild(option);
    });
}

fetch('https://api.binance.com/api/v3/exchangeInfo')
  .then(response => response.json())
  .then(data => {
    symbolsList = data.symbols.map(symbolObj => symbolObj.symbol);
  })
  .catch(error => {
  console.error('Error fetching data:', error);
});

function fetchSymbolValue() {
  var symbol = symbolInput.value;
  if (!symbol) {
    document.getElementById("symbol-current-value").textContent = "Пожалуйста выберите котировку";
    return;
  }

  var apiUrl = "https://api.binance.com/api/v3/ticker/price?symbol=" + symbol;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Replace the comma with a period and convert to a float
      const numericValue = parseFloat(data.price.replace(',', '.'));
      // Round the numeric value to two decimal places
      const roundedValue = numericValue.toFixed(2);

      document.getElementById("symbol-current-value").setAttribute("value", roundedValue);
      })
    .catch(error => {
      document.getElementById("symbol-current-value").setAttribute("value", 0);
    });
  }