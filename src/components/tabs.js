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
});

sideButtonTrade.addEventListener("click", function() {
  if (!sideButtonTrade.classList.contains("active")) {
    accToToggle.setAttribute("style", "display: none;")
    tradeToToggle.removeAttribute("style");
    ordersToToggle.removeAttribute("style");

    sideButtonAssets.classList.remove("active");
    sideButtonAcc.classList.remove("active");
    sideButtonTrade.classList.add("active");
    iconAcc.classList.remove("active");
    iconTrade.classList.add("active");
  }
});

sideButtonAcc.addEventListener('click', function() {
  if (!sideButtonAcc.classList.contains("active")) {
    tradeToToggle.setAttribute("style", "display: none;")
    accToToggle.removeAttribute("style");
    ordersToToggle.setAttribute("style", "display: none;")

    sideButtonTrade.classList.remove("active");
    sideButtonAssets.classList.remove("active");
    sideButtonAcc.classList.add("active");
    iconTrade.classList.remove("active");
    iconAssets.classList.remove("active");
    iconAcc.classList.add("active");
  }
});

// JavaScript code for handling the button click event
document.getElementById("side-out-button").addEventListener("click", function() {
  // Redirect to another.html
  window.location.href = "login.html";
});


// MODAL DEPOSIT LOGIC 

const openBtn = document.getElementById("deposit-button")
const closeBtn = document.getElementById("modal-inner-close-button")
const modal = document.getElementById("modal")