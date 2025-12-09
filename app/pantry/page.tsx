import IngredientTable from "@/components/ingredientTable";
import AddIngredientsForm from "@/components/ui/add-ingredients-form";
import { GET } from "../api/pantry/route";

async function fetchData() {
  try {
    const response = await GET();
    
    // 1. Log the status to debug
    if (!response.ok) {
        console.error("GET Request failed with status:", response.status);
    }
    
    const result = await response.json();

    console.log("FIRST INGREDIENT:", result.ingredients[0]);
    
    // 2. Log the actual result to see if it's an error object
    console.log("Fetch Result:", result); 

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null explicitly on crash
  }
}

const page = async () => {
  const data = await fetchData();

  // 3. SAFEGUARD: Default to empty array if data or ingredients are missing
  const ingredients = data?.ingredients || [];

  return (
    <>
      <div className="flex flex-col items-center justify-top min-h-full mx-8">
        <h1>Pantry</h1>
        <span className="text-center">
          Welcome to your pantry! The ingredients shown will tell us what you
          have at home. Please enter all ingredients you wish to be considered.
        </span>
        <div className="flex flex-col items-center">
          <AddIngredientsForm />
          
          {/* 4. Pass the safe 'ingredients' variable */}
          <IngredientTable data={ingredients} className="w-full py-10" />
        </div>
      </div>
    </>
  );
};

export default page;