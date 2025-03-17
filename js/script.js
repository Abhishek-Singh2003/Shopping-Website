// DOM Elements
const navLinks = document.querySelector('.nav-links');
const burger = document.querySelector('.burger');
const cartCount = document.getElementById('cart-count');
const cartIcon = document.getElementById('cartIcon');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const bannerSlider = document.getElementById('banner');

// Check if user is logged in
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname.split('/').pop();
  
  // If not logged in and not on login page, redirect to login page
  if (isLoggedIn !== 'true' && currentPage !== 'login.html' && !currentPage.includes('login')) {
    window.location.href = 'pages/login.html';
  }
}

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('curiosityClosetCart')) || [];
updateCartCount();

// Navigation Menu Toggle
function navSlide() {
  burger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('nav-active');
    
    // Animate Links
    const links = document.querySelectorAll('.nav-links li');
    links.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
  });
}

// Update Cart Count
function updateCartCount() {
  // Get all cart counts on the page
  const cartCounts = document.querySelectorAll('#cart-count');
  
  // Calculate total quantity of items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Update all cart count elements
  cartCounts.forEach(count => {
    count.textContent = totalItems;
    
    // Show/hide cart count based on whether there are items
    if (totalItems > 0) {
      count.style.display = 'flex';
    } else {
      count.style.display = 'none';
    }
  });
  
  // Save cart to localStorage
  localStorage.setItem('curiosityClosetCart', JSON.stringify(cart));
}

// Add to Cart Functionality
function setupAddToCart() {
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('add-to-cart')) {
      const card = e.target.closest('.card') || e.target.closest('.featured-item');
      if (!card) return;
      
      // Get product details
      const productId = card.dataset.id;
      const productName = card.querySelector('h3').textContent;
      const priceElement = card.querySelector('.price');
      const productPrice = parseFloat(priceElement.textContent.replace('$', ''));
      const productImg = card.querySelector('img').src;
      
      // Check if product already in cart
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`Added another ${productName} to cart!`);
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          img: productImg,
          quantity: 1
        });
        showNotification(`${productName} added to cart!`);
      }
      
      // Update cart count
      updateCartCount();
      
      // Animation effect
      animateCartIcon();
    }
  });
}

// Remove from Cart Functionality
function removeFromCart(productId) {
  // Find the item index
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex !== -1) {
    const itemName = cart[itemIndex].name;
    
    // Remove item from cart
    cart.splice(itemIndex, 1);
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${itemName} removed from cart`);
    
    return true;
  }
  
  return false;
}

// Update Item Quantity
function updateItemQuantity(productId, newQuantity) {
  // Find the item
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    // Update quantity
    item.quantity = Math.max(1, newQuantity);
    
    // Update cart count
    updateCartCount();
    
    return true;
  }
  
  return false;
}

// Animate Cart Icon
function animateCartIcon() {
  // Find all cart icons on the page
  const cartIcons = document.querySelectorAll('#cartIcon');
  
  // Add animation to all cart icons
  cartIcons.forEach(icon => {
    icon.classList.add('cart-animation');
    setTimeout(() => {
      icon.classList.remove('cart-animation');
    }, 500);
  });
}

// Show Notification
function showNotification(message) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  });
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Banner Slider
function setupBannerSlider() {
  if (!bannerSlider) return;
  
  const images = bannerSlider.querySelectorAll('img');
  let currentIndex = 0;
  
  // Hide all images except the first one
  images.forEach((img, index) => {
    if (index !== 0) {
      img.style.display = 'none';
    }
  });
  
  // Change slide every 5 seconds
  setInterval(() => {
    images[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].style.display = 'block';
    images[currentIndex].style.animation = 'fadeIn 1s ease-in-out';
  }, 5000);
}

// Fetch Products from API
async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    
    // Filter products by category
    const menClothing = products.filter(product => 
      product.category === "men's clothing"
    );
    
    const womenClothing = products.filter(product => 
      product.category === "women's clothing"
    );
    
    const accessories = products.filter(product => 
      product.category === "jewelery" || product.category === "electronics"
    );
    
    // Display products on homepage
    if (document.getElementById('clothingCards')) {
      displayProducts(menClothing.concat(womenClothing), 'clothingCards');
    }
    
    if (document.getElementById('accessoriesCards')) {
      displayProducts(accessories, 'accessoriesCards');
    }
    
    // Display products on category pages
    if (document.getElementById('mensProducts')) {
      displayProducts(menClothing, 'mensProducts');
    }
    
    if (document.getElementById('womensProducts')) {
      displayProducts(womenClothing, 'womensProducts');
    }
    
    if (document.getElementById('childrensProducts')) {
      // Since the API doesn't have children's products, we'll create some mock data
      const childrenProducts = [
        {
          id: 'c1',
          title: "Children's T-Shirt",
          price: 15.99,
          description: "Comfortable cotton t-shirt for kids",
          image: "https://images.pexels.com/photos/35188/child-childrens-baby-children-s.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          category: "children's clothing"
        },
        {
          id: 'c2',
          title: "Children's Jeans",
          price: 24.99,
          description: "Durable denim jeans for active kids",
          image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          category: "children's clothing"
        },
        {
          id: 'c3',
          title: "Children's Sneakers",
          price: 29.99,
          description: "Comfortable and stylish sneakers for kids",
          image: "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          category: "children's clothing"
        },
        {
          id: 'c4',
          title: "Children's Hoodie",
          price: 22.99,
          description: "Warm hoodie for kids",
          image: "https://images.pexels.com/photos/6953867/pexels-photo-6953867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          category: "children's clothing"
        },
        {
          id: 'c5',
          title: "Children's Dress",
          price: 34.99,
          description: "Beautiful dress for special occasions",
          image: "https://images.pexels.com/photos/5693889/pexels-photo-5693889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          category: "children's clothing"
        },
        {
          id: 'c6',
          title: "Children's Backpack",
          price: 19.99,
          description: "Colorful backpack for school or travel",
          image: "https://images.pexels.com/photos/3662840/pexels-photo-3662840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          category: "children's accessories"
        }
      ];
      
      displayProducts(childrenProducts, 'childrensProducts');
    }
    
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Display fallback products if API fails
    displayFallbackProducts();
  }
}

// Display Fallback Products if API fails
function displayFallbackProducts() {
  const fallbackProducts = [
    {
      id: 'f1',
      title: "Men's Casual Shirt",
      price: 39.99,
      description: "Comfortable casual shirt for everyday wear",
      image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "men's clothing"
    },
    {
      id: 'f2',
      title: "Women's Summer Dress",
      price: 49.99,
      description: "Elegant summer dress for any occasion",
      image: "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "women's clothing"
    },
    {
      id: 'f3',
      title: "Men's Denim Jacket",
      price: 79.99,
      description: "Classic denim jacket for a stylish look",
      image: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "men's clothing"
    },
    {
      id: 'f4',
      title: "Women's Handbag",
      price: 59.99,
      description: "Elegant handbag to complement any outfit",
      image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "accessories"
    }
  ];
  
  // Display products on homepage
  if (document.getElementById('clothingCards')) {
    displayProducts(fallbackProducts.filter(p => p.category.includes('clothing')), 'clothingCards');
  }
  
  if (document.getElementById('accessoriesCards')) {
    displayProducts(fallbackProducts.filter(p => p.category === 'accessories'), 'accessoriesCards');
  }
  
  // Display products on category pages
  if (document.getElementById('mensProducts')) {
    displayProducts(fallbackProducts.filter(p => p.category === "men's clothing"), 'mensProducts');
  }
  
  if (document.getElementById('womensProducts')) {
    displayProducts(fallbackProducts.filter(p => p.category === "women's clothing"), 'womensProducts');
  }
}

// Display Products
function displayProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = product.id;
    
    card.innerHTML = `
      <div class="card-img">
        <img src="${product.image || product.img}" alt="${product.title || product.name}">
      </div>
      <div class="card-details">
        <h3>${product.title || product.name}</h3>
        <p>${product.description ? product.description.substring(0, 50) + '...' : ''}</p>
        <div class="card-footer">
          <span class="price">$${product.price}</span>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Handle Age Group Selection on Children's Page
function setupAgeGroupFilter() {
  const ageGroups = document.querySelectorAll('.age-group');
  if (ageGroups.length === 0) return;
  
  ageGroups.forEach(group => {
    group.addEventListener('click', () => {
      // Remove active class from all groups
      ageGroups.forEach(g => g.classList.remove('active'));
      
      // Add active class to clicked group
      group.classList.add('active');
      
      // Show notification
      showNotification(`Showing products for ${group.textContent}`);
      
      // In a real application, you would filter products based on age group
    });
  });
}

// Handle Newsletter Subscription
function setupNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  if (!newsletterForm) return;
  
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    
    if (emailInput && emailInput.value) {
      showNotification(`Thank you for subscribing with ${emailInput.value}!`);
      emailInput.value = '';
    }
  });
}

// Handle Checkout Button Click
function setupCheckoutButton() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (!checkoutBtn) return;
  
  checkoutBtn.addEventListener('click', () => {
    window.location.href = 'payment.html';
  });
}

// Initialize all functions
function init() {
  // Check login status first
  checkLoginStatus();
  
  navSlide();
  setupAddToCart();
  setupBannerSlider();
  fetchProducts();
  setupAgeGroupFilter();
  setupNewsletterForm();
  setupCheckoutButton();
  
  // Add animation classes to elements when they come into view
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section-heading, .card, .icon-container, .collection-item').forEach(el => {
      if (!el.hasAttribute('data-aos')) {
        observer.observe(el);
      }
    });
  }
  
  // Set active class for current page in navigation
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-links li a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href').split('/').pop();
    if (currentPage === linkHref || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Initialize cart count display
  updateCartCount();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 