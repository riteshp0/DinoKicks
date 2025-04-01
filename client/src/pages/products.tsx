import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Filter, SlidersHorizontal, GridIcon, ListIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@shared/schema";

const Products = () => {
  const [category] = useParams();
  const [location] = useLocation();
  const [gridView, setGridView] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({
    collections: [] as string[],
    colors: [] as string[],
    priceRange: [0, 200],
  });

  // Get products data
  const { data: allProducts, isLoading, error } = useQuery({
    queryKey: [category ? `/api/categories/${category}` : "/api/products"],
  });

  const searchParams = new URLSearchParams(location.split("?")[1]);
  const badge = searchParams.get("badge");

  // Filter and sort products
  const filteredProducts = allProducts
    ? allProducts
        .filter((product: Product) => {
          // Filter by badge if provided in URL
          if (badge && product.badge !== badge) {
            return false;
          }

          // Filter by collections
          if (
            filters.collections.length > 0 &&
            !filters.collections.includes(product.collection)
          ) {
            return false;
          }

          // Filter by price range
          if (
            product.price < filters.priceRange[0] ||
            product.price > filters.priceRange[1]
          ) {
            return false;
          }

          // Filter by colors
          if (
            filters.colors.length > 0 &&
            !product.colors.some((color) => filters.colors.includes(color))
          ) {
            return false;
          }

          return true;
        })
        // Sort products
        .sort((a: Product, b: Product) => {
          switch (sortBy) {
            case "price-low":
              return a.price - b.price;
            case "price-high":
              return b.price - a.price;
            case "name-asc":
              return a.name.localeCompare(b.name);
            case "name-desc":
              return b.name.localeCompare(a.name);
            default:
              return a.isFeatured ? -1 : 1;
          }
        })
    : [];

  // Handle filter changes
  const handleFilterChange = (type: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Toggle filter values in arrays
  const toggleFilter = (type: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[type as keyof typeof prev] as string[];
      return {
        ...prev,
        [type]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      collections: [],
      colors: [],
      priceRange: [0, 200],
    });
    setSortBy("featured");
  };

  // Generate skeleton cards for loading state
  const skeletonCards = Array(8)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
        <Skeleton className="h-64 w-full" />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex space-x-2 mb-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    ));

  // Get page title
  const getPageTitle = () => {
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
    }
    if (badge) {
      return `${badge} Products`;
    }
    return "All Products";
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | Dino Kicks</title>
        <meta
          name="description"
          content={`Browse our collection of ${getPageTitle().toLowerCase()} at Dino Kicks - Prehistoric Kicks for Modern Feet.`}
        />
      </Helmet>

      <div className="bg-gradient-to-r from-[#2D3436] to-[#008080] py-10 px-4">
        <div className="container mx-auto">
          <h1 className="font-['Righteous',_cursive] text-3xl md:text-5xl text-white text-center">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down your dinosaur kicks search
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <Accordion type="single" collapsible defaultValue="collections">
                    <AccordionItem value="collections">
                      <AccordionTrigger>Collections</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="raptor-series-mobile"
                              checked={filters.collections.includes("Raptor Series")}
                              onCheckedChange={() =>
                                toggleFilter("collections", "Raptor Series")
                              }
                            />
                            <Label htmlFor="raptor-series-mobile">Raptor Series</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="t-rex-line-mobile"
                              checked={filters.collections.includes("T-Rex Line")}
                              onCheckedChange={() =>
                                toggleFilter("collections", "T-Rex Line")
                              }
                            />
                            <Label htmlFor="t-rex-line-mobile">T-Rex Line</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="herbivore-collection-mobile"
                              checked={filters.collections.includes(
                                "Herbivore Collection"
                              )}
                              onCheckedChange={() =>
                                toggleFilter("collections", "Herbivore Collection")
                              }
                            />
                            <Label htmlFor="herbivore-collection-mobile">
                              Herbivore Collection
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="flying-dinosaurs-mobile"
                              checked={filters.collections.includes("Flying Dinosaurs")}
                              onCheckedChange={() =>
                                toggleFilter("collections", "Flying Dinosaurs")
                              }
                            />
                            <Label htmlFor="flying-dinosaurs-mobile">
                              Flying Dinosaurs
                            </Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="colors">
                      <AccordionTrigger>Colors</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="neon-green-mobile"
                              checked={filters.colors.includes("#39FF14")}
                              onCheckedChange={() => toggleFilter("colors", "#39FF14")}
                            />
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: "#39FF14" }}
                            ></div>
                            <Label htmlFor="neon-green-mobile">Neon Green</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="volcanic-orange-mobile"
                              checked={filters.colors.includes("#FF5714")}
                              onCheckedChange={() => toggleFilter("colors", "#FF5714")}
                            />
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: "#FF5714" }}
                            ></div>
                            <Label htmlFor="volcanic-orange-mobile">
                              Volcanic Orange
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="deep-teal-mobile"
                              checked={filters.colors.includes("#008080")}
                              onCheckedChange={() => toggleFilter("colors", "#008080")}
                            />
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: "#008080" }}
                            ></div>
                            <Label htmlFor="deep-teal-mobile">Deep Teal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="jungle-green-mobile"
                              checked={filters.colors.includes("#2E8B57")}
                              onCheckedChange={() => toggleFilter("colors", "#2E8B57")}
                            />
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: "#2E8B57" }}
                            ></div>
                            <Label htmlFor="jungle-green-mobile">Jungle Green</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fossil-beige-mobile"
                              checked={filters.colors.includes("#D2B48C")}
                              onCheckedChange={() => toggleFilter("colors", "#D2B48C")}
                            />
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: "#D2B48C" }}
                            ></div>
                            <Label htmlFor="fossil-beige-mobile">Fossil Beige</Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            {/* Grid/List View Toggle */}
            <div className="hidden md:flex border rounded-md">
              <Button
                variant={gridView ? "default" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setGridView(true)}
              >
                <GridIcon className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <Button
                variant={!gridView ? "default" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setGridView(false)}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product count */}
          <div className="text-gray-600">
            {isLoading ? (
              <span>Loading products...</span>
            ) : (
              <span>
                Showing {filteredProducts.length} of {allProducts?.length || 0}{" "}
                products
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-1/4 min-w-[250px]">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-['Righteous',_cursive] text-xl flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </h2>
                <Button
                  variant="link"
                  className="text-sm text-[#FF5714]"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>

              <Accordion type="multiple" defaultValue={["collections", "colors"]}>
                <AccordionItem value="collections">
                  <AccordionTrigger>Collections</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="raptor-series"
                          checked={filters.collections.includes("Raptor Series")}
                          onCheckedChange={() =>
                            toggleFilter("collections", "Raptor Series")
                          }
                        />
                        <Label htmlFor="raptor-series">Raptor Series</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="t-rex-line"
                          checked={filters.collections.includes("T-Rex Line")}
                          onCheckedChange={() =>
                            toggleFilter("collections", "T-Rex Line")
                          }
                        />
                        <Label htmlFor="t-rex-line">T-Rex Line</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="herbivore-collection"
                          checked={filters.collections.includes(
                            "Herbivore Collection"
                          )}
                          onCheckedChange={() =>
                            toggleFilter("collections", "Herbivore Collection")
                          }
                        />
                        <Label htmlFor="herbivore-collection">
                          Herbivore Collection
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="flying-dinosaurs"
                          checked={filters.collections.includes("Flying Dinosaurs")}
                          onCheckedChange={() =>
                            toggleFilter("collections", "Flying Dinosaurs")
                          }
                        />
                        <Label htmlFor="flying-dinosaurs">Flying Dinosaurs</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="colors">
                  <AccordionTrigger>Colors</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="neon-green"
                          checked={filters.colors.includes("#39FF14")}
                          onCheckedChange={() => toggleFilter("colors", "#39FF14")}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: "#39FF14" }}
                        ></div>
                        <Label htmlFor="neon-green">Neon Green</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="volcanic-orange"
                          checked={filters.colors.includes("#FF5714")}
                          onCheckedChange={() => toggleFilter("colors", "#FF5714")}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: "#FF5714" }}
                        ></div>
                        <Label htmlFor="volcanic-orange">Volcanic Orange</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="deep-teal"
                          checked={filters.colors.includes("#008080")}
                          onCheckedChange={() => toggleFilter("colors", "#008080")}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: "#008080" }}
                        ></div>
                        <Label htmlFor="deep-teal">Deep Teal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="jungle-green"
                          checked={filters.colors.includes("#2E8B57")}
                          onCheckedChange={() => toggleFilter("colors", "#2E8B57")}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: "#2E8B57" }}
                        ></div>
                        <Label htmlFor="jungle-green">Jungle Green</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fossil-beige"
                          checked={filters.colors.includes("#D2B48C")}
                          onCheckedChange={() => toggleFilter("colors", "#D2B48C")}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: "#D2B48C" }}
                        ></div>
                        <Label htmlFor="fossil-beige">Fossil Beige</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Error loading products</h3>
                <p className="text-gray-600">
                  There was a problem fetching the products. Please try again later.
                </p>
              </div>
            ) : isLoading ? (
              <div
                className={
                  gridView
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {skeletonCards}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  gridView
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {filteredProducts.map((product: Product) => (
                  <div key={product.id}>
                    {gridView ? (
                      <ProductCard product={product} />
                    ) : (
                      <div className="flex bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
                        <div className="w-1/3">
                          <img
                            className="w-full h-full object-cover"
                            src={product.imageUrl}
                            alt={product.name}
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-['Righteous',_cursive] text-lg">
                              {product.name}
                            </h3>
                            <span className="font-bold text-[#FF5714]">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {product.description}
                          </p>
                          <div className="flex space-x-2 mb-4">
                            {product.colors.map((color) => (
                              <span
                                key={color}
                                className="w-6 h-6 rounded-full cursor-pointer border-2 border-transparent hover:border-[#2D3436]"
                                style={{ backgroundColor: color }}
                              ></span>
                            ))}
                          </div>
                          <Button
                            className="w-full py-2 bg-[#2D3436] text-white font-['Righteous',_cursive] rounded-lg hover:bg-[#39FF14] hover:text-[#2D3436] transition flex items-center justify-center space-x-2"
                            onClick={() => {
                              // Add to cart functionality
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>ADD TO CART</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
