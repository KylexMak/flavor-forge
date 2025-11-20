export async function GET() {
    return Response.json(
        {
            items: [
                { id: 1, name: "Flour", quantity: 2, unit: "cups" },
                { id: 2, name: "Sugar", quantity: 1, unit: "cups" },
                { id: 3, name: "Salt", quantity: 0.5, unit: "teaspoons" },
            ]
        }, { status: 200 });
}