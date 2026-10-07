// DOM Elements
const nameInput = document.getElementById('name');
const categorySelect = document.getElementById('category');
const ingredientsInput = document.getElementById('ingredients');
const stepsInput = document.getElementById('steps');
const imageUrlInput = document.getElementById('imageUrl');
const addBtn = document.getElementById('addBtn');
const recipeList = document.getElementById('recipeList');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const categoryTabs = document.getElementById('categoryTabs');
const statTotal = document.getElementById('statTotal');
const statFavorites = document.getElementById('statFavorites');
const statCategories = document.getElementById('statCategories');
const toastEl = document.getElementById('toast');
const darkModeToggle = document.getElementById('darkModeToggle');

const DARK_MODE_KEY = 'darkMode';

// ─── Dark mode: apply saved preference immediately ───
function applyDarkMode(isDark) {
  if (isDark) {
    document.body.classList.add('dark');
    if (darkModeToggle) darkModeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    if (darkModeToggle) darkModeToggle.textContent = '🌙';
  }
}

// Load saved dark mode preference on startup
applyDarkMode(localStorage.getItem(DARK_MODE_KEY) === 'true');

// Toggle button click handler
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    applyDarkMode(isDark);
    localStorage.setItem(DARK_MODE_KEY, isDark);
    showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
  });
}

const STORAGE_KEY = 'recipes';

// Category metadata
const CATEGORIES = [
  { id: 'all', label: 'All Recipes', emoji: '🍽️' },
  { id: 'favorites', label: 'Favourites', emoji: '❤️' },
  { id: 'Breakfast', label: 'Breakfast', emoji: '🥞' },
  { id: 'Main Course', label: 'Main Course', emoji: '🍛' },
  { id: 'Snacks', label: 'Snacks', emoji: '🥗' },
  { id: 'Desserts', label: 'Desserts', emoji: '🍧' },
  { id: 'Drinks', label: 'Drinks', emoji: '☕' }
];

// 4 sample Indian recipes with categories and favourite tags
const sampleRecipes = [
  {
    id: 'sample_1',
    name: 'Masala Dosa',
    category: 'Breakfast',
    isFavorite: true,
    ingredients: 'Rice, Urad dal, Fenugreek seeds, Salt, Potatoes, Onions, Green chillies, Mustard seeds, Curry leaves, Turmeric powder, Oil',
    steps: '1. Soak rice and urad dal for 6 hours, then grind into a smooth batter.\n2. Ferment the batter overnight.\n3. Boil and mash potatoes. Sauté mustard seeds, curry leaves, onions, green chillies and turmeric, then mix in the potatoes.\n4. Heat a flat pan, pour a ladle of batter, and spread it thin in a circle.\n5. Drizzle oil, cook until golden and crispy.\n6. Place the potato filling in the centre, fold the dosa, and serve hot with chutney and sambar.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Masala_dosa.jpg/800px-Masala_dosa.jpg'
  },
  {
    id: 'sample_2',
    name: 'Veg Biryani',
    category: 'Main Course',
    isFavorite: true,
    ingredients: 'Basmati rice, Mixed vegetables (carrots, beans, peas, cauliflower), Onions, Tomatoes, Ginger-garlic paste, Yogurt, Mint leaves, Coriander leaves, Biryani masala, Saffron, Ghee, Bay leaf, Cinnamon, Cloves, Cardamom, Salt',
    steps: '1. Wash and soak basmati rice for 30 minutes, then cook until 70% done.\n2. Heat ghee in a heavy pan, add whole spices and sauté sliced onions until golden brown.\n3. Add ginger-garlic paste, tomatoes, and mixed vegetables. Cook for 5 minutes.\n4. Stir in yogurt, biryani masala, mint, and coriander. Cook until vegetables are tender.\n5. Layer the partially cooked rice over the vegetable mixture.\n6. Sprinkle saffron milk on top, cover tightly, and cook on low heat (dum) for 20 minutes.\n7. Gently mix and serve hot with raita.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Hyderabadi_Vegetable_Biryani.jpg/800px-Hyderabadi_Vegetable_Biryani.jpg'
  },
  {
    id: 'sample_3',
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    isFavorite: false,
    ingredients: 'Paneer (250g), Tomatoes, Onions, Cashew nuts, Butter, Cream, Ginger-garlic paste, Kashmiri red chilli powder, Garam masala, Turmeric, Sugar, Kasuri methi (dried fenugreek leaves), Salt, Oil',
    steps: '1. Cut paneer into cubes and lightly fry until golden. Set aside.\n2. Sauté onions, tomatoes, and cashew nuts until soft, then blend into a smooth paste.\n3. Heat butter in a pan, add ginger-garlic paste and cook for a minute.\n4. Add the tomato-cashew paste, chilli powder, turmeric, and salt. Cook for 5–7 minutes.\n5. Add cream, sugar, and garam masala. Simmer for 3 minutes.\n6. Add paneer cubes and crushed kasuri methi. Cook for 2 more minutes.\n7. Serve hot with naan or rice.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Paneer_Butter_Masala.jpg/800px-Paneer_Butter_Masala.jpg'
  },
  {
    id: 'sample_4',
    name: 'Gulab Jamun',
    category: 'Desserts',
    isFavorite: false,
    ingredients: 'Khoya/mawa (200g), All-purpose flour (2 tbsp), Baking soda (a pinch), Milk (as needed), Cardamom powder, Sugar (1.5 cups), Water (1 cup), Rose water, Saffron strands, Ghee or oil for frying',
    steps: '1. Crumble khoya, add flour, baking soda, and cardamom. Mix gently.\n2. Add a little milk to form a soft, smooth dough without cracks. Do not over-knead.\n3. Make sugar syrup by boiling sugar and water until slightly sticky. Add rose water and saffron.\n4. Divide dough into small portions and roll into smooth round balls.\n5. Heat ghee on low-medium flame. Fry the balls slowly, turning gently, until deep golden brown.\n6. Immediately drop the hot gulab jamuns into the warm sugar syrup.\n7. Let them soak for at least 1–2 hours before serving. Serve warm or chilled.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gulab_Jamun.jpg/800px-Gulab_Jamun.jpg'
  }
];

// Active filter states
let activeCategory = 'all';
let searchQuery = '';
let editingRecipeId = null;

// DOM refs for edit mode
const formBox = document.querySelector('.form-box');
const formTitle = document.querySelector('.form-title');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Helper: Normalize recipe structure for backward compatibility
function normalizeRecipe(r, idx) {
  return {
    id: r.id || 'recipe_' + idx + '_' + Date.now(),
    name: r.name || 'Untitled Recipe',
    category: r.category || 'Main Course',
    isFavorite: Boolean(r.isFavorite),
    ingredients: r.ingredients || '',
    steps: r.steps || '',
    imageUrl: r.imageUrl || ''
  };
}

// Get recipes from localStorage
function getRecipes() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const list = JSON.parse(data);
    return list.map(normalizeRecipe);
  } catch (e) {
    console.error('Failed to parse recipes:', e);
    return [];
  }
}

// Save recipes to localStorage
function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

// Toast notification for micro-interactions
let toastTimer = null;
function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('visible');
  }, 2400);
}

// Update header stats counter
function updateStats(recipes) {
  const total = recipes.length;
  const favs = recipes.filter(r => r.isFavorite).length;
  const uniqueCats = new Set(recipes.map(r => r.category)).size;

  if (statTotal) statTotal.textContent = `📖 ${total} ${total === 1 ? 'Recipe' : 'Recipes'}`;
  if (statFavorites) statFavorites.textContent = `❤️ ${favs} ${favs === 1 ? 'Favourite' : 'Favourites'}`;
  if (statCategories) statCategories.textContent = `📂 ${uniqueCats} Categories`;
}

// Render Category Pills with counts
function renderCategoryTabs(recipes) {
  if (!categoryTabs) return;
  categoryTabs.innerHTML = '';

  CATEGORIES.forEach(cat => {
    let count = 0;
    if (cat.id === 'all') {
      count = recipes.length;
    } else if (cat.id === 'favorites') {
      count = recipes.filter(r => r.isFavorite).length;
    } else {
      count = recipes.filter(r => r.category === cat.id).length;
    }

    const pill = document.createElement('button');
    pill.className = `cat-pill ${cat.id === 'favorites' ? 'fav-pill' : ''} ${activeCategory === cat.id ? 'active' : ''}`;
    pill.setAttribute('type', 'button');
    pill.innerHTML = `
      <span class="cat-emoji">${cat.emoji}</span>
      <span class="cat-label">${cat.label}</span>
      <span class="cat-count">${count}</span>
    `;

    pill.addEventListener('click', () => {
      activeCategory = cat.id;
      renderCategoryTabs(getRecipes());
      renderRecipes();
    });

    categoryTabs.appendChild(pill);
  });
}

// Toggle favourite status
function toggleFavorite(id) {
  const recipes = getRecipes();
  const target = recipes.find(r => r.id === id);
  if (!target) return;

  target.isFavorite = !target.isFavorite;
  saveRecipes(recipes);

  if (target.isFavorite) {
    showToast(`Added "${target.name}" to Favourites! ❤️`);
  } else {
    showToast(`Removed from Favourites 🤍`);
  }

  updateStats(recipes);
  renderCategoryTabs(recipes);
  renderRecipes();
}

// Build image area with Category badge & Favourite bookmark button
function createImageArea(recipe) {
  const wrapper = document.createElement('div');
  wrapper.className = 'recipe-img';

  // Category badge
  const catObj = CATEGORIES.find(c => c.id === recipe.category);
  const badge = document.createElement('span');
  badge.className = 'recipe-cat-badge';
  badge.textContent = `${catObj ? catObj.emoji : '🍽️'} ${recipe.category}`;
  wrapper.appendChild(badge);

  // Favourite heart button
  const favBtn = document.createElement('button');
  favBtn.className = `recipe-fav-btn ${recipe.isFavorite ? 'active' : ''}`;
  favBtn.setAttribute('type', 'button');
  favBtn.setAttribute('title', recipe.isFavorite ? 'Remove from favourites' : 'Add to favourites');
  favBtn.setAttribute('aria-label', 'Toggle favourite');
  favBtn.textContent = recipe.isFavorite ? '❤️' : '🤍';
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
  });
  wrapper.appendChild(favBtn);

  // Image or placeholder
  if (recipe.imageUrl) {
    const img = document.createElement('img');
    img.src = recipe.imageUrl;
    img.alt = recipe.name;
    img.loading = 'lazy';
    img.onerror = function () {
      img.remove();
      wrapper.appendChild(makePlaceholder(recipe.category));
    };
    wrapper.appendChild(img);
  } else {
    wrapper.appendChild(makePlaceholder(recipe.category));
  }

  return wrapper;
}

// Emoji placeholder matching category
function makePlaceholder(category) {
  const placeholder = document.createElement('div');
  placeholder.className = 'recipe-img-placeholder';
  const catObj = CATEGORIES.find(c => c.id === category);
  placeholder.textContent = catObj ? catObj.emoji : '🍽️';
  return placeholder;
}

// Render recipe cards matching filters
function renderRecipes() {
  const recipes = getRecipes();
  updateStats(recipes);

  // Apply Category filter
  let filtered = recipes.filter(r => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'favorites') return r.isFavorite;
    return r.category === activeCategory;
  });

  // Apply Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.ingredients.toLowerCase().includes(q) ||
      r.steps.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  }

  recipeList.innerHTML = '';

  // Empty state handling
  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';

    if (activeCategory === 'favorites') {
      empty.innerHTML = `
        <div class="empty-icon">❤️</div>
        <h3>No favourite recipes yet</h3>
        <p>Tap the heart icon (🤍) on any delicious recipe to save it here for quick access!</p>
      `;
    } else if (searchQuery.trim()) {
      empty.innerHTML = `
        <div class="empty-icon">🔍</div>
        <h3>No recipes found</h3>
        <p>No results matching <em>"${escapeHtml(searchQuery)}"</em>. Try a different keyword or check another category.</p>
      `;
    } else {
      empty.innerHTML = `
        <div class="empty-icon">🍳</div>
        <h3>No recipes in "${activeCategory}" yet</h3>
        <p>Be the chef of this category! Fill in the recipe card above to add your first dish.</p>
      `;
    }
    recipeList.appendChild(empty);
    return;
  }

  // Render cards
  filtered.forEach(recipe => {
    const card = document.createElement('article');
    card.className = `recipe ${recipe.isFavorite ? 'is-favorite' : ''}`;
    card.setAttribute('data-id', recipe.id);

    // Image header with category & fav button
    card.appendChild(createImageArea(recipe));

    // Favorite ribbon banner
    if (recipe.isFavorite) {
      const rib = document.createElement('div');
      rib.className = 'favorite-ribbon';
      rib.innerHTML = '★ Family Favourite';
      card.appendChild(rib);
    }

    const nameEl = document.createElement('h3');
    nameEl.textContent = recipe.name;

    const ingredientsEl = document.createElement('p');
    ingredientsEl.className = 'recipe-ingredients';
    const ingredientsLabel = document.createElement('strong');
    ingredientsLabel.textContent = 'Ingredients: ';
    ingredientsEl.appendChild(ingredientsLabel);
    ingredientsEl.appendChild(document.createTextNode(recipe.ingredients || 'None specified'));

    const stepsEl = document.createElement('p');
    stepsEl.className = 'recipe-steps';
    const stepsLabel = document.createElement('strong');
    stepsLabel.textContent = 'Steps: ';
    stepsEl.appendChild(stepsLabel);
    stepsEl.appendChild(document.createTextNode(recipe.steps || 'None specified'));

    const cardFooter = document.createElement('div');
    cardFooter.className = 'recipe-card-footer';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '✏️ Edit';
    editBtn.setAttribute('title', 'Edit recipe');
    editBtn.addEventListener('click', () => {
      startEdit(recipe.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.setAttribute('title', 'Delete recipe');
    deleteBtn.addEventListener('click', () => {
      deleteRecipe(recipe.id, recipe.name);
    });

    cardFooter.appendChild(editBtn);
    cardFooter.appendChild(deleteBtn);

    card.appendChild(nameEl);
    card.appendChild(ingredientsEl);
    card.appendChild(stepsEl);
    card.appendChild(cardFooter);

    recipeList.appendChild(card);
  });
}

// Helper to escape HTML in search feedback
function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Delete a recipe by ID
function deleteRecipe(id, name) {
  if (!confirm(`Are you sure you want to remove "${name || 'this recipe'}" from your cookbook?`)) {
    return;
  }
  if (editingRecipeId === id) {
    cancelEdit();
  }
  let recipes = getRecipes();
  recipes = recipes.filter(r => r.id !== id);
  saveRecipes(recipes);

  showToast(`"${name}" removed from cookbook 🗑️`);
  renderCategoryTabs(recipes);
  renderRecipes();
}

// ─── Edit mode helpers ───
function startEdit(id) {
  const recipes = getRecipes();
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  editingRecipeId = id;

  // Populate form fields
  nameInput.value = recipe.name;
  if (categorySelect) categorySelect.value = recipe.category;
  ingredientsInput.value = recipe.ingredients;
  stepsInput.value = recipe.steps;
  imageUrlInput.value = recipe.imageUrl;

  // Switch button text & show cancel
  addBtn.textContent = 'Save Changes';
  if (cancelEditBtn) cancelEditBtn.style.display = 'inline-block';
  if (formBox) formBox.classList.add('editing');
  if (formTitle) formTitle.textContent = '✦ Editing Recipe ✦';

  // Scroll to form
  if (formBox) formBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  nameInput.focus();

  showToast(`✏️ Editing "${recipe.name}"`);
}

function cancelEdit() {
  editingRecipeId = null;

  // Clear form fields
  nameInput.value = '';
  if (categorySelect) categorySelect.value = 'Main Course';
  ingredientsInput.value = '';
  stepsInput.value = '';
  imageUrlInput.value = '';

  // Reset button text & hide cancel
  addBtn.textContent = 'Add Recipe';
  if (cancelEditBtn) cancelEditBtn.style.display = 'none';
  if (formBox) formBox.classList.remove('editing');
  if (formTitle) formTitle.textContent = '✦ Write a New Recipe ✦';
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener('click', () => {
    cancelEdit();
    showToast('Edit cancelled');
  });
}

// Add / Save Recipe button click handler
addBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.focus();
    showToast('⚠️ Please enter a recipe name.');
    return;
  }

  const recipes = getRecipes();

  if (editingRecipeId) {
    // ── Save changes to existing recipe ──
    const idx = recipes.findIndex(r => r.id === editingRecipeId);
    if (idx === -1) {
      showToast('⚠️ Recipe not found. It may have been deleted.');
      cancelEdit();
      return;
    }

    recipes[idx].name = name;
    recipes[idx].category = categorySelect ? categorySelect.value : 'Main Course';
    recipes[idx].ingredients = ingredientsInput.value.trim();
    recipes[idx].steps = stepsInput.value.trim();
    recipes[idx].imageUrl = imageUrlInput.value.trim();
    // isFavorite is intentionally preserved

    saveRecipes(recipes);
    showToast(`Updated "${name}" successfully! ✅`);
    cancelEdit();
  } else {
    // ── Add new recipe ──
    const newRecipe = {
      id: 'recipe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: name,
      category: categorySelect ? categorySelect.value : 'Main Course',
      isFavorite: false,
      ingredients: ingredientsInput.value.trim(),
      steps: stepsInput.value.trim(),
      imageUrl: imageUrlInput.value.trim()
    };

    recipes.unshift(newRecipe); // Place new recipe at top
    saveRecipes(recipes);

    // Clear form fields
    nameInput.value = '';
    ingredientsInput.value = '';
    stepsInput.value = '';
    imageUrlInput.value = '';

    showToast(`Added "${newRecipe.name}" to ${newRecipe.category}! 🍳`);

    // If currently filtering another category, switch to the added category or 'all'
    if (activeCategory !== 'all' && activeCategory !== newRecipe.category) {
      activeCategory = newRecipe.category;
    }
  }

  renderCategoryTabs(recipes);
  renderRecipes();
});

// Search input handling
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchQuery ? 'inline-block' : 'none';
    }
    renderRecipes();
  });
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    renderRecipes();
  });
}

// Seed sample recipes on first visit or if localStorage empty
if (!localStorage.getItem(STORAGE_KEY)) {
  saveRecipes(sampleRecipes);
} else {
  // Gracefully normalize existing recipes in storage
  const current = getRecipes();
  saveRecipes(current);
}

// Initialize UI
const initialRecipes = getRecipes();
renderCategoryTabs(initialRecipes);
renderRecipes();

// ─── "What should I cook?" surprise picker ───
const surpriseMeBtn = document.getElementById('surpriseMeBtn');

if (surpriseMeBtn) {
  surpriseMeBtn.addEventListener('click', () => {
    // Grab currently visible recipe cards from the DOM
    const visibleCards = recipeList.querySelectorAll('.recipe[data-id]');

    if (visibleCards.length === 0) {
      showToast('🍽️ No recipes to pick from! Add some dishes first.');
      return;
    }

    // Pick a random card
    const randomIndex = Math.floor(Math.random() * visibleCards.length);
    const chosenCard = visibleCards[randomIndex];
    const recipeName = chosenCard.querySelector('h3')?.textContent || 'a tasty dish';

    // Remove glow from any previously highlighted card
    recipeList.querySelectorAll('.recipe.glow-highlight').forEach(el => {
      el.classList.remove('glow-highlight');
    });

    // Scroll smoothly into view
    chosenCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Trigger glow after a small delay so the scroll has time to start
    setTimeout(() => {
      // Force animation restart by removing and re-adding the class
      chosenCard.classList.remove('glow-highlight');
      // Trigger reflow so the browser treats this as a fresh animation
      void chosenCard.offsetWidth;
      chosenCard.classList.add('glow-highlight');

      showToast(`🎲 Tonight you're cooking: ${recipeName}!`);

      // Clean up the class after the animation finishes
      chosenCard.addEventListener('animationend', function onEnd() {
        chosenCard.classList.remove('glow-highlight');
        chosenCard.removeEventListener('animationend', onEnd);
      });
    }, 300);
  });
}
