import IngredientTable from "@/components/ingredientTable";
import { GET } from "../api/pantry/route";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
      <div className="flex flex-col items-center justify-start min-h-full px-8 mx-auto max-w-full lg:max-w-3/4">
        <h1>Cinnamon Swirl Bread</h1>
        <span className="text-center">
          An easy quick cinnamon swirl bread recipe made from batter with a
          swirl of flavor from cinnamon sugar. Even better the next day for
          breakfast or tea.
        </span>

        <Separator className="my-6" />

        <div className="flex flex-row items-start justify-start w-full gap-4">
          <Card className="flex-1 p-4">
            <div>
              <CardTitle className="mb-4 text-2xl">Ingredients</CardTitle>
              <IngredientTable data={data.ingredients} />
            </div>
          </Card>
          <img
            className="flex-1 w-full h-auto object-cover rounded-md"
            src="https://www.allrecipes.com/thmb/flMX39PAckZCdr7bxYDsuJc6JjY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/23376-cinnamon-swirl-bread-ddmfs-hero-3x4-0811-ce6ebd2d3283478cbf810fb06e87e3d2.jpg"
            alt="Cinnamon Swirl Bread"
          />
        </div>

        <Separator className="my-6" />

        <div className="w-full mb-4">
          <h2 className="text-2xl mb-4">Instructions</h2>
          <div className="space-y-4">
            {data.instructions.map((instruction: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold shrink-0">
                  {index + 1}
                </span>
                <p className="pt-1">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
