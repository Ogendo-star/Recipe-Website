document.addEventListener('DOMContentLoaded', function() {
    const recipesContainer = document.getElementById('recipes-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const recipeDetails = document.getElementById('recipe-details');
    const closeRecipeDetails = document.querySelector('.close-recipe-details');


    let allRecipes = [];
    
    async function fetchRecipes() {
        try {
            const response = await fetch('db.json');
            const data = await response.json();
            allRecipes = data.recipes;
            displayRecipes(allRecipes);
        } catch (error) {
            console.error('Error loading recipes:', error);
            recipesContainer.innerHTML = '<p>Could not load recipes. Please try again later.</p>';
        }
    }
    
    function displayRecipes(recipes) {
        recipesContainer.innerHTML = '';
        
        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p>No recipes found. Try a different search.</p>';
            return;
        }
        
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <div class="recipe-image">
                    <img src="${recipe.image}" alt="${recipe.name}">
                </div>
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description}</p>
                    <button class="view-btn" data-id="${recipe.id}">View Recipe</button>
                </div>
            `;
            recipesContainer.appendChild(recipeCard);
        });
   } });




