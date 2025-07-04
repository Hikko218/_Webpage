  // popup function success review

function showPopupReview(bool) {
  if (bool) {
    document.getElementById('popup-review').style.visibility = 'visible';
  } else {
    document.getElementById('popup-review').style.visibility = 'hidden';
  }
}

 // popup function success message

function showPopupMessage(bool) {
  if (bool) {
    document.getElementById('popup-message').style.visibility = 'visible';
  } else {
    document.getElementById('popup-message').style.visibility = 'hidden';
  }
}


  // popup function error
function showPopupError(bool) {
  if (bool) {
    document.getElementById('popup-error').style.visibility = 'visible';
  } else {
    document.getElementById('popup-error').style.visibility = 'hidden';
  }
}

document.getElementById('popup-error-btn').addEventListener('click', () => showPopupError(false));
document.getElementById('popup-message-btn').addEventListener('click', () => showPopupMessage(false));
document.getElementById('popup-review-btn').addEventListener('click', () => showPopupReview(false));

export { showPopupReview, showPopupMessage, showPopupError };