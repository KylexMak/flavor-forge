"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ingredient } from "@/models/Ingredient";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import { EditIcon, TrashIcon } from "lucide-react";

// 1. Existing Dialog imports (For Editing)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// 2. NEW Alert Dialog imports (For Deleting)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  data: Ingredient[];
  className?: string;
  showActions?: boolean;
};

function IngredientTable(props: Props) {
  const showActions = props.showActions ?? true;
  const router = useRouter();

  // State for EDITING
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );

  // State for DELETING [New]
  const [ingredientToDelete, setIngredientToDelete] = useState<number | null>(
    null
  );

  // --- SAVE (Edit) ---
  const saveChanges = async () => {
    if (!editingIngredient) return;

    try {
      const response = await fetch("/api/pantry/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingIngredient),
      });

      if (response.ok) {
        setEditingIngredient(null);
        router.refresh();
      } else {
        console.error("Failed to update");
      }
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  };

  // --- DELETE LOGIC ---

  // 1. User clicks the trash icon -> Opens the popup
  const handleDeleteClick = (ingredientId: number) => {
    setIngredientToDelete(ingredientId);
  };

  // 2. User clicks "Continue" in the popup -> Calls API
  const confirmDelete = async () => {
    if (!ingredientToDelete) return;

    try {
      const response = await fetch(
        `/api/pantry/delete?id=${ingredientToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setIngredientToDelete(null); // Close popup
        router.refresh(); // Refresh table
      } else {
        console.error("Failed to delete ingredient");
      }
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
  };

  const columns: ColumnDef<Ingredient>[] = [
    { header: "Ingredient Name", accessorKey: "name" },
    { header: "Quantity", accessorKey: "quantity" },
    { header: "Unit", accessorKey: "unit" },
  ];

  if (showActions) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ingredient = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(ingredient)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(ingredient.id)} // Trigger the popup
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        );
      },
    });
  }

  const className = props.className ? props.className : "";

  return (
    <div className={className}>
      <DataTable columns={columns} data={props.data} />

      {/* --- EDIT DIALOG --- */}
      <Dialog
        open={!!editingIngredient}
        onOpenChange={(open) => {
          if (!open) setEditingIngredient(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Ingredient</DialogTitle>
          </DialogHeader>
          {editingIngredient && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveChanges();
              }}
              className="flex flex-col gap-4"
            >
              {/* (Existing inputs remain unchanged) */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editingIngredient.name}
                  onChange={(e) =>
                    setEditingIngredient({
                      ...editingIngredient,
                      name: e.target.value,
                    })
                  }
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={editingIngredient.quantity}
                    onChange={(e) =>
                      setEditingIngredient({
                        ...editingIngredient,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    value={editingIngredient.unit}
                    onChange={(e) =>
                      setEditingIngredient({
                        ...editingIngredient,
                        unit: e.target.value,
                      })
                    }
                    className="border p-2 w-full rounded"
                  />
                </div>
              </div>

              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setEditingIngredient(null)}
                  className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-800 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Changes
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION ALERT DIALOG --- */}
      <AlertDialog
        open={!!ingredientToDelete}
        onOpenChange={() => setIngredientToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              ingredient from your pantry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default IngredientTable;
