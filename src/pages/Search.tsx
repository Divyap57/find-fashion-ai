import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/ProductGrid";
import { PriceFilter } from "@/components/PriceFilter";
import { Product } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const imageData = location.state?.imageData;
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!imageData) return;

    const searchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.functions.invoke('search-products', {
          body: { imageData }
        });

        if (error) throw error;

        if (data?.products) {
          const transformedProducts: Product[] = data.products.map((item: any) => ({
            id: item.id,
            name: item.title,
            price: item.price,
            image: item.image,
            platform: item.platform,
            link: item.link,
          }));
          
          setProducts(transformedProducts);
          setSearchQuery(data.searchQuery || "");

          // Save to search history
          if (user) {
            await supabase.from("search_history").insert({
              user_id: user.id,
              image_data: imageData,
              search_query: data.searchQuery || "",
            });
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Failed",
          description: "Could not find products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [imageData, toast, user]);

  const filteredProducts = products;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user || !imageData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold">Search Results</h1>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="mb-6">
              <img
                src={imageData}
                alt="Uploaded"
                className="w-full rounded-xl shadow-[var(--shadow-card)]"
              />
            </div>
          </aside>

          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Similar Products</h2>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mb-1">
                  AI Search: "{searchQuery}"
                </p>
              )}
              <p className="text-muted-foreground">
                Found {filteredProducts.length} products matching your search
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
