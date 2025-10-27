import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/ProductGrid";
import { Product } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const fetchLikedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("liked_products")
        .select("*")
        .order("liked_at", { ascending: false });

      if (error) throw error;

      const products: Product[] = (data || []).map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
        image: item.product_image,
        platform: item.product_platform as "Amazon" | "Flipkart" | "Myntra",
        link: item.product_link,
      }));

      setLikedProducts(products);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gradient-hero)] flex items-center justify-center">
        <p className="text-muted-foreground">Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Favorites</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {likedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg mb-4">No favorites yet</p>
            <Button onClick={() => navigate("/")}>Start Shopping</Button>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-6">Your Liked Products</h2>
            <ProductGrid products={likedProducts} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
