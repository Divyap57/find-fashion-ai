import { useState, useEffect } from "react";
import { ExternalLink, Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  platform: "Amazon" | "Flipkart" | "Myntra";
  link: string;
}

interface ProductCardProps {
  product: Product;
}

const platformColors = {
  Amazon: "bg-[#FF9900] text-white",
  Flipkart: "bg-[#2874F0] text-white",
  Myntra: "bg-[#FF3F6C] text-white",
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    checkLikedStatus();
    checkCartStatus();
  }, [product.id]);

  const checkLikedStatus = async () => {
    try {
      const { data } = await supabase
        .from("liked_products")
        .select("id")
        .eq("product_id", product.id)
        .maybeSingle();

      setIsLiked(!!data);
    } catch (error) {
      console.error("Error checking liked status:", error);
    }
  };

  const checkCartStatus = async () => {
    try {
      const { data } = await supabase
        .from("cart_items")
        .select("id")
        .eq("product_id", product.id)
        .maybeSingle();

      setIsInCart(!!data);
    } catch (error) {
      console.error("Error checking cart status:", error);
    }
  };

  const toggleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isLiked) {
        const { error } = await supabase
          .from("liked_products")
          .delete()
          .eq("product_id", product.id)
          .eq("user_id", user.id);

        if (error) throw error;
        setIsLiked(false);
        toast({ title: "Removed from favorites" });
      } else {
        const { error } = await supabase.from("liked_products").insert({
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image,
          product_platform: product.platform,
          product_link: product.link,
        });

        if (error) throw error;
        setIsLiked(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const addToCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isInCart) {
        toast({ title: "Already in cart" });
        return;
      }

      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        product_platform: product.platform,
        product_link: product.link,
      });

      if (error) throw error;
      setIsInCart(true);
      toast({ title: "Added to cart" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur"
          onClick={toggleLike}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 min-h-[3rem]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-2xl font-bold text-primary">{product.price}</p>
          <Badge className={platformColors[product.platform]}>
            {product.platform}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => window.open(product.link, "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button variant="default" onClick={addToCart} disabled={isInCart}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isInCart ? "In Cart" : "Add"}
        </Button>
      </CardFooter>
    </Card>
  );
};
