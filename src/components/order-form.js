const form = document.getElementById('newOrderForm');
const buyButton = document.getElementById('buyButton');
const sellButton = document.getElementById('sellButton');

document.getElementById('symbol-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission on Enter key press
  }
});

document.getElementById('symbol-current-value').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission on Enter key press
  }
});

document.getElementById('symbol-amount').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission on Enter key press
  }
});

document.getElementById('stop-loss').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission on Enter key press
  }
});

document.getElementById('take-profit').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission on Enter key press
  }
});

  
buyButton.addEventListener('click', function(event){
  event.preventDefault()
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
    
  localStorage.setItem('userData', JSON.stringify(data));

  const newRow = document.createElement('tr');

  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, '0'); // Get the day and pad with leading zero if necessary
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (Note: Months are zero-based, so we add 1) and pad with leading zero if necessary
  const year = currentDate.getFullYear().toString().slice(-4); // Get the last two digits of the year

  const formattedDate = `${day}/${month}/${year}`;

  newRow.innerHTML = 
  `<td>${'ID'+ Math.floor(Math.random() * 1000)}</td>
  <td>${formattedDate}</td>
  <td>${data.symbolInput}</td>
  <td>Покупка</td>
  <td>${data.symbolAmount}</td>
  <td>${data.symbolCurrentValue}</td>
  <td>${data.stopLoss}/${data.takeProfit}</td>
  <td>Успешно</td>
  <td>-${data.symbolAmount*data.symbolCurrentValue}</td>`;
      
  // Append the new row to the dataBody
  dataBody.appendChild(newRow);
      
  // Clear form inputs
  form.reset();
})

sellButton.addEventListener('click', function(event){
  event.preventDefault()
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
    
  localStorage.setItem('userData', JSON.stringify(data));

  const newRow = document.createElement('tr');

  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, '0'); // Get the day and pad with leading zero if necessary
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (Note: Months are zero-based, so we add 1) and pad with leading zero if necessary
  const year = currentDate.getFullYear().toString().slice(-4); // Get the last two digits of the year

  const formattedDate = `${day}/${month}/${year}`;

  newRow.innerHTML = 
  `<td>${'ID'+ Math.floor(Math.random() * 1000)}</td>
  <td>${formattedDate}</td>
  <td>${data.symbolInput}</td>
  <td>Продажа</td>
  <td>${data.symbolAmount}</td>
  <td>${data.symbolCurrentValue}</td>
  <td>${data.stopLoss}/${data.takeProfit}</td>
  <td>Успешно</td>
  <td>+${data.symbolAmount*data.symbolCurrentValue}</td>`;
      
  // Append the new row to the dataBody
  dataBody.appendChild(newRow);
      
  // Clear form inputs
  form.reset();
})