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

        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const recipeId = parseInt(this.getAttribute('data-id'));
                showRecipeDetails(recipeId);
            });
        });
    }
    
    function showRecipeDetails(recipeId) {
        const recipe = allRecipes.find(r => r.id === recipeId);
        if (!recipe) return;
        
        document.getElementById('recipe-details-title').textContent = recipe.name;
        document.getElementById('recipe-details-image').src = recipe.image;
        document.getElementById('recipe-details-image').alt = recipe.name;
        
        const stepsList = document.getElementById('recipe-details-steps');
        stepsList.innerHTML = '';
        recipe.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
        
        recipeDetails.style.display = 'block';
    }
    
    function filterBySearch() {
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) {
            displayRecipes(allRecipes);
            return;
        }
        
        const filtered = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) || 
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.category.toLowerCase().includes(searchTerm)
        );
        
        displayRecipes(filtered);
    }
    
    function filterByCategory(category) {
        if (category === 'all') {
            displayRecipes(allRecipes);
            return;
        }
        
        const filtered = allRecipes.filter(recipe => recipe.category === category);
        displayRecipes(filtered);
    }

    searchButton.addEventListener('click', filterBySearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') filterBySearch();
    });
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    closeRecipeDetails.addEventListener('click', function() {
        recipeDetails.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === recipeDetails) {
            recipeDetails.style.display = 'none';
        }
    });
    
    
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    fetchRecipes();
});
    







   




