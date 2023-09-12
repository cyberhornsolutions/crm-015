// Get the image element by its ID
const imageToChange = document.getElementById("lang");

// Define an array of image sources to cycle through
const imageSources = ["ru-fl.png", "gb-fl.png"];

// Initialize a counter to keep track of the current image
let currentImageIndex = 0;

// Function to change the image source when clicked
function changeImage() {
    // Increment the index to get the next image source
    currentImageIndex++;

    // If we've reached the end of the array, loop back to the first image
    if (currentImageIndex === imageSources.length) {
        currentImageIndex = 0;
    }

    // Set the new image source
    imageToChange.src = imageSources[currentImageIndex];

    // Call the toggleLanguage function to change the language
    toggleLanguage();
}

// Add a click event listener to the image
imageToChange.addEventListener("click", changeImage);

function toggleLanguage() {
    var currentLanguage = document.documentElement.lang || 'ru'; // Default to Russian
    var newLanguage = currentLanguage === 'ru' ? 'en' : 'ru'; // Toggle between 'ru' and 'en'

    // Load the corresponding language version
    var newPageURL = currentLanguage === 'ru' ? 'ac-comp-en.html' : 'ac-comp-ru.html';

    // Update the document's language attribute
    document.documentElement.lang = newLanguage;

    var currentURL = window.location.href;

    // Split the URL into parts using '/' as the separator
    var urlParts = currentURL.split('/');

    // Check if there are at least two parts (e.g., "https://" and "www.example.com")
    
    // Replace a word in the second part (e.g., "www.example.com")
    urlParts[1] = currentLanguage === 'ru' ?  urlParts[1].replace("ac-comp-ru.html", "ac-comp-enx.html") : urlParts[1].replace("ac-comp-en.html", "ac-comp-ru.html");

    // Join the modified parts back together
    var modifiedURL = urlParts.join('/');

    // Update the browser's address bar with the modified URL
    window.history.pushState({}, document.title, modifiedURL);

    // Redirect to the new language version
    window.location.href = newPageURL;
}