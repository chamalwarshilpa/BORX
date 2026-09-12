/**
 * Borex - Simplified Peer-to-Peer Rental Platform
 * Left Three-Dot Menu, Clean Header, Categories First, Light Blue Accent (#0284C7),
 * User-Selected Fulfillment (Self Pickup vs. Porter Delivery),
 * Dynamic Currency, KYC Verification, AI Damage Detection, 24-48h Auto-Refund.
 */

// ==========================================
// 1. GLOBAL STATE & CURRENCIES
// ==========================================
let platformCommissionRate = 0.18; // 18% platform fee
const depositProcessingFeeRate = 0.05; // 5% deposit escrow cut
const defaultPorterFeeUSD = 1.80; // ~₹150 Porter fare

const currencies = {
  INR: { symbol: '₹', rate: 83.5, flag: '🇮🇳', name: 'Indian Rupee' },
  USD: { symbol: '$', rate: 1.0, flag: '🇺🇸', name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, flag: '🇪🇺', name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, flag: '🇬🇧', name: 'British Pound' },
  AED: { symbol: 'AED ', rate: 3.67, flag: '🇦🇪', name: 'UAE Dirham' },
  CAD: { symbol: 'C$', rate: 1.36, flag: '🇨🇦', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', rate: 1.52, flag: '🇦🇺', name: 'Australian Dollar' },
  JPY: { symbol: '¥', rate: 155.0, flag: '🇯🇵', name: 'Japanese Yen' }
};

let activeCurrency = localStorage.getItem('borex_currency') || 'INR';

// User State (Starts unauthenticated by default, logs in via KYC)
let userProfile = {
  name: "Sahil Sharma",
  email: "sahil.sharma@example.com",
  phone: "+91 98765 43210",
  country: "INR",
  isLoggedIn: false,
  isKYCVerified: false,
  verificationId: null
};

const initialCatalog = [
  {
    id: "item-1",
    title: "DJI Mavic 3 Pro Cine Drone (4K/60fps)",
    category: "cameras",
    distance: "1.2 km away",
    hubAddress: "Sector 62, College Campus Hub",
    hourlyRate: 18,
    dailyRate: 140,
    securityDeposit: 150,
    buyPrice: 2199,
    canRent: true,
    canBuy: true,
    condition: "Grade A+ (Mint)",
    owner: "Alex Vance (Host)",
    rating: 4.9,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    description: "Flagship triple-camera drone system with Hasselblad optical color science and 43-min flight time.",
    inspectionScenarios: {
      clean: { postImage: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80", flaws: [], confidence: "99.2%", integrityScore: 100, repairCostUSD: 0 },
      scratch: { postImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80", flaws: [{ top: "35%", left: "45%", width: "18%", height: "18%", label: "Minor Arm Abrasion", confidence: "94.8%", severity: "Minor", costUSD: 25 }], confidence: "95.4%", integrityScore: 92, repairCostUSD: 25 },
      severe: { postImage: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80", flaws: [{ top: "25%", left: "30%", width: "22%", height: "24%", label: "Gimbal Misalignment", confidence: "98.1%", severity: "High", costUSD: 90 }], confidence: "97.8%", integrityScore: 68, repairCostUSD: 120 }
    }
  },
  {
    id: "item-2",
    title: "Sony Alpha A7 IV Full-Frame Camera + 24-70mm GM Lens",
    category: "cameras",
    distance: "2.4 km away",
    hubAddress: "Media Studio Block, Sector 60",
    hourlyRate: 22,
    dailyRate: 170,
    securityDeposit: 200,
    buyPrice: 2499,
    canRent: true,
    canBuy: true,
    condition: "Grade A+ (Mint)",
    owner: "Creative Lens Hub",
    rating: 5.0,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    description: "33MP full-frame hybrid camera with 4K 60p 10-bit recording and high-speed autofocus.",
    inspectionScenarios: {
      clean: { postImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", flaws: [], confidence: "99.5%", integrityScore: 100, repairCostUSD: 0 },
      scratch: { postImage: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80", flaws: [{ top: "40%", left: "50%", width: "20%", height: "20%", label: "Body Paint Scratch", confidence: "92.1%", severity: "Minor", costUSD: 30 }], confidence: "94.2%", integrityScore: 90, repairCostUSD: 30 },
      severe: { postImage: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80", flaws: [{ top: "30%", left: "40%", width: "25%", height: "28%", label: "Front Glass Micro-Crack", confidence: "98.9%", severity: "Severe", costUSD: 160 }], confidence: "98.9%", integrityScore: 60, repairCostUSD: 160 }
    }
  },
  {
    id: "item-3",
    title: "DeWalt 20V Max XR Brushless Power Drill & Impact Combo",
    category: "tools",
    distance: "0.8 km away",
    hubAddress: "DIY Workshop, Campus Gate #3",
    hourlyRate: 7,
    dailyRate: 45,
    securityDeposit: 60,
    buyPrice: 279,
    canRent: true,
    canBuy: true,
    condition: "Grade A (Excellent)",
    owner: "Metro ToolShare",
    rating: 4.8,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    description: "Heavy-duty cordless drill kit with 2x 4.0Ah batteries, fast charger, and contractor carry case.",
    inspectionScenarios: {
      clean: { postImage: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80", flaws: [], confidence: "98.9%", integrityScore: 100, repairCostUSD: 0 },
      scratch: { postImage: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80", flaws: [{ top: "60%", left: "30%", width: "15%", height: "15%", label: "Chuck Grip Wear", confidence: "89.5%", severity: "Minor", costUSD: 15 }], confidence: "91.0%", integrityScore: 94, repairCostUSD: 15 },
      severe: { postImage: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80", flaws: [{ top: "50%", left: "45%", width: "25%", height: "25%", label: "Battery Casing Crack", confidence: "97.4%", severity: "High", costUSD: 50 }], confidence: "97.4%", integrityScore: 55, repairCostUSD: 50 }
    }
  },
  {
    id: "item-4",
    title: "Apple MacBook Pro 16\" M3 Max (64GB RAM, 1TB SSD)",
    category: "tech",
    distance: "3.1 km away",
    hubAddress: "Tech Park Avenue, Tower B",
    hourlyRate: 32,
    dailyRate: 230,
    securityDeposit: 350,
    buyPrice: 3499,
    canRent: true,
    canBuy: true,
    condition: "Grade A+ (Mint)",
    owner: "Silicon Rentals",
    rating: 4.95,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    description: "Ultimate workstation for 8K video editing, 3D rendering, and machine learning model training.",
    inspectionScenarios: {
      clean: { postImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", flaws: [], confidence: "99.8%", integrityScore: 100, repairCostUSD: 0 },
      scratch: { postImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", flaws: [{ top: "20%", left: "70%", width: "12%", height: "12%", label: "Aluminum Edge Dent", confidence: "93.6%", severity: "Minor", costUSD: 40 }], confidence: "95.0%", integrityScore: 92, repairCostUSD: 40 },
      severe: { postImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", flaws: [{ top: "35%", left: "40%", width: "30%", height: "25%", label: "Display Scratch", confidence: "99.1%", severity: "Severe", costUSD: 250 }], confidence: "99.1%", integrityScore: 65, repairCostUSD: 250 }
    }
  }
];

let catalogData = [...initialCatalog];
let currentFilter = { mode: 'all', category: 'all', search: '', sort: 'featured' };
let globalFulfillmentPreference = 'self'; // 'self' or 'porter'

let currentCheckoutItem = null;
let currentCheckoutHours = 4;
let currentCheckoutMode = 'rent';
let currentFulfillmentMode = 'self';

let inspectorItem = catalogData[0];
let inspectorScenario = 'clean';

let activeBookings = [
  {
    id: "RS-BK-9801",
    item: catalogData[0],
    renter: "Sahil Sharma (KYC Verified ✓)",
    fulfillment: "Self Pickup (Sector 62 Hub)",
    hours: 6,
    hourlyRateUSD: 18,
    baseRentUSD: 108,
    depositUSD: 150,
    depositFeeUSD: 7.50,
    damageDeductionUSD: 0,
    refundExpectedUSD: 142.50,
    platformFeeUSD: 19.44,
    porterFeeUSD: 0,
    totalPaidUSD: 277.44,
    depositStatus: "In Escrow Vault",
    timeRemaining: "3h 42m remaining",
    date: "Today, 10:15 AM",
    txnHash: "UPI-9823-7419-ESCR",
    statusBadge: "bg-amber-100 text-amber-800 border-amber-300"
  }
];

// ==========================================
// 2. CURRENCY FORMATTER
// ==========================================
function formatPrice(amountUSD) {
  const curr = currencies[activeCurrency] || currencies.INR;
  const converted = amountUSD * curr.rate;

  if (activeCurrency === 'JPY') {
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
  } else if (activeCurrency === 'INR') {
    return `${curr.symbol}${converted.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  } else {
    return `${curr.symbol}${converted.toFixed(2)}`;
  }
}

function handleCurrencyChange(newCurrency) {
  activeCurrency = newCurrency;
  localStorage.setItem('borex_currency', newCurrency);

  const select = document.getElementById('global-currency-select');
  if (select) select.value = newCurrency;

  renderCatalog();
  if (currentCheckoutItem) calculateCheckoutBreakdown();
  updateVerdictDisplay(inspectorItem.inspectionScenarios[inspectorScenario], false);
  lookupEscrowFund();

  if (!document.getElementById('view-bookings').classList.contains('hidden')) {
    renderBookings();
  }

  showToast(`🌍 Currency set to ${currencies[newCurrency].name} (${currencies[newCurrency].symbol})`);
  lucide.createIcons();
}

// ==========================================
// 3. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const currSelect = document.getElementById('global-currency-select');
  if (currSelect) currSelect.value = activeCurrency;

  updateUserHeaderUI();
  renderCatalog();
  populateInspectorItemDropdown();
  lookupEscrowFund();
});

// ==========================================
// 4. SIDEBAR DRAWER TOGGLE (THREE-DOT MENU)
// ==========================================
let isSidebarOpen = false;

function toggleSidebar() {
  const drawer = document.getElementById('sidebar-drawer');
  const overlay = document.getElementById('sidebar-overlay');
  if (!drawer || !overlay) return;

  isSidebarOpen = !isSidebarOpen;
  if (isSidebarOpen) {
    drawer.classList.remove('pointer-events-none');
    drawer.classList.add('sidebar-open');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
  } else {
    drawer.classList.remove('sidebar-open');
    drawer.classList.add('pointer-events-none');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
  }
  lucide.createIcons();
}

// ==========================================
// 5. USER AUTH & KYC LOGIN
// ==========================================
function openKYCModal() {
  const modal = document.getElementById('modal-kyc');
  if (!modal) return;
  goToKYCStep(1);
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeKYCModal() {
  const modal = document.getElementById('modal-kyc');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function goToKYCStep(step) {
  [1, 2, 3].forEach(s => {
    const view = document.getElementById(`kyc-view-step-${s}`);
    if (view) view.classList.add('hidden');
  });
  const activeView = document.getElementById(`kyc-view-step-${step}`);
  if (activeView) activeView.classList.remove('hidden');
  lucide.createIcons();
}

function handleKYCIDUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const label = document.getElementById('kyc-id-file-label');
  if (label) label.innerHTML = `✓ Uploaded: <span class="text-[#0284C7] font-bold">${file.name}</span>`;
  showToast(`📄 ID loaded (${file.name}).`);
}

function handleKYCAddressUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const label = document.getElementById('kyc-addr-file-label');
  if (label) label.innerHTML = `✓ Uploaded: <span class="text-[#0284C7] font-bold">${file.name}</span>`;
  showToast(`🏠 Address proof loaded (${file.name}).`);
}

function submitKYCVerification() {
  const name = document.getElementById('kyc-name').value || "Sahil Sharma";
  const email = document.getElementById('kyc-email').value || "sahil@example.com";

  userProfile.name = name;
  userProfile.email = email;
  userProfile.isLoggedIn = true;
  userProfile.isKYCVerified = true;
  userProfile.verificationId = "KYC-" + Math.floor(100000 + Math.random() * 900000);

  updateUserHeaderUI();
  closeKYCModal();
  showToast(`🎉 Welcome ${name}! KYC Verified. Listing option unlocked at top.`);
}

function updateUserHeaderUI() {
  const userBtnText = document.getElementById('header-user-btn-text');
  const userBtn = document.getElementById('header-user-btn');
  const listBtn = document.getElementById('header-list-btn');

  if (userProfile.isLoggedIn && userProfile.isKYCVerified) {
    if (userBtnText) userBtnText.textContent = `${userProfile.name.split(' ')[0]} ✓`;
    if (userBtn) {
      userBtn.className = "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/40 shadow-xs";
    }
    // Show List Item Button at top after login
    if (listBtn) {
      listBtn.classList.remove('hidden');
      listBtn.classList.add('flex');
    }
  } else {
    if (userBtnText) userBtnText.textContent = "Login / Sign Up";
    if (userBtn) {
      userBtn.className = "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm transition-all";
    }
    if (listBtn) {
      listBtn.classList.add('hidden');
      listBtn.classList.remove('flex');
    }
  }
  lucide.createIcons();
}

// ==========================================
// 6. GLOBAL FULFILLMENT PREFERENCE
// ==========================================
function setGlobalFulfillmentPreference(mode) {
  globalFulfillmentPreference = mode;
  const selfBtn = document.getElementById('pref-btn-self');
  const porterBtn = document.getElementById('pref-btn-porter');

  if (mode === 'self') {
    if (selfBtn) {
      selfBtn.className = "flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#0284C7] bg-[#E0F2FE] text-[#0284C7]";
    }
    if (porterBtn) {
      porterBtn.className = "flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#E0D3B0] bg-white text-[#57534E]";
    }
    showToast("🚶‍♂️ Self Pickup selected: Collect in person from owner's hub (FREE).");
  } else {
    if (selfBtn) {
      selfBtn.className = "flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#E0D3B0] bg-white text-[#57534E]";
    }
    if (porterBtn) {
      porterBtn.className = "flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 border-amber-600 bg-amber-50 text-amber-800";
    }
    showToast("🚚 Porter Courier selected: Delivery fare calculated separately at checkout.");
  }
}

// ==========================================
// 7. CATEGORIES FIRST & CATALOG RENDERING
// ==========================================
function setCategoryFilter(cat) {
  currentFilter.category = cat;
  document.querySelectorAll('.category-card').forEach(btn => {
    btn.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  renderCatalog();
}

function setFilterMode(mode) {
  currentFilter.mode = mode;
  ['all', 'rent', 'buy'].forEach(m => {
    const btn = document.getElementById(`mode-${m}`);
    if (btn) {
      if (m === mode) {
        btn.className = "px-2.5 py-1 rounded-lg font-bold bg-[#0284C7] text-white";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg font-bold text-[#57534E]";
      }
    }
  });
  renderCatalog();
}

function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  const emptyState = document.getElementById("catalog-empty");
  if (!grid) return;

  let filtered = catalogData.filter(item => {
    if (currentFilter.mode === 'rent' && !item.canRent) return false;
    if (currentFilter.mode === 'buy' && !item.canBuy) return false;
    if (currentFilter.category !== 'all' && item.category !== currentFilter.category) return false;
    if (currentFilter.search) {
      const q = currentFilter.search.toLowerCase();
      const match = item.title.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  grid.innerHTML = filtered.map(item => `
    <div class="borex-card rounded-2xl overflow-hidden flex flex-col justify-between p-3 relative group">
      
      <!-- Distance Badge -->
      <div class="absolute top-4 left-4 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FBF3DD] border border-[#E0D3B0] text-[10px] font-black text-[#1E232A]">
        <i data-lucide="map-pin" class="w-3 h-3 text-[#0284C7]"></i>
        <span>${item.distance}</span>
      </div>

      <!-- Image -->
      <div class="relative h-36 sm:h-40 w-full rounded-xl overflow-hidden bg-[#FBF3DD] flex items-center justify-center p-2 mb-2">
        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-contain group-hover:scale-105 transition-all duration-300">
        <div class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C7D2E8] border border-[#AEC0E2] text-[#1E232A]">
          ${item.condition}
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-1 flex-grow">
        <h3 class="font-bold text-xs sm:text-sm text-[#1E232A] line-clamp-2 leading-snug">
          ${item.title}
        </h3>
        <div class="text-[10px] text-[#57534E]">
          📍 ${item.hubAddress}
        </div>
        <div class="text-[10px] text-[#0284C7] font-bold">
          Deposit: ${formatPrice(item.securityDeposit)} (95% refund in 24-48h)
        </div>
      </div>

      <!-- Action Button -->
      <div class="pt-2.5 mt-2 border-t border-[#E0D3B0] flex items-center justify-between gap-2">
        <div>
          <div class="text-[10px] text-[#57534E] leading-none">Hourly Rent</div>
          <div class="text-sm font-black text-[#1E232A] font-mono leading-tight">
            ${formatPrice(item.hourlyRate)}<span class="text-[10px] font-normal text-[#57534E]">/hr</span>
          </div>
        </div>

        <button onclick="openCheckoutModal('${item.id}', 'rent')" class="btn-borex-blue px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 uppercase">
          <span>+ RENT</span>
        </button>
      </div>

    </div>
  `).join('');

  lucide.createIcons();
}

function handleSearch(val) {
  currentFilter.search = val;
  renderCatalog();
}

function resetFilters() {
  currentFilter = { mode: 'all', category: 'all', search: '', sort: 'featured' };
  document.querySelectorAll('.category-card').forEach((c, idx) => {
    if (idx === 0) c.classList.add('active');
    else c.classList.remove('active');
  });
  renderCatalog();
}

// ==========================================
// 8. VIEW SWITCHING
// ==========================================
function switchView(viewName) {
  document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
  const sec = document.getElementById(`view-${viewName}`);
  if (sec) sec.classList.remove('hidden');

  if (viewName === 'bookings') renderBookings();
  if (viewName === 'funds') lookupEscrowFund();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  lucide.createIcons();
}

// ==========================================
// 9. CHECKOUT WITH SELF PICKUP VS PORTER
// ==========================================
function openCheckoutModal(itemId, mode = 'rent') {
  const item = catalogData.find(i => i.id === itemId);
  if (!item) return;

  currentCheckoutItem = item;
  currentCheckoutMode = mode;
  currentCheckoutHours = 4;
  currentFulfillmentMode = globalFulfillmentPreference;

  const modal = document.getElementById('modal-checkout');
  document.getElementById('checkout-item-img').src = item.image;
  document.getElementById('checkout-item-title').textContent = item.title;
  document.getElementById('checkout-item-hub').textContent = `${item.hubAddress} (${item.distance})`;
  document.getElementById('checkout-hourly-rate').textContent = `${formatPrice(item.hourlyRate)}/hr`;

  document.getElementById('duration-slider').value = 4;
  document.getElementById('duration-display').textContent = "4 Hours";

  setFulfillmentMode(currentFulfillmentMode);
  calculateCheckoutBreakdown();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCheckoutModal() {
  const modal = document.getElementById('modal-checkout');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function handleDurationChange(val) {
  currentCheckoutHours = parseInt(val);
  document.getElementById('duration-display').textContent = `${currentCheckoutHours} Hours`;
  calculateCheckoutBreakdown();
}

function setFulfillmentMode(mode) {
  currentFulfillmentMode = mode;
  const selfBtn = document.getElementById('fulfill-btn-self');
  const porterBtn = document.getElementById('fulfill-btn-porter');

  if (mode === 'self') {
    if (selfBtn) selfBtn.className = "fulfill-option-btn active p-2.5 rounded-xl border-2 border-[#0284C7] bg-[#E0F2FE] text-left";
    if (porterBtn) porterBtn.className = "fulfill-option-btn p-2.5 rounded-xl border-2 border-[#E0D3B0] bg-white text-left";
  } else {
    if (selfBtn) selfBtn.className = "fulfill-option-btn p-2.5 rounded-xl border-2 border-[#E0D3B0] bg-white text-left";
    if (porterBtn) porterBtn.className = "fulfill-option-btn active p-2.5 rounded-xl border-2 border-amber-600 bg-amber-50 text-left";
  }

  calculateCheckoutBreakdown();
}

function calculateCheckoutBreakdown() {
  if (!currentCheckoutItem) return;
  const item = currentCheckoutItem;

  const baseRentUSD = item.hourlyRate * currentCheckoutHours;
  const depositUSD = item.securityDeposit;
  const depositFeeUSD = depositUSD * depositProcessingFeeRate;
  const netDepositRefundUSD = depositUSD - depositFeeUSD;
  const porterFeeUSD = (currentFulfillmentMode === 'porter') ? defaultPorterFeeUSD : 0;
  const totalPayableUSD = baseRentUSD + depositUSD + porterFeeUSD;

  document.getElementById('calc-hours-txt').textContent = `${currentCheckoutHours}`;
  document.getElementById('calc-base-rent').textContent = formatPrice(baseRentUSD);
  document.getElementById('calc-deposit').textContent = formatPrice(depositUSD);
  document.getElementById('calc-deposit-net-refund').textContent = `${formatPrice(netDepositRefundUSD)} (95%)`;

  const fulfillCost = document.getElementById('calc-fulfill-cost');
  if (currentFulfillmentMode === 'self') {
    fulfillCost.textContent = "FREE (Self Pickup)";
    fulfillCost.className = "font-mono text-[#0284C7]";
  } else {
    fulfillCost.textContent = `+${formatPrice(defaultPorterFeeUSD)} (Porter Fare)`;
    fulfillCost.className = "font-mono text-amber-700 font-bold";
  }

  document.getElementById('calc-total-pay').textContent = formatPrice(totalPayableUSD);
}

function processRentalBooking() {
  if (!currentCheckoutItem) return;
  const item = currentCheckoutItem;

  const baseRentUSD = item.hourlyRate * currentCheckoutHours;
  const depositUSD = item.securityDeposit;
  const depositFeeUSD = depositUSD * depositProcessingFeeRate;
  const netRefundUSD = depositUSD - depositFeeUSD;
  const porterFeeUSD = (currentFulfillmentMode === 'porter') ? defaultPorterFeeUSD : 0;
  const totalUSD = baseRentUSD + depositUSD + porterFeeUSD;

  const bookingId = "RS-BK-" + Math.floor(1000 + Math.random() * 9000);
  const fulfillmentText = (currentFulfillmentMode === 'porter') ? `Porter Courier Delivery (+${formatPrice(defaultPorterFeeUSD)})` : `Self Pickup (${item.hubAddress})`;

  activeBookings.unshift({
    id: bookingId,
    item: item,
    renter: `${userProfile.name} (KYC Verified ✓)`,
    fulfillment: fulfillmentText,
    hours: currentCheckoutHours,
    hourlyRateUSD: item.hourlyRate,
    baseRentUSD: baseRentUSD,
    depositUSD: depositUSD,
    depositFeeUSD: depositFeeUSD,
    damageDeductionUSD: 0,
    refundExpectedUSD: netRefundUSD,
    platformFeeUSD: baseRentUSD * platformCommissionRate,
    porterFeeUSD: porterFeeUSD,
    totalPaidUSD: totalUSD,
    depositStatus: "In Escrow Vault",
    timeRemaining: `${currentCheckoutHours} Hours Left`,
    date: "Just Now",
    txnHash: "UPI-" + Math.floor(1000 + Math.random() * 9000) + "-ESCR",
    statusBadge: "bg-amber-100 text-amber-800 border-amber-300"
  });

  closeCheckoutModal();
  showToast(`🎉 Rental Confirmed (${currentFulfillmentMode === 'porter' ? 'Porter Booked' : 'Self Pickup Ready'}). 95% Deposit auto-refunded in 24–48h.`);
  setTimeout(() => switchView('bookings'), 300);
}

// ==========================================
// 10. BOOKINGS VAULT
// ==========================================
function renderBookings() {
  const container = document.getElementById('bookings-list');
  if (!container) return;

  if (activeBookings.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-xs text-[#57534E]">No active bookings. Browse items to rent.</div>`;
    return;
  }

  container.innerHTML = activeBookings.map(b => `
    <div class="p-3.5 bg-[#FBF3DD] rounded-2xl border border-[#E0D3B0] space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <img src="${b.item.image}" class="w-10 h-10 rounded-lg object-cover border border-[#E0D3B0]">
          <div>
            <div class="font-bold text-xs">${b.item.title}</div>
            <div class="text-[10px] text-[#57534E]">${b.fulfillment}</div>
          </div>
        </div>
        <div class="font-mono font-bold text-xs">${formatPrice(b.totalPaidUSD)}</div>
      </div>
      <div class="flex items-center justify-between text-[11px] pt-1 border-t border-[#E0D3B0]">
        <span>95% Refund in 24–48h: <strong class="text-[#0284C7]">${formatPrice(b.refundExpectedUSD)}</strong></span>
        <button onclick="switchView('inspector')" class="px-2.5 py-1 bg-[#0284C7] text-white rounded-lg font-bold text-[10px]">Return Audit</button>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

// ==========================================
// 11. ESCROW FUND CHECKER & AI INSPECTOR
// ==========================================
function lookupEscrowFund() {
  const resultCard = document.getElementById('fund-result-card');
  if (!resultCard) return;
  const booking = activeBookings[0];

  resultCard.innerHTML = `
    <div class="space-y-2 text-xs">
      <div class="flex justify-between font-bold">
        <span>${booking.id} (${booking.item.title})</span>
        <span class="text-[#0284C7]">${formatPrice(booking.depositUSD)} in Escrow</span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
        <div>5% Escrow Fee: <strong>-${formatPrice(booking.depositFeeUSD)}</strong></div>
        <div>Net Refund (24–48h): <strong class="text-[#0284C7]">${formatPrice(booking.refundExpectedUSD)}</strong></div>
      </div>
    </div>
  `;
}

function populateInspectorItemDropdown() {
  const select = document.getElementById('inspector-item-select');
  if (!select) return;
  select.innerHTML = catalogData.map(item => `<option value="${item.id}">${item.title}</option>`).join('');
  inspectorItem = catalogData[0];
  loadInspectionScenario('clean');
}

function handleInspectorItemChange(itemId) {
  const item = catalogData.find(i => i.id === itemId);
  if (!item) return;
  inspectorItem = item;
  document.getElementById('inspector-pre-img').src = item.image;
  loadInspectionScenario(inspectorScenario);
}

function loadInspectionScenario(scenarioKey) {
  inspectorScenario = scenarioKey;
  if (!inspectorItem.inspectionScenarios || !inspectorItem.inspectionScenarios[scenarioKey]) return;
  const scenarioData = inspectorItem.inspectionScenarios[scenarioKey];
  document.getElementById('inspector-post-img').src = scenarioData.postImage;
  updateVerdictDisplay(scenarioData, false);
}

function startAIScanAnimation() {
  const laser = document.getElementById('scanner-laser');
  laser.classList.remove('hidden');
  laser.classList.add('animate-laser');
  setTimeout(() => {
    laser.classList.add('hidden');
    laser.classList.remove('animate-laser');
    updateVerdictDisplay(inspectorItem.inspectionScenarios[inspectorScenario], true);
    showToast("✓ AI Damage Scan Complete. 95% Deposit scheduled for 24–48h auto-refund.");
  }, 1500);
}

function updateVerdictDisplay(data, isLiveScan = true) {
  const depositUSD = inspectorItem.securityDeposit;
  const depositFeeUSD = depositUSD * depositProcessingFeeRate;
  const damageDeductionUSD = data.repairCostUSD;
  const netRefundUSD = Math.max(0, depositUSD - depositFeeUSD - damageDeductionUSD);

  document.getElementById('verdict-deposit-display').textContent = formatPrice(depositUSD);
  document.getElementById('verdict-deposit-fee').textContent = `-${formatPrice(depositFeeUSD)}`;
  document.getElementById('verdict-deduction').textContent = `-${formatPrice(damageDeductionUSD)}`;
  document.getElementById('verdict-refund').textContent = formatPrice(netRefundUSD);
  document.getElementById('verdict-owner-payout').textContent = formatPrice(inspectorItem.hourlyRate * 4 * 0.82);
}

// ==========================================
// 12. OWNER LISTING MODAL
// ==========================================
function openListingModal() {
  const modal = document.getElementById('modal-listing');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeListingModal() {
  const modal = document.getElementById('modal-listing');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function handleNewItemSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('new-item-title').value;
  const category = document.getElementById('new-item-category').value;
  const hubAddress = document.getElementById('new-item-hub').value || "Sector 62 Hub";
  const hourly = parseFloat(document.getElementById('new-item-hourly').value);
  const deposit = parseFloat(document.getElementById('new-item-deposit').value);

  const rate = currencies[activeCurrency].rate;
  const newItem = {
    id: "item-" + (catalogData.length + 1),
    title: title,
    category: category,
    distance: "1.0 km away",
    hubAddress: hubAddress,
    hourlyRate: hourly / rate,
    dailyRate: (hourly * 7) / rate,
    securityDeposit: deposit / rate,
    buyPrice: (deposit * 5) / rate,
    canRent: true,
    canBuy: true,
    condition: "Grade A+ (Mint)",
    owner: `${userProfile.name} (Host)`,
    rating: 5.0,
    reviewsCount: 1,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    description: "Listed by host. Self pickup & Porter available.",
    inspectionScenarios: { clean: { postImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", flaws: [], confidence: "99.0%", integrityScore: 100, repairCostUSD: 0 } }
  };

  catalogData.unshift(newItem);
  renderCatalog();
  populateInspectorItemDropdown();
  closeListingModal();
  showToast(`🎉 Listing published! "${title}" is now active on Borex.`);
}

// ==========================================
// 13. CHATBOT & TOASTS
// ==========================================
let isChatbotOpen = false;

function toggleChatbot() {
  const windowEl = document.getElementById('chat-window');
  isChatbotOpen = !isChatbotOpen;
  if (isChatbotOpen) windowEl.classList.remove('hidden'), windowEl.classList.add('flex');
  else windowEl.classList.add('hidden'), windowEl.classList.remove('flex');
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const msgContainer = document.getElementById('chat-messages');
  if (!input || !msgContainer) return;
  const text = input.value.trim();
  if (!text) return;

  msgContainer.innerHTML += `<div class="chat-bubble-user p-2.5 rounded-xl ml-auto max-w-[80%]">${text}</div>`;
  input.value = "";
  msgContainer.scrollTop = msgContainer.scrollHeight;

  setTimeout(() => {
    msgContainer.innerHTML += `<div class="chat-bubble-bot p-2.5 rounded-xl max-w-[80%]">Self Pickup is FREE directly from the owner, or you can book Porter delivery at checkout! 95% of your deposit is refunded automatically in 24–48h.</div>`;
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 500);
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 3000);
}
