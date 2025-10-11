import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'chef@foodies.com',
        username: 'masterchef',
        firstName: 'Gordon',
        lastName: 'Ramsay',
        password: await bcrypt.hash('password123', 12),
        bio: 'Professional chef with over 20 years of experience in international cuisine.',
      },
    }),
    prisma.user.create({
      data: {
        email: 'home@foodies.com',
        username: 'homecook',
        firstName: 'Julia',
        lastName: 'Child',
        password: await bcrypt.hash('password123', 12),
        bio: 'Home cooking enthusiast who loves sharing family recipes.',
      },
    }),
    prisma.user.create({
      data: {
        email: 'baker@foodies.com',
        username: 'sweetbaker',
        firstName: 'Mary',
        lastName: 'Berry',
        password: await bcrypt.hash('password123', 12),
        bio: 'Passionate baker specializing in desserts and pastries.',
      },
    }),
  ]);

  // Create recipes
  const recipes = [
    {
      title: 'Classic Spaghetti Carbonara',
      description: 'A traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
      ingredients: [
        '400g spaghetti',
        '200g pancetta or guanciale, diced',
        '4 large eggs',
        '100g Pecorino Romano cheese, grated',
        '2 cloves garlic, minced',
        'Freshly ground black pepper',
        'Salt to taste',
      ],
      instructions: [
        'Bring a large pot of salted water to boil and cook spaghetti according to package directions.',
        'In a large skillet, cook pancetta over medium heat until crispy.',
        'In a bowl, whisk together eggs, cheese, and black pepper.',
        'Drain pasta, reserving 1 cup of pasta water.',
        'Add hot pasta to the skillet with pancetta.',
        'Remove from heat and quickly stir in egg mixture, adding pasta water as needed.',
        'Serve immediately with additional cheese and pepper.',
      ],
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'medium',
      category: 'dinner',
      tags: ['italian', 'pasta', 'comfort-food'],
      authorId: users[0].id,
    },
    {
      title: 'Fluffy Pancakes',
      description: 'Light and fluffy breakfast pancakes that are perfect for weekend mornings.',
      ingredients: [
        '2 cups all-purpose flour',
        '2 tablespoons sugar',
        '2 teaspoons baking powder',
        '1 teaspoon salt',
        '2 large eggs',
        '1¾ cups milk',
        '¼ cup melted butter',
        '1 teaspoon vanilla extract',
        'Butter for cooking',
      ],
      instructions: [
        'In a large bowl, whisk together flour, sugar, baking powder, and salt.',
        'In another bowl, beat eggs, then stir in milk, melted butter, and vanilla.',
        'Pour wet ingredients into dry ingredients and stir until just combined.',
        'Heat a griddle or large skillet over medium heat and add butter.',
        'Pour ¼ cup of batter for each pancake.',
        'Cook until bubbles form on surface, then flip and cook until golden.',
        'Serve hot with maple syrup and butter.',
      ],
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: 'easy',
      category: 'breakfast',
      tags: ['breakfast', 'pancakes', 'family-friendly'],
      authorId: users[1].id,
    },
    {
      title: 'Chocolate Chip Cookies',
      description: 'Classic homemade chocolate chip cookies that are crispy on the outside and chewy inside.',
      ingredients: [
        '2¼ cups all-purpose flour',
        '1 tsp baking soda',
        '1 tsp salt',
        '1 cup butter, softened',
        '¾ cup granulated sugar',
        '¾ cup packed brown sugar',
        '2 large eggs',
        '2 tsp vanilla extract',
        '2 cups chocolate chips',
      ],
      instructions: [
        'Preheat oven to 375°F (190°C).',
        'In a bowl, combine flour, baking soda, and salt.',
        'In a large bowl, beat butter and both sugars until creamy.',
        'Beat in eggs and vanilla.',
        'Gradually blend in flour mixture.',
        'Stir in chocolate chips.',
        'Drop rounded tablespoons onto ungreased cookie sheets.',
        'Bake 9-11 minutes or until golden brown.',
        'Cool on baking sheets for 2 minutes before removing.',
      ],
      prepTime: 15,
      cookTime: 25,
      servings: 48,
      difficulty: 'easy',
      category: 'desserts',
      tags: ['cookies', 'chocolate', 'baking', 'dessert'],
      authorId: users[2].id,
    },
    {
      title: 'Beef Stir Fry',
      description: 'Quick and healthy beef stir fry with fresh vegetables and savory sauce.',
      ingredients: [
        '1 lb beef sirloin, sliced thin',
        '2 tbsp vegetable oil',
        '1 bell pepper, sliced',
        '1 onion, sliced',
        '2 carrots, julienned',
        '2 cloves garlic, minced',
        '2 tbsp soy sauce',
        '1 tbsp oyster sauce',
        '1 tsp cornstarch',
        '½ cup beef broth',
        'Green onions for garnish',
      ],
      instructions: [
        'Marinate beef in soy sauce and cornstarch for 15 minutes.',
        'Heat oil in a large wok or skillet over high heat.',
        'Add beef and stir-fry until browned, about 3-4 minutes.',
        'Remove beef and set aside.',
        'Add vegetables to the same pan and stir-fry for 3-4 minutes.',
        'Add garlic and cook for 1 minute.',
        'Return beef to pan and add oyster sauce and broth.',
        'Stir-fry for 2-3 minutes until sauce thickens.',
        'Garnish with green onions and serve with rice.',
      ],
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      difficulty: 'medium',
      category: 'dinner',
      tags: ['beef', 'stir-fry', 'asian', 'healthy'],
      authorId: users[0].id,
    },
    {
      title: 'Greek Salad',
      description: 'Fresh and vibrant Greek salad with feta cheese and Mediterranean flavors.',
      ingredients: [
        '4 large tomatoes, cut into wedges',
        '1 cucumber, sliced',
        '1 red onion, thinly sliced',
        '1 green bell pepper, sliced',
        '½ cup Kalamata olives',
        '200g feta cheese, cubed',
        '¼ cup olive oil',
        '2 tbsp red wine vinegar',
        '1 tsp dried oregano',
        'Salt and pepper to taste',
      ],
      instructions: [
        'Combine tomatoes, cucumber, onion, and bell pepper in a large bowl.',
        'Add olives and feta cheese.',
        'In a small bowl, whisk together olive oil, vinegar, and oregano.',
        'Pour dressing over salad and toss gently.',
        'Season with salt and pepper.',
        'Let stand for 10 minutes before serving.',
        'Serve chilled as a side dish or light meal.',
      ],
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      difficulty: 'easy',
      category: 'lunch',
      tags: ['salad', 'greek', 'vegetarian', 'healthy'],
      authorId: users[1].id,
    },
  ];

  const createdRecipes = [];
  for (const recipe of recipes) {
    const createdRecipe = await prisma.recipe.create({
      data: {
        ...recipe,
        ingredients: JSON.stringify(recipe.ingredients),
        instructions: JSON.stringify(recipe.instructions),
        tags: JSON.stringify(recipe.tags),
      },
    });
    createdRecipes.push(createdRecipe);
  }

  // Create some reviews
  const reviews = [
    {
      rating: 5,
      comment: 'Absolutely delicious! The carbonara was creamy and perfect.',
      userId: users[1].id,
      recipeId: createdRecipes[0].id,
    },
    {
      rating: 4,
      comment: 'Great recipe, kids loved the pancakes!',
      userId: users[0].id,
      recipeId: createdRecipes[1].id,
    },
    {
      rating: 5,
      comment: 'Best chocolate chip cookies ever! So crispy and chewy.',
      userId: users[1].id,
      recipeId: createdRecipes[2].id,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    });
  }

  // Create some favorites
  const favorites = [
    { userId: users[1].id, recipeId: createdRecipes[0].id },
    { userId: users[2].id, recipeId: createdRecipes[1].id },
    { userId: users[0].id, recipeId: createdRecipes[2].id },
    { userId: users[1].id, recipeId: createdRecipes[3].id },
  ];

  for (const favorite of favorites) {
    await prisma.favorite.create({
      data: favorite,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`👥 Created ${users.length} users`);
  console.log(`🍽️ Created ${createdRecipes.length} recipes`);
  console.log(`⭐ Created ${reviews.length} reviews`);
  console.log(`❤️ Created ${favorites.length} favorites`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });