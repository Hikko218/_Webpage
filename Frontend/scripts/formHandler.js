import { showPopupReview, showPopupMessage, showPopupError } from "./popup.js";
import { showSection } from "./sectionManagment.js";

// addRecommendation function

async function addReview(event) {
  event.preventDefault();

  let review = document.getElementById("new_review");
  let email = document.getElementById("email");
  let name = document.getElementById("name");

  // Validierung
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
        console.log("New review saved to database");
        showPopupReview(true);

        // Input fields reset
        review.value = "";
        email.value = "";
        name.value = "";

        await showSection("reviews");
      } else {
        const error = await response.json();
        console.error("Server error:", error.message);
        showPopupError(true);
      }
    } catch (err) {
      console.error("Network error:", err);
      showPopupError(true);
    }
  } else {
    console.log("No valid input");
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
  let email = document.getElementById("email_m"); // valid email test const
  let name = document.getElementById("name_m");

  if (
    messageInput.value.trim() !== "" && // valid input test
    email.value.trim() !== "" &&
    name.value.trim() !== ""
  ) {
    try {
      // Send POST request to save the message
      const response = await fetch(
        "http://localhost:3000/api/content/contact",
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
        console.log("New message added to database");
        showPopupMessage(true);

        messageInput.value = "";
        email.value = "";
        name.value = "";
      } else {
        console.log("No valid input");
        showPopupError(true);
      }
    } catch (err) {
      console.error("Network error:", err);
      showPopupError(true);
    }
  } else {
    console.log("No valid input");
    showPopupError(true);
  }
}
// Event listeners for message form

document
  .querySelector(".contact_input_form")
  .addEventListener("submit", message);
