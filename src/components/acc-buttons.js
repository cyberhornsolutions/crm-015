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