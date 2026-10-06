// DOM elements
const nameInput = document.getElementById('name');
const ingredientsInput = document.getElementById('ingredients');
const stepsInput = document.getElementById('steps');
const imageUrlInput = document.getElementById('imageUrl');
const addBtn = document.getElementById('addBtn');
const recipeList = document.getElementById('recipeList');

const STORAGE_KEY = 'recipes';

// 4 sample Indian recipes to pre-load on first visit
const sampleRecipes = [
  {
    name: 'Masala Dosa',
    ingredients: 'Rice, Urad dal, Fenugreek seeds, Salt, Potatoes, Onions, Green chillies, Mustard seeds, Curry leaves, Turmeric powder, Oil',
    steps: '1. Soak rice and urad dal for 6 hours, then grind into a smooth batter.\n2. Ferment the batter overnight.\n3. Boil and mash potatoes. Sauté mustard seeds, curry leaves, onions, green chillies and turmeric, then mix in the potatoes.\n4. Heat a flat pan, pour a ladle of batter, and spread it thin in a circle.\n5. Drizzle oil, cook until golden and crispy.\n6. Place the potato filling in the centre, fold the dosa, and serve hot with chutney and sambar.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Masala_dosa.jpg/800px-Masala_dosa.jpg'
  },
  {
    name: 'Veg Biryani',
    ingredients: 'Basmati rice, Mixed vegetables (carrots, beans, peas, cauliflower), Onions, Tomatoes, Ginger-garlic paste, Yogurt, Mint leaves, Coriander leaves, Biryani masala, Saffron, Ghee, Bay leaf, Cinnamon, Cloves, Cardamom, Salt',
    steps: '1. Wash and soak basmati rice for 30 minutes, then cook until 70% done.\n2. Heat ghee in a heavy pan, add whole spices and sauté sliced onions until golden brown.\n3. Add ginger-garlic paste, tomatoes, and mixed vegetables. Cook for 5 minutes.\n4. Stir in yogurt, biryani masala, mint, and coriander. Cook until vegetables are tender.\n5. Layer the partially cooked rice over the vegetable mixture.\n6. Sprinkle saffron milk on top, cover tightly, and cook on low heat (dum) for 20 minutes.\n7. Gently mix and serve hot with raita.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Hyderabadi_Vegetable_Biryani.jpg/800px-Hyderabadi_Vegetable_Biryani.jpg'
  },
  {
    name: 'Paneer Butter Masala',
    ingredients: 'Paneer (250g), Tomatoes, Onions, Cashew nuts, Butter, Cream, Ginger-garlic paste, Kashmiri red chilli powder, Garam masala, Turmeric, Sugar, Kasuri methi (dried fenugreek leaves), Salt, Oil',
    steps: '1. Cut paneer into cubes and lightly fry until golden. Set aside.\n2. Sauté onions, tomatoes, and cashew nuts until soft, then blend into a smooth paste.\n3. Heat butter in a pan, add ginger-garlic paste and cook for a minute.\n4. Add the tomato-cashew paste, chilli powder, turmeric, and salt. Cook for 5–7 minutes.\n5. Add cream, sugar, and garam masala. Simmer for 3 minutes.\n6. Add paneer cubes and crushed kasuri methi. Cook for 2 more minutes.\n7. Serve hot with naan or rice.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Paneer_Butter_Masala.jpg/800px-Paneer_Butter_Masala.jpg'
  },
  {
    name: 'Gulab Jamun',
    ingredients: 'Khoya/mawa (200g), All-purpose flour (2 tbsp), Baking soda (a pinch), Milk (as needed), Cardamom powder, Sugar (1.5 cups), Water (1 cup), Rose water, Saffron strands, Ghee or oil for frying',
    steps: '1. Crumble khoya, add flour, baking soda, and cardamom. Mix gently.\n2. Add a little milk to form a soft, smooth dough without cracks. Do not over-knead.\n3. Make sugar syrup by boiling sugar and water until slightly sticky. Add rose water and saffron.\n4. Divide dough into small portions and roll into smooth round balls.\n5. Heat ghee on low-medium flame. Fry the balls slowly, turning gently, until deep golden brown.\n6. Immediately drop the hot gulab jamuns into the warm sugar syrup.\n7. Let them soak for at least 1–2 hours before serving. Serve warm or chilled.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gulab_Jamun.jpg/800px-Gulab_Jamun.jpg'
  }
];

// Get recipes from localStorage
function getRecipes() {
  const recipes = localStorage.getItem(STORAGE_KEY);
  return recipes ? JSON.parse(recipes) : [];
}

// Save recipes to localStorage
function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

// Build the image area for a recipe card (image or placeholder)
function createImageArea(imageUrl) {
  const wrapper = document.createElement('div');
  wrapper.className = 'recipe-img';

  if (imageUrl) {
    // Try loading the real image
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Recipe photo';
    // If image fails to load, show placeholder instead
    img.onerror = function () {
      wrapper.removeChild(img);
      wrapper.appendChild(makePlaceholder());
    };
    wrapper.appendChild(img);
  } else {
    // No URL provided — show placeholder
    wrapper.appendChild(makePlaceholder());
  }

  return wrapper;
}

// Create emoji placeholder for missing images
function makePlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'recipe-img-placeholder';
  placeholder.textContent = '🍽️';
  return placeholder;
}

// Render all recipe cards into the page
function renderRecipes() {
  const recipes = getRecipes();
  recipeList.innerHTML = '';

  recipes.forEach((recipe, index) => {
    const card = document.createElement('div');
    card.className = 'recipe';

    // Image area (at the top of the card)
    card.appendChild(createImageArea(recipe.imageUrl));

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

// Delete a recipe by index
function deleteRecipe(index) {
  const recipes = getRecipes();
  recipes.splice(index, 1);
  saveRecipes(recipes);
  renderRecipes();
}

// Add Recipe button click handler
addBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();

  if (!name) {
    alert('Please enter a recipe name.');
    return;
  }

  const newRecipe = {
    name: name,
    ingredients: ingredientsInput.value.trim(),
    steps: stepsInput.value.trim(),
    imageUrl: imageUrlInput.value.trim()
  };

  const recipes = getRecipes();
  recipes.push(newRecipe);
  saveRecipes(recipes);

  renderRecipes();

  // Clear form fields
  nameInput.value = '';
  ingredientsInput.value = '';
  stepsInput.value = '';
  imageUrlInput.value = '';
});

// On first load, seed sample recipes if localStorage is empty
if (!localStorage.getItem(STORAGE_KEY)) {
  saveRecipes(sampleRecipes);
}

// Load and display recipes
renderRecipes();
