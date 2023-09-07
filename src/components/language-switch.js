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