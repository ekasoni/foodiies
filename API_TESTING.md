# API Testing with cURL

## Authentication

### Register a new user
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "chef@foodies.com",
    "password": "password123"
  }'
```

### Get Profile (requires token)
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Recipes

### Get all recipes
```bash
curl -X GET "http://localhost:3001/api/recipes?page=1&limit=10"
```

### Get specific recipe
```bash
curl -X GET http://localhost:3001/api/recipes/RECIPE_ID
```

### Create recipe (requires authentication)
```bash
curl -X POST http://localhost:3001/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Recipe",
    "description": "A test recipe",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["step 1", "step 2"],
    "prepTime": 15,
    "cookTime": 30,
    "servings": 4,
    "difficulty": "easy",
    "category": "dinner",
    "tags": ["test", "easy"]
  }'
```

### Search recipes
```bash
curl -X GET "http://localhost:3001/api/recipes?search=pasta&category=dinner&difficulty=medium"
```

## User Operations

### Get user profile
```bash
curl -X GET http://localhost:3001/api/users/profile/masterchef
```

### Get favorites (requires authentication)
```bash
curl -X GET http://localhost:3001/api/users/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Toggle favorite (requires authentication)
```bash
curl -X POST http://localhost:3001/api/recipes/RECIPE_ID/favorite \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Health Check
```bash
curl -X GET http://localhost:3001/health
```