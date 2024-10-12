// Get the elements
const loginBtn = document.getElementById("title-login");
const signupBtn = document.getElementById("title-signup");
const popup = document.getElementById("popup");  // Assuming this is your popup div
const closeBtn = document.querySelector(".close");
const titleSection = document.getElementById("title");  // The section to blur

// Function to show the popup and blur the background
function showPopup() {
  popup.style.display = "flex";  // Make the popup visible
  titleSection.classList.add("blur");  // Apply blur to the background
}

// Event listeners for login and signup buttons
loginBtn.addEventListener("click", showPopup);
signupBtn.addEventListener("click", showPopup);

// Function to close the popup and remove blur
function closePopup() {
  popup.style.display = "none";  // Hide the popup
  titleSection.classList.remove("blur");  // Remove blur from the background
}

// Event listener for close button
closeBtn.addEventListener("click", closePopup);

// Close popup when clicking outside of the popup-content
window.addEventListener("click", (event) => {
  if (event.target == popup) {
    closePopup();  // Close popup and remove blur when clicking outside the content
  }
});
