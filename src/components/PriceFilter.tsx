import { useState } from "react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (range: [number, number]) => void;
}

export const PriceFilter = ({
  minPrice,
  maxPrice,
  onPriceChange,
}: PriceFilterProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const handleChange = (values: number[]) => {
    const range: [number, number] = [values[0], values[1]];
    setPriceRange(range);
    onPriceChange(range);
  };

  return (
    <div className="space-y-4 p-6 bg-card rounded-xl border shadow-sm">
      <Label className="text-base font-semibold">Price Range</Label>
      <div className="flex justify-between text-sm text-muted-foreground mb-4">
        <span>₹{priceRange[0].toLocaleString()}</span>
        <span>₹{priceRange[1].toLocaleString()}</span>
      </div>
      <Slider
        min={minPrice}
        max={maxPrice}
        step={100}
        value={priceRange}
        onValueChange={handleChange}
        className="w-full"
      />
    </div>
  );
};
