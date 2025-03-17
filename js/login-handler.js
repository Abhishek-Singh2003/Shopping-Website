// Login handler script

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // Store the current URL to return to after login
    localStorage.setItem('returnUrl', window.location.href);
    
    // Wait a few milliseconds before redirecting to login page
    setTimeout(function() {
      // Redirect to login page
      window.location.href = window.location.href.includes('/pages/') 
        ? 'login.html' 
        : 'pages/login.html';
    }, 500); // 500 milliseconds delay
  }
  
  // Add logout functionality to user icon if it exists
  const userIcon = document.querySelector('.fa-user-circle-o');
  if (userIcon && isLoggedIn) {
    userIcon.style.cursor = 'pointer';
    userIcon.title = 'Logout';
    userIcon.addEventListener('click', function() {
      // Clear login state
      localStorage.removeItem('isLoggedIn');
      
      // Show logout notification
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.right = '20px';
      notification.style.backgroundColor = '#009688';
      notification.style.color = 'white';
      notification.style.padding = '15px 20px';
      notification.style.borderRadius = '5px';
      notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
      notification.style.transform = 'translateY(100px)';
      notification.style.opacity = '0';
      notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      notification.style.zIndex = '1000';
      notification.textContent = 'Logged out successfully!';
      document.body.appendChild(notification);
      
      // Show notification
      setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
      }, 100);
      
      // Hide notification after 2 seconds and redirect to login page
      setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
          // Redirect to login page instead of reloading
          window.location.href = window.location.href.includes('/pages/') 
            ? 'login.html' 
            : 'pages/login.html';
        }, 300);
      }, 2000);
    });
  }
});

// Function to show notification
function showNotification(message) {
  // Check if notification element exists, create if not
  let notification = document.getElementById('login-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'login-notification';
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set message and show notification
  notification.textContent = message;
  notification.classList.add('show');
  
  // Hide notification after 3 seconds
  setTimeout(function() {
    notification.classList.remove('show');
  }, 3000);
}

// Function to log out
function logout() {
  // Clear login state
  localStorage.removeItem('isLoggedIn');
  
  // Show notification
  showNotification('Logged out successfully!');
  
  // Redirect to login page after a short delay
  setTimeout(function() {
    window.location.href = window.location.href.includes('/pages/') 
      ? 'login.html' 
      : 'pages/login.html';
  }, 1500);
}

// Add logout functionality to any logout buttons
document.addEventListener('DOMContentLoaded', function() {
  const logoutButtons = document.querySelectorAll('.logout-btn');
  logoutButtons.forEach(button => {
    button.addEventListener('click', logout);
  });
}); 