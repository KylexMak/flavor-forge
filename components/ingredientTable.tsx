import { Ingredient } from "@/models/Ingredient";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";

type Props = {
  data: Ingredient[];
  className?: string;
};

function IngredientTable(props: Props) {
  const columns: ColumnDef<Ingredient>[] = [
    {
      header: "Ingredient Name",
      accessorKey: "name",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Unit",
      accessorKey: "unit",
    },
  ];

  let className = props.className ? props.className : "";

  return (
    <div className={className}>
      <DataTable columns={columns} data={props.data} />
    </div>
  );
}

export default IngredientTable;
