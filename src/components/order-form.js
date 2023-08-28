function handleSubmit(event) {
    event.preventDefault();

    // Gather form data
    const symbolInput = document.getElementById('symbolInput').value;
    const orderPrice = document.getElementById('orderPrice').value;
    const usdValue = document.getElementById('usdValue').value;
    const orderVolume = document.getElementById('orderVolume').value;
    const stopLoss = document.getElementById('stopLoss').value;
    const takeProfit = document.getElementById('takeProfit').value;

    // Create an object to store the form data
    const formData = {
      symbol: symbolInput,
      price: orderPrice,
      usdAmount: usdValue,
      volume: orderVolume,
      stopLoss: stopLoss,
      takeProfit: takeProfit
    };

    // Save form data to local storage
    localStorage.setItem('formData', JSON.stringify(formData));

    // Optional: Display a success message
    alert('Form data submitted and saved to local storage.');
  }