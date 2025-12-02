import IngredientTable from "@/components/ingredientTable";
import AddIngredientsForm from "@/components/ui/add-ingredients-form";
import { GET } from "../api/pantry/route";

async function fetchData() {
  try {
    const response = await GET();
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const page = async () => {
  const data = await fetchData();

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
          <IngredientTable data={data.items} className="w-full" />
        </div>
      </div>
    </>
  );
};

export default page;
