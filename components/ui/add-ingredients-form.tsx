"use client";

import React from "react";
import { Field, FieldLabel } from "./field";
import { Input } from "./input";
import { Button } from "./button";

function AddIngredientsForm() {
  const [ingredientName, setIngredientName] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [unit, setUnit] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/pantry/add", {
      method: "POST",
    });
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-6 gap-4">
          <Field className="col-span-3">
            <FieldLabel htmlFor="ingredient">Ingredient</FieldLabel>
            <Input
              id="ingredient"
              type="text"
              value={ingredientName}
              placeholder="Enter Ingredient Name"
              onChange={(e) => setIngredientName(e.target.value)}
              required
            />
          </Field>
          <Field className="col-span-1">
            <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              placeholder="Enter amount"
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Field>
          <Field className="col-span-2">
            <FieldLabel htmlFor="unit">Unit</FieldLabel>
            <Input
              id="unit"
              type="string"
              value={unit}
              placeholder="Enter unit (e.g. cups, grams)"
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </Field>
        </div>
        <Field orientation="horizontal" className="justify-center">
          <Button className="mt-5 w-full" type="submit">
            Add Ingredient
          </Button>
        </Field>
      </form>
    </div>
  );
}

export default AddIngredientsForm;
