// File: Frontend/scripts/adminEdit.js
// This script handles the admin editing functionality.
// It allows the admin to change the content of the different sections.

import { showSection } from "./sectionManagment.js";

//Home Content Edit Functionality
async function changeHomeContent(event) {
  event.preventDefault();
    const heading = document.getElementById("edit-home-heading").value.trim();
    const text = document.getElementById("edit-home-text").value.trim();

    if (heading && text) {
      try {
        const response = await fetch("http://localhost:3000/api/content/home", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                heading,
                text,
            }),
            });
        if (response.ok) {
            // Refresh the home section to show updated content
            showSection('home');
            console.log("Home content updated successfully");
        } else {
            const error = await response.json();
            console.error("Error updating home content:", error.message);
        }
        } catch (err) {
            console.error("Network error:", err);
        }
    } else {
        console.log("Heading and text cannot be empty");
    }
}
// Add event listener to the home edit form
document.querySelector(".home-admin-edit").addEventListener("submit", changeHomeContent);

// Reviews delete functionality
async function deleteReview(event) {
  if (event.target.classList.contains("delete-review-btn")) {
    const reviewId = event.target.dataset.reviewId;
    try {
      const response = await fetch(`http://localhost:3000/api/content/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        console.log("Review deleted successfully");
        // Refresh the reviews section to show updated content
        showSection('reviews');
      } else {
        const error = await response.json();
        console.error("Error deleting review:", error.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  }
}

// Add event listener to the reviews section for delete buttons
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-review-btn')) {
    deleteReview(e);
  }
});