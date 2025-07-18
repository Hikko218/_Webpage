// Frontend/scripts/formHandler.js
// Import necessary functions from other modules
import { showPopupReview, showPopupMessage, showPopupError } from "./popup.js";
import { showSection } from "./sectionManagment.js";

// addRecommendation function
async function addReview(event) {
  event.preventDefault();

  let review = document.getElementById("new_review");
  let email = document.getElementById("email");
  let name = document.getElementById("name");

  // Validate input fields
  if (
    review.value.trim() !== "" &&
    email.value.trim() !== "" &&
    name.value.trim() !== ""
  ) {
    try {
      // Send POST request to save the review
      const response = await fetch(
        "http://localhost:3000/api/content/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            text: review.value.trim(),
          }),
        }
      );

      if (response.ok) {
        showPopupReview(true);

        // Input fields reset
        review.value = "";
        email.value = "";
        name.value = "";

        await showSection("reviews");
      } else {
        showPopupError(true);
      }
    } catch (err) {
      showPopupError(true);
    }
  } else {
    showPopupError(true);
  }
}

// Event listeners for review form
document
  .querySelector(".review_input_form")
  .addEventListener("submit", addReview);

// message function client-side
async function message(event) {
  event.preventDefault();

  let messageInput = document.getElementById("new_message");
  let email = document.getElementById("email_m"); 
  let name = document.getElementById("name_m");

  if (
    messageInput.value.trim() !== "" && 
    email.value.trim() !== "" &&
    name.value.trim() !== ""
  ) {
    try {
      // Send POST request to save the message
      const response = await fetch(
        "https://webpage-5mmz.onrender.com/api/content/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            message: messageInput.value.trim(),
            date: new Date().toISOString(),      // Ensure date is in ISO format
          }),
        }
      );

      if (response.ok) {
        showPopupMessage(true);

        messageInput.value = "";
        email.value = "";
        name.value = "";
      } else {
        showPopupError(true);
      }
    } catch (err) {
      showPopupError(true);
    }
  } else {
    showPopupError(true);
  }
}

// Event listeners for message form
document
  .querySelector(".contact_input_form")
  .addEventListener("submit", message);
