/* =========================================================
   BORX frontend logic — v2
   New flow: Splash -> Onboarding -> Role popup -> (no login yet)
   Renter can browse freely; login/verification only triggers on "Rent Now".
   Owner must sign in first, then sees the listing dashboard.
   ========================================================= */

let currentRole = null;
let isLoggedIn = false;
let selectedItem = null;
let generatedOtp = null;
let wishlist = [];
let bookings = [];
let selectedPayMethod = null;
let loginFlow = null;

/* ---------- sample data ---------- */

const cities = ["Delhi", "Mumbai", "Bangalore", "Pune"];
let currentCity = "Delhi";

let listings = [
  {
    id: 1,
    title: "Canon EOS R6",
    category: "Camera",
    price: 799,
    deposit: 5000,
    icon: "📷",
    city: "Delhi",
    desc: "Full-frame mirrorless camera, includes 24-105mm lens and extra battery.",
    condition: "Like new, used twice. Comes with original box."
  },
  {
    id: 2,
    title: "DJI Mini 4 Pro",
    category: "Drone",
    price: 650,
    deposit: 8000,
    icon: "🚁",
    city: "Delhi",
    desc: "Lightweight drone with 4K camera, great for travel and events.",
    condition: "Minor scuff on one propeller guard, flies perfectly."
  },
  {
    id: 3,
    title: "MacBook Pro 14\"",
    category: "Laptop",
    price: 900,
    deposit: 10000,
    icon: "💻",
    city: "Mumbai",
    desc: "M3 chip, 16GB RAM, perfect for editing and design work on the go.",
    condition: "Excellent condition, 95% battery health."
  },
  {
    id: 4,
    title: "Trek Mountain Bike",
    category: "Bicycle",
    price: 250,
    deposit: 2000,
    icon: "🚲",
    city: "Bangalore",
    desc: "21-speed mountain bike, recently serviced, helmet included.",
    condition: "Well maintained, serviced last month."
  },
  {
    id: 5,
    title: "Sony A7 IV",
    category: "Camera",
    price: 850,
    deposit: 6000,
    icon: "📷",
    city: "Mumbai",
    desc: "Hybrid full-frame camera, great for photo and video.",
    condition: "Very good condition, minor wear on grip."
  },
  {
    id: 6,
    title: "Epson Projector",
    category: "Projector",
    price: 400,
    deposit: 1500,
    icon: "📽️",
    city: "Pune",
    desc: "Full HD projector, ideal for movie nights and presentations.",
    condition: "Like new, includes HDMI cable and remote."
  },
  {
    id: 7,
    title: "PlayStation 5",
    category: "Gaming Console",
    price: 350,
    deposit: 4000,
    icon: "🎮",
    city: "Delhi",
    desc: "PS5 with two controllers, includes 3 popular titles.",
    condition: "Great condition, smoke-free home."
  },
  {
    id: 8,
    title: "Dell XPS 15",
    category: "Laptop",
    price: 700,
    deposit: 7000,
    icon: "💻",
    city: "Bangalore",
    desc: "Powerful laptop for development and design.",
    condition: "Good condition, light keyboard wear."
  }
];

let ownerListings = [];

/* ---------- screen navigation ---------- */

const navScreens = [
  "homeScreen",
  "bookingsScreen",
  "wishlistScreen",
  "profileScreen",
  "ownerScreen",
  "ownerBookingsScreen"
];

function goTo(screenId) {
  if (screenId === "homeOrOwner") {
    screenId =
      currentRole === "owner"
        ? "ownerScreen"
        : "homeScreen";
  }

  document
    .querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));

  document
    .getElementById(screenId)
    .classList.add("active");

  window.scrollTo(0, 0);

  const nav = document.getElementById("mainNav");

  if (navScreens.includes(screenId)) {
    nav.classList.remove("hidden");
    renderNavLinks(screenId);
  } else {
    nav.classList.add("hidden");
  }
}

function renderNavLinks(activeId) {
  const container = document.getElementById("navLinks");

  let items = [];

  if (currentRole === "renter") {
    items = [
      { id: "homeScreen", label: "Browse" },
      { id: "bookingsScreen", label: "Bookings" },
      { id: "wishlistScreen", label: "Wishlist" },
      { id: "profileScreen", label: "Profile" }
    ];
  } else if (currentRole === "owner") {
    items = [
      { id: "ownerScreen", label: "Dashboard" },
      { id: "ownerBookingsScreen", label: "Requests" },
      { id: "profileScreen", label: "Profile" }
    ];
  }

  container.innerHTML = items
    .map(
      i =>
        `<button class="nav-link ${
          i.id === activeId ? "active" : ""
        }" onclick="goTo('${i.id}')">${i.label}</button>`
    )
    .join("");
}

/* ---------- splash -> onboarding ---------- */

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => goTo("onboardScreen"), 1400);

  setupLocationSelect();
  renderCategoryChips();
  renderListingGrid();

  /* IMPORTANT:
     Automatic time-based theme removed.
     BORX will stay in Vanilla theme by default.
  */

  document.documentElement.removeAttribute("data-theme");

  renderOwnerListings();
});

/* ---------- theme toggle ---------- */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;

    const isMoonlight =
      html.getAttribute("data-theme") === "moonlight";

    if (isMoonlight) {
      html.setAttribute("data-theme", "vanilla");
      themeToggle.textContent = "🌙";
    } else {
      html.setAttribute("data-theme", "moonlight");
      themeToggle.textContent = "☀️";
    }
  });
}

/* ---------- onboarding slides ---------- */

const onboardSlides = [
  {
    icon: "📍",
    title: "Rent nearby",
    text: "Browse cameras, drones, laptops and more from people around you — no need to buy what you'll use once."
  },
  {
    icon: "💰",
    title: "List & earn",
    text: "Already own gear that sits idle? List it on BORX and start earning from it."
  },
  {
    icon: "🔒",
    title: "Secure payments",
    text: "Your payment is held safely and only released to the owner once pickup is confirmed."
  },
  {
    icon: "✓",
    title: "Verified users",
    text: "ID verification and two-way reviews keep the BORX community trustworthy."
  }
];

let onboardIndex = 0;

function renderOnboardSlide() {
  const s = onboardSlides[onboardIndex];

  document.getElementById("onboardSlide").innerHTML = `
    <div class="onboard-icon">${s.icon}</div>
    <h2>${s.title}</h2>
    <p>${s.text}</p>
  `;

  document.getElementById("onboardDots").innerHTML =
    onboardSlides
      .map(
        (_, i) =>
          `<span class="${i === onboardIndex ? "active" : ""}"></span>`
      )
      .join("");

  document.getElementById("onboardNextBtn").textContent =
    onboardIndex === onboardSlides.length - 1
      ? "Get Started"
      : "Next";
}

renderOnboardSlide();

function nextOnboard() {
  if (onboardIndex < onboardSlides.length - 1) {
    onboardIndex++;
    renderOnboardSlide();
  } else {
    goTo("roleScreen");
  }
}

function skipOnboarding() {
  goTo("roleScreen");
}

/* ---------- role selection ---------- */

function selectRole(role) {
  currentRole = role;

  if (role === "renter") {
    goTo("homeScreen");
  } else {
    loginFlow = "owner-entry";

    document.getElementById("loginReason").textContent =
      "Sign in to manage your listings.";

    goTo("loginScreen");
  }
}

function switchRole() {
  currentRole = null;
  isLoggedIn = false;
  goTo("roleScreen");
}

function logout() {
  isLoggedIn = false;
  currentRole = null;
  onboardIndex = 0;
  goTo("roleScreen");
}

/* ---------- location ---------- */

function setupLocationSelect() {
  const sel = document.getElementById("locationSelect");

  sel.innerHTML = cities
    .map(
      c =>
        `<option value="${c}" ${
          c === currentCity ? "selected" : ""
        }>📍 ${c}</option>`
    )
    .join("");
}

function changeLocation() {
  currentCity =
    document.getElementById("locationSelect").value;

  document.getElementById("locationLabel").textContent =
    currentCity;

  renderListingGrid();
  renderFeatured();
}

/* ---------- categories + listing grid ---------- */

const categories = [
  "All",
  "Camera",
  "Drone",
  "Laptop",
  "Gaming Console",
  "Bicycle",
  "Projector"
];

let activeCategory = "All";

function renderCategoryChips() {
  const row = document.getElementById("categoryChips");

  row.innerHTML = categories
    .map(
      c =>
        `<button class="chip ${
          c === activeCategory ? "active" : ""
        }" onclick="filterCategory('${c}', this)">${c}</button>`
    )
    .join("");

  renderFeatured();
}

function filterCategory(cat, el) {
  activeCategory = cat;

  document
    .querySelectorAll(".chip")
    .forEach(c => c.classList.remove("active"));

  el.classList.add("active");

  renderListingGrid();
}

function getFilteredListings() {
  const search = (
    document.getElementById("searchInput")?.value || ""
  ).toLowerCase();

  return listings.filter(
    l =>
      l.city === currentCity &&
      (activeCategory === "All" ||
        l.category === activeCategory) &&
      l.title.toLowerCase().includes(search)
  );
}

function renderFeatured() {
  const strip =
    document.getElementById("featuredStrip");

  const featured = listings
    .filter(l => l.city === currentCity)
    .slice(0, 4);

  strip.innerHTML = featured
    .map(
      item => `
      <div class="featured-card" onclick="openItem(${item.id})">
        <div class="listing-thumb">${item.icon}</div>
        <div class="listing-body">
          <h4>${item.title}</h4>
          <p class="listing-price">₹${item.price}/day</p>
        </div>
      </div>
    `
    )
    .join("");
}

function renderListingGrid() {
  const grid =
    document.getElementById("listingGrid");

  const filtered = getFilteredListings();

  document.getElementById(
    "locationLabel"
  ).textContent = currentCity;

  grid.innerHTML = filtered
    .map(
      item => `
      <div class="listing-card" onclick="openItem(${item.id})">
        <div class="listing-thumb">${item.icon}</div>

        <div class="listing-body">
          <h4>${item.title}</h4>
          <p class="listing-price">₹${item.price}/day</p>
          <p class="listing-meta">
            ${item.category} • ⭐ 4.8
          </p>
        </div>
      </div>
    `
    )
    .join("") ||
    '<p class="hint">No items found in this category / location yet.</p>';
}

/* ---------- item details ---------- */

function openItem(id) {
  selectedItem = listings.find(l => l.id === id);

  if (!selectedItem) return;

  document.getElementById("itemGallery").textContent =
    selectedItem.icon;

  document.getElementById("itemTitle").textContent =
    selectedItem.title;

  document.getElementById("itemOwner").textContent =
    "Owned by Rahul M.";

  document.getElementById("itemDesc").textContent =
    selectedItem.desc;

  document.getElementById("itemCondition").textContent =
    "📝 " + selectedItem.condition;

  const fee = Math.round(selectedItem.price * 0.1);

  document.getElementById("priceRate").textContent =
    `₹${selectedItem.price} / day`;

  document.getElementById("priceDeposit").textContent =
    `₹${selectedItem.deposit}`;

  document.getElementById("priceFee").textContent =
    `₹${fee}`;

  document.getElementById("priceTotal").textContent =
    `₹${
      selectedItem.price +
      selectedItem.deposit +
      fee
    }`;

  document.getElementById("wishlistBtn").textContent =
    wishlist.includes(id) ? "❤️" : "🤍";

  goTo("itemScreen");
}

function toggleWishlist() {
  if (!selectedItem) return;

  const idx = wishlist.indexOf(selectedItem.id);

  if (idx === -1) {
    wishlist.push(selectedItem.id);

    document.getElementById(
      "wishlistBtn"
    ).textContent = "❤️";
  } else {
    wishlist.splice(idx, 1);

    document.getElementById(
      "wishlistBtn"
    ).textContent = "🤍";
  }

  renderWishlistGrid();
}

function renderWishlistGrid() {
  const grid =
    document.getElementById("wishlistGrid");

  const items = listings.filter(l =>
    wishlist.includes(l.id)
  );

  grid.innerHTML = items
    .map(
      item => `
      <div class="listing-card" onclick="openItem(${item.id})">
        <div class="listing-thumb">${item.icon}</div>

        <div class="listing-body">
          <h4>${item.title}</h4>
          <p class="listing-price">
            ₹${item.price}/day
          </p>
        </div>
      </div>
    `
    )
    .join("") ||
    '<p class="hint">No items saved yet.</p>';
}

/* ---------- rent now -> login gate ---------- */

function rentNow() {
  const start =
    document.getElementById("startDate").value;

  const end =
    document.getElementById("endDate").value;

  if (!start || !end) {
    alert("Please select both start and end dates");
    return;
  }

  if (!isLoggedIn) {
    loginFlow = "renter-booking";

    document.getElementById(
      "loginReason"
    ).textContent =
      `Sign in to book ${selectedItem.title}.`;

    resetLoginSteps();
    goTo("loginScreen");
  } else {
    goTo("paymentScreen");
    setupPaymentScreen();
  }
}

/* ---------- login / OTP / ID verification ---------- */

function resetLoginSteps() {
  document
    .getElementById("phoneStep")
    .classList.remove("hidden");

  document
    .getElementById("otpStep")
    .classList.add("hidden");

  document
    .getElementById("idStep")
    .classList.add("hidden");
}

function sendOtp() {
  const phone =
    document
      .getElementById("phoneInput")
      .value.trim();

  if (phone.length < 10) {
    alert("Enter a valid 10-digit phone number");
    return;
  }

  generatedOtp =
    Math.floor(
      1000 + Math.random() * 9000
    ).toString();

  console.log(
    "DEMO OTP:",
    generatedOtp
  );

  document
    .getElementById("phoneStep")
    .classList.add("hidden");

  document
    .getElementById("otpStep")
    .classList.remove("hidden");

  document.getElementById(
    "otpHint"
  ).textContent =
    `OTP sent to ${phone}. (Demo OTP: ${generatedOtp})`;
}

function verifyOtp() {
  const entered =
    document
      .getElementById("otpInput")
      .value.trim();

  if (entered !== generatedOtp) {
    alert("Incorrect OTP, try again");
    return;
  }

  document
    .getElementById("otpStep")
    .classList.add("hidden");

  document
    .getElementById("idStep")
    .classList.remove("hidden");
}

function finishIdVerification() {
  isLoggedIn = true;

  if (loginFlow === "owner-entry") {
    goTo("ownerScreen");
    renderOwnerListings();
  } else {
    goTo("paymentScreen");
    setupPaymentScreen();
  }
}

/* ---------- payments ---------- */

const payMethodOptions = [
  "UPI",
  "Credit / Debit Card",
  "Net Banking",
  "Wallet",
  "Cash on Pickup"
];

let payFeeCached = 0;

function setupPaymentScreen() {
  const fee =
    Math.round(selectedItem.price * 0.1);

  payFeeCached = fee;

  document.getElementById(
    "payRate"
  ).textContent =
    `₹${selectedItem.price}`;

  document.getElementById(
    "payDeposit"
  ).textContent =
    `₹${selectedItem.deposit}`;

  document.getElementById(
    "payFee"
  ).textContent =
    `₹${fee}`;

  document.getElementById(
    "payTotal"
  ).textContent =
    `₹${
      selectedItem.price +
      selectedItem.deposit +
      fee
    }`;

  selectedPayMethod =
    payMethodOptions[0];

  document.getElementById(
    "payMethods"
  ).innerHTML =
    payMethodOptions
      .map(
        m => `
        <div class="pay-method ${
          m === selectedPayMethod
            ? "selected"
            : ""
        }"
        onclick="selectPayMethod('${m}', this)">

          <span>
            ${
              m === "UPI"
                ? "📱"
                : m.includes("Card")
                ? "💳"
                : m === "Net Banking"
                ? "🏦"
                : m === "Wallet"
                ? "👛"
                : "💵"
            }
          </span>

          <span>${m}</span>
        </div>
      `
      )
      .join("");
}

function selectPayMethod(method, el) {
  selectedPayMethod = method;

  document
    .querySelectorAll(".pay-method")
    .forEach(p =>
      p.classList.remove("selected")
    );

  el.classList.add("selected");
}

function confirmPayment() {
  const start =
    document.getElementById("startDate").value;

  const end =
    document.getElementById("endDate").value;

  bookings.push({
    id: Date.now(),
    item: selectedItem,
    start,
    end,
    status: "confirmed",
    payMethod: selectedPayMethod
  });

  document.getElementById(
    "confirmSummary"
  ).textContent =
    `${selectedItem.title} is reserved from ${start} to ${end}.`;

  goTo("confirmScreen");

  renderBookingsList();
}

/* ---------- bookings list + lifecycle ---------- */

function renderBookingsList() {
  const list =
    document.getElementById("bookingsList");

  if (bookings.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>📦</p>
        <p>Your rentals will show up here once confirmed.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = bookings
    .map(
      b => `
      <div class="booking-row"
           onclick="openBooking(${b.id})">

        <div>
          <h4>${b.item.title}</h4>
          <p>${b.start} → ${b.end}</p>
        </div>

        <span class="status-pill status-${b.status}">
          ${b.status}
        </span>

      </div>
    `
    )
    .join("");
}

let activeBooking = null;

function openBooking(id) {
  activeBooking =
    bookings.find(b => b.id === id);

  if (!activeBooking) return;

  if (activeBooking.status === "confirmed") {
    activeBooking.status = "active";
    renderBookingsList();
  }

  goTo("activeRentalScreen");
}

function submitReview() {
  if (activeBooking) {
    activeBooking.status = "completed";
  }

  renderBookingsList();

  alert("Thanks for your review!");

  goTo("bookingsScreen");
}

/* ---------- star ratings ---------- */

["itemStars", "ownerStars"].forEach(id => {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      const el =
        document.getElementById(id);

      if (!el) return;

      el.innerHTML = [1, 2, 3, 4, 5]
        .map(
          n =>
            `<span onclick="setStars('${id}', ${n})">☆</span>`
        )
        .join("");
    }
  );
});

function setStars(groupId, n) {
  const el =
    document.getElementById(groupId);

  el.innerHTML = [1, 2, 3, 4, 5]
    .map(
      i =>
        `<span onclick="setStars('${groupId}', ${i})">${
          i <= n ? "★" : "☆"
        }</span>`
    )
    .join("");
}

/* ---------- owner: listings management ---------- */

function switchTab(tabId, btn) {
  document
    .querySelectorAll(".tab-panel")
    .forEach(p =>
      p.classList.add("hidden")
    );

  document
    .querySelectorAll(".tab-btn")
    .forEach(b =>
      b.classList.remove("active")
    );

  document
    .getElementById(tabId)
    .classList.remove("hidden");

  btn.classList.add("active");
}

function renderOwnerListings() {
  const list =
    document.getElementById(
      "ownerListingList"
    );

  document.getElementById(
    "statListings"
  ).textContent =
    ownerListings.length;

  document.getElementById(
    "statBookings"
  ).textContent = 0;

  document.getElementById(
    "statEarnings"
  ).textContent = "₹0";

  if (ownerListings.length === 0) {
    list.innerHTML =
      "<p class=\"hint\">You haven't listed any items yet. Tap \"Add New\" to get started.</p>";
    return;
  }

  list.innerHTML = ownerListings
    .map(
      item => `
      <div class="owner-listing-row">

        <div>
          <h4>${item.title}</h4>
          <p>
            ${item.category} •
            ₹${item.price}/day •
            Deposit ₹${item.deposit}
          </p>
        </div>

        <button
          class="delete-btn"
          onclick="deleteListing(${item.id})">
          ✕
        </button>

      </div>
    `
    )
    .join("");
}

function addListing() {
  const title =
    document
      .getElementById("newTitle")
      .value.trim();

  const category =
    document.getElementById(
      "newCategory"
    ).value;

  const price =
    document.getElementById(
      "newPrice"
    ).value;

  const deposit =
    document.getElementById(
      "newDeposit"
    ).value;

  const desc =
    document
      .getElementById("newDesc")
      .value.trim();

  if (!title || !price || !deposit) {
    alert(
      "Please fill in title, daily price and deposit"
    );
    return;
  }

  ownerListings.push({
    id: Date.now(),
    title,
    category,
    price: Number(price),
    deposit: Number(deposit),
    desc
  });

  document.getElementById(
    "newTitle"
  ).value = "";

  document.getElementById(
    "newPrice"
  ).value = "";

  document.getElementById(
    "newPriceHour"
  ).value = "";

  document.getElementById(
    "newPriceWeek"
  ).value = "";

  document.getElementById(
    "newDeposit"
  ).value = "";

  document.getElementById(
    "newDesc"
  ).value = "";

  renderOwnerListings();

  switchTab(
    "myListingsTab",
    document.querySelector(".tab-btn")
  );
}

function deleteListing(id) {
  ownerListings =
    ownerListings.filter(
      l => l.id !== id
    );

  renderOwnerListings();
}
