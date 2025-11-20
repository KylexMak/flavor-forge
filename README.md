# RecipeGenerator

## Description
Allows the user to input what ingredients and equipment they have at home and uses AI to generate a recipe the user can cook.

## ERD
![alt text](Images/RecipeERD3.png)

## General Operations Diagram
![alt text](Images/GeneralOperations.png)

## 5 Week Plan
### Sprint 1: The Foundation (Nov 6 - Nov 12)
Goal: Get all 3 services (Next.js, Backend, MySQL) set up and communicating. By 11/12, you should be able to: Prove that your frontend can fetch data from your backend, which in turn fetches data from your database.

#### Day 1 (11/6): Decision & Setup.
Decide: C# (.NET Web API) or Node.js (Express/NestJS)?
Create monorepo or separate Git repositories.
Initialize projects: create-next-app for frontend, dotnet new webapi or npm init for backend.

#### Day 2 (11/7): Database Schema.
Set up MySQL database (locally or on a free cloud provider).
Write the SQL scripts to create all tables from your ERD.
CRITICAL: Add the missing MasterEquipment, UserEquipment, and RecipeEquipment tables we discussed.

#### Day 3 (11/8): Backend DB Connection.
Install ORM (e.g., Entity Framework for C# or Prisma/Sequelize for Node).
Configure the backend's database connection string.
Create one test endpoint: GET /api/health-check that queries the MasterIngredients table and returns a count.

#### Day 4 (11/9): Frontend-Backend Connection.
Configure CORS on your backend to allow requests from your Next.js app's URL (e.g., localhost:3000).
On your Next.js homepage, use useEffect or a server component to call your backend's /api/health-check endpoint.
Display the result on the page (e.g., "Database connection successful! 0 ingredients found.").

#### Day 5-7 (11/10 - 11/12): Buffer & Master Lists.
Catch-up: Use this time for debugging connection issues (they always happen).
Start Core Data: Create the basic backend CRUD endpoints for MasterIngredients and MasterEquipment.
Populate: Manually add 10-20 ingredients and 5-10 equipment items to your master tables so you have data to test with.

### Sprint 2: User Authentication & Pantry (Nov 13 - Nov 19)
Goal: Allow users to sign up, log in, and manage their personal pantry. By 11/19, you should be able to: Log in, add "2 cups of flour" and "1 skillet" to your personal pantry, and see it persist after a page refresh.

#### Day 8-9 (11/13 - 11/14): User Auth Backend.
Implement Users table logic.
Create POST /api/auth/register and POST /api/auth/login endpoints.
Use JWT (JSON Web Tokens) for authentication. The login endpoint should return a token.

#### Day 10 (11/15): User Auth Frontend.
Create Login and Register pages in Next.js.
Implement token storage (e.g., in httpOnly cookies or local storage) and a global auth context.

#### Day 11 (11/16): Pantry Backend.
Secure your endpoints. All pantry routes should require a valid JWT.
Implement UserPantry and UserEquipment CRUD endpoints:
GET /api/pantry (gets my items)
POST /api/pantry (adds an item to my pantry, linking user_id and master_ingredient_id)
DELETE /api/pantry/:id

#### Day 12-14 (11/17 - 11/19): Pantry Frontend & Buffer.
Build the "My Pantry" UI page.
It should fetch data from GET /api/pantry and display it.
Include a form/search bar that allows users to find items from the MasterIngredients list and add them to their personal pantry.

### Sprint 3: The AI "Magic" (Nov 20 - Nov 26)
Goal: Generate a recipe by sending the user's pantry to OpenAI. By 11/26, you should be able to: Click a "Generate" button, send your pantry to the AI, and see the raw text of a recipe appear on the screen. (Note: This week includes US Thanksgiving, so plan for fewer workdays).

#### Day 15 (11/20): Generation UI & Endpoint.
Frontend: Create a "Generate" page. Add a button that (for now) just sends the user's pantry data to a new backend endpoint.
Backend: Create POST /api/recipes/generate (make sure it's secured).

#### Day 16-17 (11/21 - 11/22): Prompt Engineering.
Backend: In your generate endpoint, install the OpenAI SDK.
Write the core logic:
Fetch the user's UserPantry and UserEquipment.
Format this data into a clean list.
Build the detailed text prompt (as we discussed in the system design). This is the most important task. Start simple and request JSON output.

#### Day 18 (11/23): AI Call & Response.
Make the actual API call to OpenAI with your prompt.
Get the response back and parse the JSON.
For now, just send this raw JSON object back to the frontend.

#### Day 19-21 (11/24 - 11/26): Display & Buffer.
Frontend: Receive the recipe JSON and render it on the page. Don't worry about saving it yet; just display the title, ingredients, and instructions.
Use the buffer time to refine your prompt. (e.g., "The AI isn't giving me amounts," "The JSON is malformed").

### Sprint 4: Saving & Viewing (The Cookbook) (Nov 27 - Dec 3)
Goal: Persist generated recipes to the database and let users view them. By 12/3, you should be able to: Generate a recipe, see it saved in your "My Cookbook" page, and click it to see the full details.

#### Day 22-23 (11/27 - 11/28): Save-to-DB Logic.
Backend: Modify your POST /api/recipes/generate endpoint.
When you get a valid response from OpenAI, do not send it to the user yet.
First, parse the JSON and save it to your Recipes, Ingredients, and RecipeEquipment tables. Make sure to link the recipe_id correctly in all tables.
Then, send the newly created (and saved) recipe object to the frontend.

#### Day 24 (11/29): Cookbook Backend.
Create the "cookbook" endpoints:
GET /api/recipes (gets a list of all recipes saved by the logged-in user)
GET /api/recipes/:id (gets one specific recipe by its ID)

#### Day 25-26 (11/30 - 12/1): Cookbook Frontend.
Frontend: Create a "My Cookbook" page.
Fetch and display the list from GET /api/recipes as a grid of recipe cards (Title, Image, etc.).

#### Day 27-28 (12/2 - 12/3): Recipe Detail Page & Buffer.
Frontend: Create a dynamic route page: pages/recipes/[recipeId].js.
This page should fetch data from GET /api/recipes/:id and display the full recipe details (ingredients, instructions, prep time, etc.).
Link your "My Cookbook" cards to this page.

### Sprint 5: Advanced Features & Polish (Dec 4 - Dec 10)
Goal: Implement the advanced AI rules and polish the app for your deadline. By 12/10, you should have: A feature-complete project that fulfills all your initial requirements.

#### Day 29-30 (12/4 - 12/5): Advanced AI Features (Prompting).
Frontend: On the "Generate" page, add checkboxes:
Allow 1-2 missing ingredients
Allow substitutes
Backend: Update your prompt engineering logic. Conditionally add rules to your prompt based on these booleans.
e.g., IF (allow_missing): "You may include 1 or 2 common ingredients not on the list."

#### Day 31-32 (12/6 - 12/7): Advanced DB Feature (SubstituteIngredients).
This is for the user-defined substitutes from ERD.
Backend: Implement CRUD endpoints for the SubstituteIngredients table.
Frontend: On the "My Pantry" page, add a UI for a user to link two MasterIngredients (e.g., "I use yogurt for sour cream").
Backend: Update your prompt engineering one last time to include this user-defined list.

#### Day 33-35 (12/8 - 12/10): Final Polish & Buffer.
UI/CSS: Make it look good! This is your chance to clean up the styling.
Bug Hunt: Click through every user flow and fix bugs.
What happens if OpenAI's call fails? (Implement error handling).
What happens if the user is not logged in?