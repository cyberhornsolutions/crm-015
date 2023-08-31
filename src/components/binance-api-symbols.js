


const symbolInput = document.getElementById("symbolInput");
  const symbolDropdown = document.getElementById("symbolDropdown");
  let symbolsList = [];

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
      document.getElementById("symbolValue").textContent = "Пожалуйста выберите котировку";
      return;
    }

    var apiUrl = "https://api.binance.com/api/v3/ticker/price?symbol=" + symbol;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        var symbolValue = data.price;
          document.getElementById("orderPrice").setAttribute("value", symbolValue);
        })
      .catch(error => {
        document.getElementById("orderPrice").setAttribute("value", 0);
      });
  }