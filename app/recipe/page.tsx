import IngredientTable from "@/components/ingredientTable";
import { GET } from "../api/pantry/route";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

async function fetchData() {
  return {
    ingredients: [
      { id: 1, name: "Flour", quantity: 2, unit: "cups" },
      { id: 2, name: "White Sugar", quantity: 1.33, unit: "cups" },
      { id: 3, name: "Ground Cinnamon", quantity: 2, unit: "teaspoons" },
      { id: 4, name: "Baking Powder", quantity: 1, unit: "tablespoon" },
      { id: 5, name: "Salt", quantity: 0.5, unit: "teaspoons" },
      { id: 6, name: "Large Egg", quantity: 1, unit: "" },
      { id: 7, name: "Milk", quantity: 1, unit: "cups" },
      { id: 8, name: "Vegetable Oil", quantity: 0.33, unit: "cups" },
    ],
    instructions: [
      "Preheat your oven to 350°F (175°C). Grease and flour a 9x5-inch loaf pan.",
      "Mix together 1/3 cup sugar and 2 teaspoons cinnamon in a small bowl; set aside.",
      "Combine flour, remaining 1 cup sugar, baking powder, and salt together in a large bowl. Combine egg, milk, and oil in a separate bowl; add to flour mixture. Stir until just moistened.",
      "Pour 1/2 of the batter into the prepared pan. Sprinkle with 1/2 of the reserved cinnamon-sugar mixture. Repeat with remaining batter and cinnamon-sugar mixture. Draw a knife through batter to marble.",
      "Bake in the preheated oven until a toothpick inserted into the center of the loaf comes out clean, 45 to 50 minutes.",
      "Let cool in the pan for 10 minutes before removing to a wire rack to cool completely. Wrap in foil and let sit overnight before slicing.",
    ],
  };
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
              <IngredientTable data={data.ingredients} showActions={false} />
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
