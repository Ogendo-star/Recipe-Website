document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript loaded successfully!");

    const BASE_URL = "http://localhost:3000/recipes"; 
    const content = document.getElementById("content");
    const menuLinks = document.querySelectorAll(".menu a");

    const pages = {
        "home": `<h2>Welcome to Selah's Secrets!</h2>
                 <p>Delicious, simple-to-prepare recipes that celebrate fresh seasonal ingredients.</p>`,
        "about": `<h2>About</h2>
                  <p>This section contains information about the creator of Selah's Secrets.</p>`
    };

    // ✅ Function to Fetch and Display Recipes
    const loadRecipes = async (category) => {
        try {
            console.log(`Fetching recipes for: ${category}...`);

            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error("Failed to load recipes");

            const data = await response.json(); 
            const recipes = data[category]; // ✅ Get category data

            if (!recipes || recipes.length === 0) {
                content.innerHTML = `<p>No recipes found for ${category}.</p>`;
                return;
            }

            displayRecipes(category, recipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            content.innerHTML = `<p style="color:red;">Failed to load recipes. Please try again later.</p>`;
        }
    };

    // ✅ Function to Display Recipes
    const displayRecipes = (category, recipes) => {
        let htmlContent = `<h2>${category.charAt(0).toUpperCase() + category.slice(1)} Recipes</h2>`;
        
        recipes.forEach(recipe => {
            htmlContent += `
                <div class="recipe">
                    <h3>${recipe.name}</h3>
                    <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">  <!-- ✅ Image Fix -->
                    <p>${recipe.description}</p>
                    <h4>Steps:</h4>
                    <ol>
                        ${recipe.steps.map(step => `<li>${step}</li>`).join("")}
                    </ol>
                </div>
            `;
        });

        content.innerHTML = htmlContent;
    };

    // ✅ Handle Navigation Click Events
    menuLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const page = event.target.dataset.page;

            if (page) {
                if (pages[page]) {
                    content.innerHTML = pages[page]; 
                } else {
                    loadRecipes(page); // ✅ Load recipes dynamically
                }
            }
        });
    });

    console.log("Script initialized successfully!");
});
