import IngredientTable from "@/components/ingredientTable";
import { GET } from "../api/pantry/route";
import { Separator } from "@/components/ui/separator";

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
        <h1>Cinnamon Swirl Bread</h1>
        <span className="text-center">
          An easy quick cinnamon swirl bread recipe made from batter with a
          swirl of flavor from cinnamon sugar. Even better the next day for
          breakfast or tea.
        </span>
        <Separator />
        <div className="flex flex-col items-center">
          <IngredientTable data={data.items} className="w-full" />
        </div>
      </div>
    </>
  );
};

export default page;
