const nameInput = document.getElementById('name');
const ingredientsInput = document.getElementById('ingredients');
const stepsInput = document.getElementById('steps');
const addBtn = document.getElementById('addBtn');
const recipeList = document.getElementById('recipeList');

const STORAGE_KEY = 'recipes';

function getRecipes() {
  const recipes = localStorage.getItem(STORAGE_KEY);
  return recipes ? JSON.parse(recipes) : [];
}

function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function renderRecipes() {
  const recipes = getRecipes();
  recipeList.innerHTML = '';

  recipes.forEach((recipe, index) => {
    const card = document.createElement('div');
    card.className = 'recipe';

    const nameEl = document.createElement('h3');
    nameEl.textContent = recipe.name;

    const ingredientsEl = document.createElement('p');
    const ingredientsLabel = document.createElement('strong');
    ingredientsLabel.textContent = 'Ingredients: ';
    ingredientsEl.appendChild(ingredientsLabel);
    ingredientsEl.appendChild(document.createTextNode(recipe.ingredients));
    ingredientsEl.style.whiteSpace = 'pre-wrap';

    const stepsEl = document.createElement('p');
    const stepsLabel = document.createElement('strong');
    stepsLabel.textContent = 'Steps: ';
    stepsEl.appendChild(stepsLabel);
    stepsEl.appendChild(document.createTextNode(recipe.steps));
    stepsEl.style.whiteSpace = 'pre-wrap';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteRecipe(index);
    });

    card.appendChild(nameEl);
    card.appendChild(ingredientsEl);
    card.appendChild(stepsEl);
    card.appendChild(deleteBtn);

    recipeList.appendChild(card);
  });
}

function deleteRecipe(index) {
  const recipes = getRecipes();
  recipes.splice(index, 1);
  saveRecipes(recipes);
  renderRecipes();
}

addBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();

  if (!name) {
    alert('Please enter a recipe name.');
    return;
  }

  const newRecipe = {
    name: name,
    ingredients: ingredientsInput.value.trim(),
    steps: stepsInput.value.trim()
  };

  const recipes = getRecipes();
  recipes.push(newRecipe);
  saveRecipes(recipes);

  renderRecipes();

  nameInput.value = '';
  ingredientsInput.value = '';
  stepsInput.value = '';
});

// Load recipes from localStorage on initial page load
renderRecipes();
