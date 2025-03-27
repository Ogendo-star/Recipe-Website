// Global state and configuration
const APP_STATE = {
    recipes: [],
    filteredRecipes: [],
    categories: ['breakfast', 'lunch', 'dinner', 'sweet-treats']
};

const API_CONFIG = {
    baseUrl: 'https://www.themealdb.com/api/json/v1/1',
    endpoints: {
        searchMeals: '/search.php?s=',
        filterByCategory: '/filter.php?c='
    }
};

const utils = {
    
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            this.displayErrorMessage('Unable to fetch recipes. Please try again.');
            return null;
        }
    },

   
    displayErrorMessage(message) {
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        errorContainer.textContent = message;
        document.getElementById('content').prepend(errorContainer);
    },

    
    sanitizeRecipeData(rawData) {
        return rawData.map(recipe => ({
            id: recipe.idMeal,
            name: recipe.strMeal,
            category: recipe.strCategory,
            thumbnail: recipe.strMealThumb,
            instructions: recipe.strInstructions
        }));
    }
};


const recipeManager = {
    
    async initializeRecipes() {
        const data = await utils.fetchData(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.searchMeals}chicken`);
        if (data && data.meals) {
            APP_STATE.recipes = utils.sanitizeRecipeData(data.meals);
            this.renderRecipes(APP_STATE.recipes);
        }
    },


    renderRecipes(recipes) {
        const recipesContainer = document.getElementById('recipes-container');
        recipesContainer.innerHTML = ''; 

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.thumbnail}" alt="${recipe.name}" class="recipe-img">
                <h3>${recipe.name}</h3>
                <p>Category: ${recipe.category}</p>
                <button class="view-recipe" data-id="${recipe.id}">View Recipe</button>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    },

    filterRecipesByCategory(category) {
        const filtered = APP_STATE.recipes.filter(recipe => 
            recipe.category.toLowerCase() === category.toLowerCase()
        );
        this.renderRecipes(filtered);
    }
};


const eventListeners = {
    
    initSearchListener() {
        const searchInput = document.getElementById('recipe-search');
        const searchBtn = document.getElementById('search-btn');

        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            this.performSearch(searchTerm);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                this.performSearch(searchTerm);
            }
        });
    },

    
    async performSearch(searchTerm) {
        if (!searchTerm) return;

        const data = await utils.fetchData(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.searchMeals}${searchTerm}`);
        if (data && data.meals) {
            const searchResults = utils.sanitizeRecipeData(data.meals);
            recipeManager.renderRecipes(searchResults);
        } else {
            utils.displayErrorMessage('No recipes found.');
        }
    },

    
    initCategoryListeners() {
        const categoryLinks = document.querySelectorAll('[data-category]');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                recipeManager.filterRecipesByCategory(category);
            });
        });
    },

    
    initSpecialtyFilters() {
        const seasonalBtn = document.getElementById('filter-seasonal');
        const quickMealsBtn = document.getElementById('filter-quick');

        seasonalBtn.addEventListener('click', () => {
            
            const seasonalRecipes = APP_STATE.recipes.filter(recipe => 
                recipe.name.toLowerCase().includes('seasonal')
            );
            recipeManager.renderRecipes(seasonalRecipes);
        });

        quickMealsBtn.addEventListener('click', () => {
            const quickRecipes = APP_STATE.recipes.filter(recipe => 
                recipe.name.length < 20 // 
            );
            recipeManager.renderRecipes(quickRecipes);
        });
    },

    
    initSocialMediaTracking() {
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platformId = e.currentTarget.id;
                console.log(`Social media link clicked: ${platformId}`);
                
            });
        });
    },

    init() {
        this.initSearchListener();
        this.initCategoryListeners();
        this.initSpecialtyFilters();
        this.initSocialMediaTracking();
    }
};

async function initializeApp() {
    await recipeManager.initializeRecipes();
    eventListeners.init();
}


document.addEventListener('DOMContentLoaded', initializeApp);