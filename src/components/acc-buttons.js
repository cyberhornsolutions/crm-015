// JavaScript to handle the success modal and auto-close
document.getElementById('accept-deposit').addEventListener('click', function() {
  // Assuming the form is valid and the upload is successful
  // Show the success modal
  event.preventDefault();
  var successModal = new bootstrap.Modal(document.getElementById('dep-successModal'));
  successModal.show();

  // Close the success modal after 5 seconds (5000 milliseconds)
  setTimeout(function() {
    successModal.hide();
  }, 10500);
});
document.getElementById("deposit-button").addEventListener("click", function() {
  var myModal = new bootstrap.Modal(document.getElementById("deposit-modal"));
  myModal.show();
});

document.getElementById('accept-withdraw').addEventListener('click', function() {
  // Assuming the form is valid and the upload is successful
  // Show the success modal
  event.preventDefault();
  var successModal = new bootstrap.Modal(document.getElementById('wd-successModal'));
  successModal.show();

  // Close the success modal after 5 seconds (5000 milliseconds)
  setTimeout(function() {
    successModal.hide();
  }, 10500);
});
document.getElementById("withdraw-request-button").addEventListener("click", function() {
  var myModal = new bootstrap.Modal(document.getElementById("withdraw-modal"));
  myModal.show();
});

// JavaScript to handle the success modal and auto-close
document.getElementById('uploadButton').addEventListener('click', function() {
  // Assuming the form is valid and the upload is successful
  // Show the success modal
  event.preventDefault();
  var successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();

  // Close the success modal after 5 seconds (5000 milliseconds)
  setTimeout(function() {
    successModal.hide();
  }, 2500);
});


// Get references to the edit and save buttons
const editButton = document.getElementById("acc-edit-button");
const saveButton = document.getElementById("acc-save-button");
const commentField = document.getElementById("comment");

// Add a click event listener to the edit button
editButton.addEventListener("click", function () {
    // Hide the edit button
    editButton.style.display = "none";
    commentField.removeAttribute('disabled')
    saveButton.style.display = "inline-block";
});

// Add a click event listener to the save button
saveButton.addEventListener("click", function () {
    // Hide the save button
    saveButton.style.display = "none";
    commentField.setAttribute('disabled', 'true')
    // Display the edit button
    editButton.style.display = "inline-block";
});

const newDealButtonMobile = document.getElementById('newDealButtonMobile')

newDealButtonMobile.addEventListener("click", function () {
  document.getElementById('chart').style.display = 'none'
  document.getElementById('newOrder').style.display = 'flex'
})