
const symbolInput = document.getElementById("symbol-input");
const symbolDropdown = document.getElementById("symbol-dropdown");
const symbolValue = document.getElementById("symbol-current-value");
const symbolModal = document.getElementById("symbol-modal");

let symbolsList = [];

symbolInput.addEventListener('submit', function () {
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
          fetchSymbolValue(symbol); // Fetch the symbol value
          symbolModal.style.display = "none"; // Hide the modal after selection
      });
      symbolDropdown.appendChild(option);
  });

  if (filteredSymbols.length > 0) {
    // Calculate the position based on the input field's position
    const inputRect = symbolInput.getBoundingClientRect();
    symbolModal.style.top = `${inputRect.bottom + window.scrollY}px`;
    symbolModal.style.left = `${inputRect.left + window.scrollX}px`;

    // Set the modal dimensions based on the dropdown's dimensions
    const dropdownRect = symbolDropdown.getBoundingClientRect();
    symbolModal.style.width =  "100px";
    symbolModal.style.height = `${dropdownRect.height}px`;

    symbolModal.style.display = "block";
    } else {
        symbolModal.style.display = "none";
    }
}

document.addEventListener("click", function(event) {
  if (!symbolDropdown.contains(event.target)) {
      symbolModal.style.display = "none"; // Hide the modal when clicking outside
  }
});



fetch('https://api.binance.com/api/v3/exchangeInfo')
  .then(response => response.json())
  .then(data => {
    symbolsList = data.symbols.map(symbolObj => symbolObj.symbol);
  })
  .catch(error => {
  console.error('Error fetching data:', error);
});

// ...

function fetchSymbolValue(symbol) {
  if (!symbol) {
      symbolValue.value = "Пожалуйста выберите котировку";
      return;
  }

  const apiUrl = "https://api.binance.com/api/v3/ticker/price?symbol=" + symbol;

  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
      // Replace the comma with a period and convert to a float
      const numericValue = parseFloat(data.price.replace(',', '.'));
      // Round the numeric value to two decimal places
      const roundedValue = numericValue.toFixed(6);

      // Set the value property of the symbolValue input field
      symbolValue.value = roundedValue;

      console.log(roundedValue);
  })
  .catch(error => {
      // Handle the error here if necessary
      console.error('Error fetching symbol value:', error);
      // Set a default value or display an error message
      symbolValue.value = 'Error fetching value';
  });
}