const APP_STATE = {
    recipes: [],
    filteredRecipes: [],
    categories: ['breakfast', 'lunch', 'dinner', 'sweet-treats']
};

const API_CONFIG = {
    baseUrl: 'http://localhost:3000/',
    endpoints: {
        searchMeals: 'recipes?search=',
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
            utils.displayErrorMessage('Unable to fetch recipes. Please try again.');
            return null;
        }
    },

    displayErrorMessage(message) {
        const contentContainer = document.getElementById('content') || document.body;
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        errorContainer.textContent = message;
        contentContainer.prepend(errorContainer);
    },

    sanitizeRecipeData(rawData) {
        return rawData.map(recipe => ({
            id: recipe.id,
            name: recipe.name,
            category: recipe.category,
            thumbnail: recipe.thumbnail,
            steps: recipe.steps,
        }));
    }
};

const recipeManager = {
    async initializeRecipes() {
        const url = `${API_CONFIG.baseUrl}recipes`;
        const data = await utils.fetchData(url);
        
        if (data) {
            APP_STATE.recipes = utils.sanitizeRecipeData(data);
            this.renderRecipes(APP_STATE.recipes);
        }
    },

    renderRecipes(recipes) {
        const recipesContainer = document.getElementById('recipes-container');
        if (!recipesContainer) return;

        recipesContainer.innerHTML = ''; 

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.thumbnail}" alt="${recipe.name}" class="recipe-img">
                <h3>${recipe.name}</h3>
                <p>Category: ${recipe.category || 'Unknown'}</p>
                <button class="view-recipe" data-id="${recipe.id}">View Recipe</button>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    },

    filterRecipesByCategory(category) {
        const filtered = APP_STATE.recipes.filter(recipe => 
            recipe.category?.toLowerCase() === category.toLowerCase()
        );
        this.renderRecipes(filtered);
    }
};

const eventListeners = {
    initSearchListener() {
        const searchInput = document.getElementById('recipe-search');
        const searchBtn = document.getElementById('search-btn');

        if (!searchInput || !searchBtn) return;

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

        const url = `${API_CONFIG.baseUrl}recipes`;
        const data = await utils.fetchData(url);
        
        if (data) {
            const searchResults = data.filter(recipe => 
                recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            recipeManager.renderRecipes(searchResults);
        } else {
            utils.displayErrorMessage('No recipes found.');
        }
    },

    init() {
        this.initSearchListener();
    }
};

async function initializeApp() {
    await recipeManager.initializeRecipes();
    eventListeners.init();
}

document.addEventListener('DOMContentLoaded', initializeApp);
