/* ================================================================
   Plant Gallery — Interactive Gallery Logic
   ================================================================ */

// DOM References
const plantGrid = document.getElementById('plantGrid');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const navbar = document.getElementById('mainNavbar');

// Modal Elements
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDescription');
const modalImage = document.getElementById('modalImage');
const modalCat = document.getElementById('modalCategory');
const modalLight = document.getElementById('modalLight');
const modalWater = document.getElementById('modalWater');
const modalTemp = document.getElementById('modalTemp');
const modalToxic = document.getElementById('modalToxic');
const modalWiki = document.getElementById('modalWiki');

let plantModal;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap Modal
    const modalElement = document.getElementById('plantModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
        plantModal = new bootstrap.Modal(modalElement);
    }

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.style.background = window.scrollY > 50
                ? 'rgba(255,255,255,0.97)'
                : 'rgba(255,255,255,0.85)';
        }
    });
});

// Search and Filter Logic
let activeCategory = 'all';

function filterPlants() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const allCards = plantGrid ? plantGrid.querySelectorAll('.plant-card-item') : [];
    let hasResults = false;

    allCards.forEach(card => {
        const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
        const category = card.dataset.category ? card.dataset.category.toLowerCase() : '';

        const matchesQuery = name.includes(query) || category.includes(query);
        
        let matchesCategory = false;
        if (activeCategory === 'all') {
            matchesCategory = true;
        } else {
            matchesCategory = category.includes(activeCategory.toLowerCase());
        }

        if (matchesQuery && matchesCategory) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    if (noResults) {
        noResults.classList.toggle('d-none', hasResults);
    }
}

// Search Input Listener
if (searchInput) {
    searchInput.addEventListener('input', filterPlants);
}

// Category Filter Listeners
const filterBtns = document.querySelectorAll('.btn-filter');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update UI
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update Logic
        activeCategory = btn.dataset.category;
        filterPlants();
    });
});

/**
 * Opens the plant details modal and populates it with data from the clicked card.
 * @param {HTMLElement} element - The .plant-card-item element containing plant data attributes.
 */
window.openModal = (element) => {
    if (!element) return;

    const data = element.dataset;
    const imgTag = element.querySelector('img.plant-img');
    const anchorTag = element.querySelector('a.plant-url-ref');

    // Populate Modal Content
    if (modalTitle) modalTitle.textContent = data.name || 'Plant Details';
    if (modalCat) modalCat.textContent = data.category || 'Indoor Plant';
    if (modalDesc) modalDesc.textContent = data.description || '';

    if (modalImage) {
        // Prefer explicit anchor href if available (high-res), fallback to img src
        modalImage.src = (anchorTag && anchorTag.href) ? anchorTag.href : (imgTag ? imgTag.src : '');
        modalImage.onerror = () => { modalImage.src = 'logo.png'; };
    }

    if (modalLight) modalLight.textContent = data.light || 'N/A';
    if (modalWater) modalWater.textContent = data.water || 'N/A';
    if (modalTemp) modalTemp.textContent = data.temp || 'N/A';
    if (modalToxic) modalToxic.textContent = data.toxic || 'Non-toxic';
    if (modalWiki) modalWiki.href = data.wiki || '#';

    // Show the modal
    if (plantModal) {
        plantModal.show();
    } else {
        // Fallback initialization if something went wrong
        const modalElement = document.getElementById('plantModal');
        if (modalElement && typeof bootstrap !== 'undefined') {
            plantModal = new bootstrap.Modal(modalElement);
            plantModal.show();
        }
    }
};
