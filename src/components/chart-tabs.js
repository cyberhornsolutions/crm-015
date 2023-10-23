document.getElementById("addTabButton").addEventListener("click", function () {
  // Create a new tab
  var newTabId = "h" + (document.querySelectorAll(".tab-pane").length + 1);

  // Create a new nav item
  var newNavItem = document.createElement("li");
  newNavItem.classList.add("nav-item");

  // Create a new nav link
  var newNavLink = document.createElement("a");
  newNavLink.classList.add("nav-link");
  newNavLink.setAttribute("data-bs-toggle", "tab");
  newNavLink.setAttribute("href", "#" + newTabId);
  newNavLink.setAttribute("style", "font-size: 14px");

  newNavLink.textContent = "# " + document.querySelectorAll(".nav-item").length;

  // Append the new nav link to the new nav item
  newNavItem.appendChild(newNavLink);

  // Insert the new nav item before the "+" button
  var addButton = document.getElementById("addTabButton").parentNode;
  addButton.parentNode.insertBefore(newNavItem, addButton);

  // Create a new tab pane
  var newTabPane = document.createElement("div");
  newTabPane.classList.add(
    "tab-pane",
    "container",
    "tradingview-widget-container",
    "fade",
    "show",
    "active"
  ); // Add 'show' and 'active' classes to make it visible
  newTabPane.setAttribute("id", newTabId);
  newTabPane.style.margin = "0";
  newTabPane.style.padding = "0";

  // Create a new tradingview container for the tab
  var newTradingViewContainer = document.createElement("div");
  newTradingViewContainer.setAttribute("id", "tradingview_" + newTabId);

  // Append the new tradingview container to the tab pane
  newTabPane.appendChild(newTradingViewContainer);

  // Append the new tab pane to the tab content div
  document.querySelector(".tab-content").appendChild(newTabPane);

  // Load the TradingView scripts for the new tab
  var tvScript = document.createElement("script");
  tvScript.type = "text/javascript";
  tvScript.src = "https://s3.tradingview.com/tv.js";
  newTradingViewContainer.appendChild(tvScript);

  var customScript = document.createElement("script");
  customScript.type = "text/javascript";
  customScript.src = "tradingview.js";
  newTradingViewContainer.appendChild(customScript);

  // Activate the new tab by triggering a click event
  newNavLink.click();

  // Update the TradingView widget for the new tab
  updateWidget("BTCUSDT", "tradingview_" + newTabId);
});
