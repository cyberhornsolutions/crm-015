// Get references to the buttons and the elements to toggle
const sideButtonAssets = document.getElementById("side-button-assets");
const sideButtonTrade = document.getElementById("side-button-trade");
const sideButtonAcc = document.getElementById("side-button-account");

const assetsToToggle = document.getElementById("assets");
const tradeToToggle = document.getElementById("trade");
const accToToggle = document.getElementById("account");
const ordersToToggle = document.getElementById("orders");

const iconTrade = document.getElementById("side-button-trade-icon");
const iconAssets = document.getElementById("side-button-assets-icon");
const iconAcc = document.getElementById("side-button-account-icon");


// HELP LOGOUT
const helpButton = document.getElementById("help-button")
const helpIcon = document.getElementById('information-circle-icon')
const logoutButton = document.getElementById("logout-button")
const faqDiv = document.getElementById('faq')


// NAV
const navButtons = document.getElementById('nav-buttons')
const newDealButton = document.getElementById("newDealButton")
const ordersHistoryButton = document.getElementById("ordersHistoryButton")
const newOrder = document.getElementById('newOrder')
const tradeDiv = document.getElementById('trade-div')
const tableOrders = document.getElementById('orders')


// Add a click event listener to the button
sideButtonAssets.addEventListener("click", function() {
  // Check if the element is currently hidden
  if (assetsToToggle.classList.contains("hidden") && sideButtonTrade.classList.contains("active")) {
  // If it's hidden, remove the "hidden" class to show it
    assetsToToggle.classList.remove("hidden");
    sideButtonAssets.classList.add("active");
    iconAssets.classList.add("active");
  } else {
    assetsToToggle.classList.add("hidden");
    sideButtonAssets.classList.remove("active");
    iconAssets.classList.remove("active");
  }
  if (sideButtonAssets.classList.contains('active') && newDealButton.classList.contains('active')) {
    tableOrders.style.maxHeight = '150px'
  } else if (newDealButton.classList.contains('active')) {
    tableOrders.style.maxHeight = '115px'
  }
});

sideButtonTrade.addEventListener("click", function() {
  if (!sideButtonTrade.classList.contains("active")) {
    accToToggle.setAttribute("style", "display: none;")
    tradeToToggle.removeAttribute("style");
    ordersToToggle.removeAttribute("style");
    tradeDiv.style.display = 'flex'

    sideButtonAssets.classList.remove("active");
    sideButtonAcc.classList.remove("active");
    sideButtonTrade.classList.add("active");
    iconAcc.classList.remove("active");
    iconTrade.classList.add("active");

    faqDiv.style.display = 'none'
    helpButton.classList.remove('active')
    helpIcon.classList.remove('active')

    newDealButton.style.display = 'block'
    ordersHistoryButton.style.display = 'block'
  }
});

sideButtonAcc.addEventListener('click', function() {
  if (!sideButtonAcc.classList.contains("active")) {
    tradeToToggle.setAttribute("style", "display: none;")
    accToToggle.removeAttribute("style");
    ordersToToggle.setAttribute("style", "display: none;")
    tradeDiv.style.display = 'none'

    sideButtonTrade.classList.remove("active");
    sideButtonAssets.classList.remove("active");
    sideButtonAcc.classList.add("active");
    iconTrade.classList.remove("active");
    iconAssets.classList.remove("active");
    iconAcc.classList.add("active");

    faqDiv.style.display = 'none'
    helpButton.classList.remove('active')
    helpIcon.classList.remove('active')

    newDealButton.add('active')
    ordersHistoryButton.add('active')
  }
});

// NAV BUTTONS 

newDealButton.addEventListener("click", function() {
  if (!newDealButton.classList.contains('active') && !ordersHistoryButton.classList.contains('active')) {
    newOrder.removeAttribute("style")
    newDealButton.classList.add('active')
    newDealButton.style.backgroundColor = '#1e222d'
    newDealButton.style.border = '1px solid rgb(0, 255, 110)'
    newDealButton.style.color = 'rgb(0, 255, 110)'
    newDealButton.style.fontWeight = 'bold'
    tableOrders.style.maxHeight = '115px'
  } else if(!ordersHistoryButton.classList.contains('active')){
    newOrder.style.display = 'none'
    newDealButton.classList.remove('active')
    newDealButton.removeAttribute('style')

    tableOrders.style.maxHeight = '150px'
  }
  if (sideButtonAssets.classList.contains('active')) {
    tableOrders.style.maxHeight = '150px'
  }
})

ordersHistoryButton.addEventListener("click", function() {
  if (!ordersHistoryButton.classList.contains('active')) {
    ordersHistoryButton.classList.add("active")
    ordersHistoryButton.style.backgroundColor = '#1e222d'
    ordersHistoryButton.style.border = '1px solid rgb(0, 255, 110)'
    ordersHistoryButton.style.color = 'rgb(0, 255, 110)'
    ordersHistoryButton.style.fontWeight = 'bold'

    tableOrders.style.maxHeight = '630px'
    tradeToToggle.style.display = 'none'
    navButtons.setAttribute('style', 'margin-top: 5px;')

  } else {
    ordersHistoryButton.classList.remove("active")
    ordersHistoryButton.removeAttribute('style')

    tableOrders.style.maxHeight = '150px'
    tradeToToggle.style.display = 'flex'
    sideButtonTrade.classList.add('active')
    iconTrade.classList.add("active")
    navButtons.setAttribute('style', 'margin-top: 0;')

    if (newDealButton.classList.contains('active')) {
      if (sideButtonAssets.classList.contains('active')){
        tableOrders.style.maxHeight = '150px'
      } else {
        tableOrders.style.maxHeight = '115px'
      }
    }
  }
  
})

// MODAL DEPOSIT LOGIC 


// HELP + LOGOUT BUTTONS

helpButton.addEventListener("click", function() {
  if (!helpButton.classList.contains('active')){
    sideButtonTrade.classList.remove("active")
    sideButtonAssets.classList.remove("active")
    sideButtonAcc.classList.remove("active")
    iconTrade.classList.remove("active")
    iconAssets.classList.remove("active")
    iconAcc.classList.remove("active")
    newDealButton.classList.remove('active')
    ordersHistoryButton.classList.remove('active')
    
    tradeToToggle.style.display = 'none'
    accToToggle.style.display = 'none'
    assetsToToggle.classList.add('hidden')
    tableOrders.style.display = 'none'
    tradeDiv.style.display = 'none'
    
    faqDiv.removeAttribute('style')
    helpButton.classList.add('active')
    helpIcon.classList.add('active')
  } 
});

logoutButton.addEventListener("click", function() {
  window.location.href = "login.html";
});