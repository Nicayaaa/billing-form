// DOM elements
const orderBtn = document.getElementById("orderBtn");
const billingBtn = document.getElementById("billingBtn");
const orderForm = document.getElementById("orderForm");
const billingForm = document.getElementById("billingForm");

// Toggle between forms
orderBtn.addEventListener("click", () => {
  orderBtn.classList.add("active");
  billingBtn.classList.remove("active");

  orderForm.classList.add("active");
  billingForm.classList.remove("active");

  // Optional: hide/show using display if needed
  orderForm.style.display = "block";
  billingForm.style.display = "none";
});

billingBtn.addEventListener("click", () => {
  billingBtn.classList.add("active");
  orderBtn.classList.remove("active");

  billingForm.classList.add("active");
  orderForm.classList.remove("active");

  // Optional: hide/show using display if needed
  billingForm.style.display = "block";
  orderForm.style.display = "none";
});

// Load rider list when page loads
window.onload = function () {
  loadRiders();
};

// Load saved riders to the datalist
function loadRiders() {
  const datalist = document.getElementById("riderList");
  datalist.innerHTML = "";
  const savedRiders = JSON.parse(localStorage.getItem("riders")) || [];

  savedRiders.forEach((rider) => {
    const option = document.createElement("option");
    option.value = rider;
    datalist.appendChild(option);
  });
}

// Save a new rider name
function saveRiderName() {
  const riderInput = document.getElementById("riderNameBilling");
  const newName = riderInput.value.trim();
  if (!newName) return;

  let riders = JSON.parse(localStorage.getItem("riders")) || [];
  if (!riders.includes(newName)) {
    riders.push(newName);
    localStorage.setItem("riders", JSON.stringify(riders));
    loadRiders();
  }
}

// Capitalize rider name
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Generate the bill
function generateBill() {
  const itemAmountEl = document.getElementById("itemAmount");
  const deliveryChargeEl = document.getElementById("deliveryCharge");
  const transactChargeEl = document.getElementById("transactCharge");

  // Clear error highlights
  [itemAmountEl, deliveryChargeEl, transactChargeEl].forEach(el => {
    el.classList.remove("error");
  });

  // Get values
  const itemAmount = parseFloat(itemAmountEl.value) || 0;
  const heavy = parseFloat(document.getElementById("heavy").value) || 0;
  const deliveryCharge = parseFloat(deliveryChargeEl.value) || 0;
  const storeCharge = parseFloat(document.getElementById("storeCharge").value) || 0;
  const waitingTime = parseInt(document.getElementById("waitingTime").value) || 0;
  const moneyTransact = parseFloat(transactChargeEl.value) || 0;
  const taskType = document.getElementById("taskType").value;
  const riderName = document.getElementById("riderNameBilling").value.trim();

  // Check if any required fields are missing
  if (!itemAmount || !riderName) {
    alert("Please fill in all required fields.");
    return;
  }

  // Save rider
  saveRiderName();

  // Calculate waiting charge
  let waitingCharge = 0;
  if (taskType === "grocery" || taskType === "bills") {
    waitingCharge = waitingTime > 15 ? Math.ceil((waitingTime - 15) / 15) * 10 : 0;
  }

  // Compute total
  const total = itemAmount + heavy + deliveryCharge + storeCharge + waitingCharge + moneyTransact;

  // Generate receipt
  const receipt =
    `🧾 Receipt\n\n` +
    `Type of Task: ${taskType.charAt(0).toUpperCase() + taskType.slice(1)}\n` +
    `Item/Amount: ₱${itemAmount.toFixed(2)}\n` +
    `Heavy Charge: ₱${heavy.toFixed(2)}\n` +
    `Delivery Charge: ₱${deliveryCharge.toFixed(2)}\n` +
    `Add Store Charge: ₱${storeCharge.toFixed(2)}\n` +
    `Add Waiting Time: ₱${waitingCharge.toFixed(2)}\n` +
    `Money Transact Charge: ₱${moneyTransact.toFixed(2)}\n\n` +
    `TOTAL BILL: ₱${total.toFixed(2)}\n\n` +
    `Note:\n- ₱10 per extra 15 mins wait (groceries/bills only).\n- ₱10 per extra store.\n\n` +
    `Thank you for choosing us 😇\n\n` +
    `Rider: ${capitalize(riderName) || 'N/A'} 🏍️`;

  document.getElementById("output").innerText = receipt;

}

// Listen for the button click
document.getElementById('generateOrderBtn').addEventListener('click', function() {
  generateOrder();
});

function generateOrder() {
  const taskType = document.getElementById("type").value;  
  const storeName = document.getElementById("storeName").value;
  const orderList = document.getElementById("orderList").value.trim();
  const dropTo = document.getElementById("dropName").value; 
  const contactNumber = document.getElementById("contact").value;
  const address = document.getElementById("address").value;
  const landmark = document.getElementById("landmark").value;
  const roomInfo = document.getElementById("roomNote").value; 
  const riderCode = document.getElementById("riderCode").value;

  // Check if any required fields are missing
  if (!storeName || !orderList || !dropTo || !address || !landmark || !roomInfo || !riderCode) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create the order details message
    const orderMessage = `
    Order Details:
    Type of Task: ${taskType}
    Store Name: ${storeName}
    Order List: ${orderList}
    Drop To (Name): ${dropTo}
    Contact Number: ${contactNumber}
    Address: ${address}
    Landmark / Notes: ${landmark}
    Room / Floor Info: ${roomInfo}
    Rider Code (DC#): ${riderCode}
  `;
    // Display the order message
    document.getElementById("generatedOrder").innerText = orderMessage;

    // Show the print receipt button
    printReceipt();
  }

// Function to show the button after the order is generated
function printReceipt() {
  console.log("Receipt Generated");

  // Show the "Copy Text & Send to Messenger" button after receipt is generated
  document.getElementById('copyAndSendBtn');
}

// Function to copy text and image, then open share dialog
function copyAndSendReceipt() {
  // Get the text content of the receipt
  const receiptText = document.getElementById('output').innerText;

  // Get the image source (base64 or URL)
  const image = document.getElementById('imagePreview');
  const imageURL = image.style.display === 'block' ? image.src : '';

  // Combine text and image URL (base64 or URL) into one message
  let message = `Receipt Details:\n\n${receiptText}\n\nProof of Delivery Image: ${imageURL}`;

  // Copy the message to the clipboard
  navigator.clipboard.writeText(message).then(function() {
    alert('Receipt copied with image!');

    // Open the native share dialog after copying
    if (navigator.share) {
      navigator.share({
        title: 'Receipt and Image',
        text: message,
        url: imageURL // Optionally include image URL in the share URL field
      }).then(() => {
        console.log('Successfully shared!');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      alert('Share feature is not supported on this browser.');
    }
  }).catch(function(err) {
    alert('Failed to copy: ', err);
  });
}


// Function to trigger file input click on button click
document.getElementById('uploadImageBtn').addEventListener('click', function() {
  document.getElementById('imageInput').click(); // Trigger file input when the button is clicked
});

// Function to trigger file input click on button click
document.getElementById('uploadImageBtn').addEventListener('click', function() {
  document.getElementById('imageInput').click(); // Trigger file input when the button is clicked
});

// Function to preview the uploaded image
function previewImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = e.target.result; // Set image source to the file data URL
    imagePreview.style.display = 'block'; // Make sure the image is visible
    
    // Hide the upload button after the image is uploaded
    document.getElementById('uploadImageBtn').style.display = 'none';
  }

  if (file) {
    reader.readAsDataURL(file); // Read the uploaded image file
  }
}
