// Search functionality for Curiosity Closet
document.addEventListener('DOMContentLoaded', function() {
  // Get search elements
  const searchIcon = document.querySelector('.fa-search');
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <div class="search-box">
      <input type="text" id="search-input" placeholder="Search for products...">
      <button id="search-button">
        <i class="fa fa-search"></i>
      </button>
      <button id="close-search">
        <i class="fa fa-times"></i>
      </button>
    </div>
  `;
  
  // Add search container to body but hide it initially
  document.body.appendChild(searchContainer);
  searchContainer.style.display = 'none';
  
  // Toggle search box when search icon is clicked
  searchIcon.addEventListener('click', function() {
    searchContainer.style.display = 'flex';
    document.getElementById('search-input').focus();
  });
  
  // Close search box when close button is clicked
  document.getElementById('close-search').addEventListener('click', function() {
    searchContainer.style.display = 'none';
  });
  
  // Handle search functionality
  function performSearch() {
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
    
    // Define search mappings
    const searchMappings = {
      'mens': 'pages/mens.html',
      'men': 'pages/mens.html',
      'mens clothing': 'pages/mens.html',
      'men clothing': 'pages/mens.html',
      'men\'s': 'pages/mens.html',
      'men\'s clothing': 'pages/mens.html',
      
      'womens': 'pages/womens.html',
      'women': 'pages/womens.html',
      'womens clothing': 'pages/womens.html',
      'women clothing': 'pages/womens.html',
      'women\'s': 'pages/womens.html',
      'women\'s clothing': 'pages/womens.html',
      
      'childrens': 'pages/childrens.html',
      'children': 'pages/childrens.html',
      'kids': 'pages/childrens.html',
      'childrens clothing': 'pages/childrens.html',
      'children clothing': 'pages/childrens.html',
      'kids clothing': 'pages/childrens.html',
      'children\'s': 'pages/childrens.html',
      'children\'s clothing': 'pages/childrens.html',
      
      'accessories': 'index.html#accessories',
      'accessory': 'index.html#accessories'
    };
    
    // Check if search term matches any of our predefined terms
    if (searchTerm in searchMappings) {
      // Get the correct URL based on current location
      let baseUrl = '';
      if (window.location.href.includes('/pages/')) {
        baseUrl = '../';
      }
      
      // Navigate to the appropriate page
      window.location.href = baseUrl + searchMappings[searchTerm];
      return;
    }
    
    // For other search terms, we could implement a more complex search
    // For now, just show a notification
    showSearchNotification(`Searching for "${searchTerm}"...`);
    
    // Clear search input
    document.getElementById('search-input').value = '';
    
    // Hide search box after search
    setTimeout(() => {
      searchContainer.style.display = 'none';
    }, 500);
  }
  
  // Search when button is clicked
  document.getElementById('search-button').addEventListener('click', performSearch);
  
  // Search when Enter key is pressed in the input field
  document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Function to show search notification
  function showSearchNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.search-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'search-notification';
      document.body.appendChild(notification);
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
}); 