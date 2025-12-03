export async function GET() {
  return Response.json(
    {
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
    },
    { status: 200 }
  );
}
