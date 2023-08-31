

const form = document.getElementById('newOrderForm');
  const buyButton = document.getElementById('buyButton');
  const sellButton = document.getElementById('sellButton');
  
  buyButton.addEventListener('click', function(event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    localStorage.setItem('userData', JSON.stringify(data));
    
    const alert = document.querySelector('ion-alert');
    alert.buttons = ['OK'];
    form.reset();
  });
  
  sellButton.addEventListener('click', function(event) {
    event.preventDefault();
    
    localStorage.removeItem('userData');
    
    alert('Data cleared from local storage!');
    form.reset();
  });