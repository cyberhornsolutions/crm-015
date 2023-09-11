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

    // Redirect to the new language version
    window.location.href = newPageURL;
}