// Plant Finder App

class PlantFinder {
    constructor() {
        this.plants = [];
        this.filters = {};
        this.categories = {};
        this.activeFilters = {
            climate: [],
            light: [],
            soil: [],
            traits: [],
            search: '',
            category: '',
            careLevel: ''
        };
        
        this.init();
    }
    
    async init() {
        try {
            const response = await fetch('data/plants.json');
            const data = await response.json();
            this.plants = data.plants;
            this.filters = data.filters;
            this.categories = data.categories;
            
            this.renderFilters();
            this.renderCategorySelect();
            this.renderPlants();
            this.bindEvents();
        } catch (error) {
            console.error('Failed to load plant data:', error);
        }
    }
    
    renderFilters() {
        // Climate filters
        const climateContainer = document.getElementById('climate-filters');
        climateContainer.innerHTML = this.filters.climate.map(filter => 
            `<button class="filter-chip" data-type="climate" data-value="${filter.id}">
                <span class="chip-icon">${filter.icon}</span>
                <span>${filter.name}</span>
            </button>`
        ).join('');
        
        // Light filters
        const lightContainer = document.getElementById('light-filters');
        lightContainer.innerHTML = this.filters.light.map(filter => 
            `<button class="filter-chip" data-type="light" data-value="${filter.id}">
                <span class="chip-icon">${filter.icon}</span>
                <span>${filter.name}</span>
            </button>`
        ).join('');
        
        // Soil filters
        const soilContainer = document.getElementById('soil-filters');
        soilContainer.innerHTML = this.filters.soil.map(filter => 
            `<button class="filter-chip" data-type="soil" data-value="${filter.id}">
                <span class="chip-icon">${filter.icon}</span>
                <span>${filter.name}</span>
            </button>`
        ).join('');
        
        // Traits filters
        const traitsContainer = document.getElementById('traits-filters');
        traitsContainer.innerHTML = this.filters.traits.map(filter => 
            `<button class="filter-chip" data-type="traits" data-value="${filter.id}">
                <span class="chip-icon">${filter.icon}</span>
                <span>${filter.name}</span>
            </button>`
        ).join('');
    }
    
    renderCategorySelect() {
        const select = document.getElementById('categorySelect');
        const options = Object.entries(this.categories).map(([id, cat]) => 
            `<option value="${id}">${cat.icon} ${cat.name}</option>`
        ).join('');
        select.innerHTML = '<option value="">All Categories</option>' + options;
    }
    
    getCareIcon(level) {
        const icons = {
            easy: '🌿',
            medium: '🌱',
            hard: '🌵'
        };
        return icons[level] || '🌿';
    }
    
    getCareLabel(level) {
        const labels = {
            easy: 'Easy Care',
            medium: 'Moderate Care',
            hard: 'Expert Care'
        };
        return labels[level] || 'Unknown';
    }
    
    renderPlants() {
        const filtered = this.getFilteredPlants();
        const grid = document.getElementById('plantsGrid');
        const noResults = document.getElementById('noResults');
        const resultsCount = document.getElementById('resultsCount');
        const resultsTitle = document.getElementById('resultsTitle');
        
        // Update count
        resultsCount.textContent = `${filtered.length} plant${filtered.length !== 1 ? 's' : ''}`;
        
        // Update title based on active filters
        const activeCount = this.activeFilters.climate.length + 
                           this.activeFilters.light.length + 
                           this.activeFilters.soil.length + 
                           this.activeFilters.traits.length;
        
        if (activeCount > 0 || this.activeFilters.search || this.activeFilters.category || this.activeFilters.careLevel) {
            resultsTitle.textContent = 'Matching Plants';
        } else {
            resultsTitle.textContent = 'All Plants';
        }
        
        if (filtered.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        grid.innerHTML = filtered.map(plant => `
            <article class="plant-card" data-plant-id="${plant.id}">
                <div class="plant-card-image">
                    <img src="${plant.image}" alt="${plant.name}" loading="lazy" 
                         onerror="this.src='https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'">
                    <span class="plant-card-category">${this.categories[plant.category]?.icon || ''} ${this.categories[plant.category]?.name || plant.category}</span>
                    <span class="plant-card-care" title="${this.getCareLabel(plant.careLevel)}">${this.getCareIcon(plant.careLevel)}</span>
                </div>
                <div class="plant-card-body">
                    <h3 class="plant-card-name">${plant.name}</h3>
                    <p class="plant-card-scientific">${plant.scientificName}</p>
                    <p class="plant-card-desc">${plant.description}</p>
                    <div class="plant-card-tags">
                        ${plant.light.slice(0, 2).map(l => `<span class="plant-tag">${l}</span>`).join('')}
                        ${plant.traits.slice(0, 1).map(t => `<span class="plant-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
    }
    
    getFilteredPlants() {
        return this.plants.filter(plant => {
            // Climate filter
            if (this.activeFilters.climate.length > 0) {
                if (!this.activeFilters.climate.some(c => plant.climate.includes(c))) {
                    return false;
                }
            }
            
            // Light filter
            if (this.activeFilters.light.length > 0) {
                if (!this.activeFilters.light.some(l => plant.light.includes(l))) {
                    return false;
                }
            }
            
            // Soil filter
            if (this.activeFilters.soil.length > 0) {
                if (!this.activeFilters.soil.some(s => plant.soil.includes(s))) {
                    return false;
                }
            }
            
            // Traits filter
            if (this.activeFilters.traits.length > 0) {
                if (!this.activeFilters.traits.some(t => plant.traits.includes(t))) {
                    return false;
                }
            }
            
            // Search filter
            if (this.activeFilters.search) {
                const search = this.activeFilters.search.toLowerCase();
                const matchesName = plant.name.toLowerCase().includes(search);
                const matchesScientific = plant.scientificName.toLowerCase().includes(search);
                const matchesDesc = plant.description.toLowerCase().includes(search);
                if (!matchesName && !matchesScientific && !matchesDesc) {
                    return false;
                }
            }
            
            // Category filter
            if (this.activeFilters.category) {
                if (plant.category !== this.activeFilters.category) {
                    return false;
                }
            }
            
            // Care level filter
            if (this.activeFilters.careLevel) {
                if (plant.careLevel !== this.activeFilters.careLevel) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    bindEvents() {
        // Filter chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const type = chip.dataset.type;
                const value = chip.dataset.value;
                
                if (chip.classList.contains('active')) {
                    chip.classList.remove('active');
                    this.activeFilters[type] = this.activeFilters[type].filter(v => v !== value);
                } else {
                    chip.classList.add('active');
                    this.activeFilters[type].push(value);
                }
                
                this.renderPlants();
            });
        });
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.activeFilters.search = e.target.value;
                this.renderPlants();
            }, 300);
        });
        
        // Category select
        document.getElementById('categorySelect').addEventListener('change', (e) => {
            this.activeFilters.category = e.target.value;
            this.renderPlants();
        });
        
        // Care level select
        document.getElementById('careSelect').addEventListener('change', (e) => {
            this.activeFilters.careLevel = e.target.value;
            this.renderPlants();
        });
        
        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearAllFilters();
        });
        
        // Plant cards - open modal
        document.getElementById('plantsGrid').addEventListener('click', (e) => {
            const card = e.target.closest('.plant-card');
            if (card) {
                const plantId = parseInt(card.dataset.plantId);
                this.openPlantModal(plantId);
            }
        });
        
        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('plantModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
        
        // Escape key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    clearAllFilters() {
        this.activeFilters = {
            climate: [],
            light: [],
            soil: [],
            traits: [],
            search: '',
            category: '',
            careLevel: ''
        };
        
        // Remove active class from all chips
        document.querySelectorAll('.filter-chip.active').forEach(chip => {
            chip.classList.remove('active');
        });
        
        // Reset inputs
        document.getElementById('searchInput').value = '';
        document.getElementById('categorySelect').value = '';
        document.getElementById('careSelect').value = '';
        
        this.renderPlants();
    }
    
    openPlantModal(plantId) {
        const plant = this.plants.find(p => p.id === plantId);
        if (!plant) return;
        
        const modal = document.getElementById('plantModal');
        const content = document.getElementById('modalContent');
        
        content.innerHTML = `
            <div class="modal-image">
                <img src="${plant.image}" alt="${plant.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'">
            </div>
            <div class="modal-body">
                <div class="modal-header">
                    <h2>${plant.name}</h2>
                    <p class="modal-scientific">${plant.scientificName}</p>
                    <div class="modal-badges">
                        <span class="modal-badge">${this.categories[plant.category]?.icon || ''} ${this.categories[plant.category]?.name || plant.category}</span>
                        <span class="modal-badge">${this.getCareIcon(plant.careLevel)} ${this.getCareLabel(plant.careLevel)}</span>
                        <span class="modal-badge">💧 ${plant.waterNeeds.charAt(0).toUpperCase() + plant.waterNeeds.slice(1)} Water</span>
                    </div>
                </div>
                
                <p class="modal-description">${plant.description}</p>
                
                <div class="modal-section">
                    <h3>📊 Plant Details</h3>
                    <div class="modal-info-grid">
                        <div class="modal-info-item">
                            <div class="label">Height</div>
                            <div class="value">${plant.matureHeight}</div>
                        </div>
                        <div class="modal-info-item">
                            <div class="label">Growth Rate</div>
                            <div class="value">${plant.growthRate.charAt(0).toUpperCase() + plant.growthRate.slice(1)}</div>
                        </div>
                        <div class="modal-info-item">
                            <div class="label">Flower Color</div>
                            <div class="value">${plant.flowerColor || 'N/A'}</div>
                        </div>
                        <div class="modal-info-item">
                            <div class="label">Bloom Season</div>
                            <div class="value">${plant.bloomSeason || 'N/A'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>🌍 Ideal Conditions</h3>
                    <div class="modal-info-grid">
                        <div class="modal-info-item">
                            <div class="label">Climate</div>
                            <div class="value">${plant.climate.join(', ')}</div>
                        </div>
                        <div class="modal-info-item">
                            <div class="label">Light</div>
                            <div class="value">${plant.light.join(', ')}</div>
                        </div>
                        <div class="modal-info-item">
                            <div class="label">Soil</div>
                            <div class="value">${plant.soil.join(', ')}</div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>✨ Special Traits</h3>
                    <div class="modal-tags-list">
                        ${plant.traits.map(trait => `<span class="modal-tag">${trait}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-tips">
                    <h3>💡 Growing Tips</h3>
                    <p>${plant.tips}</p>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('plantModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new PlantFinder();
});
