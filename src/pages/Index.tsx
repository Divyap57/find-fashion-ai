import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { WebcamCapture } from "@/components/WebcamCapture";
import { Search, LogOut, ShoppingCart, Heart } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSearch = (imageData: string) => {
    navigate("/search", { state: { imageData } });
  };

  const handleImageUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSearch(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleWebcamCapture = (imageData: string) => {
    setCapturedImage(imageData);
    handleSearch(imageData);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      {/* Header with Navigation */}
      <header className="container mx-auto px-4 py-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={() => navigate("/cart")} className="gap-2">
          <ShoppingCart className="w-4 h-4" />
          Cart
        </Button>
        <Button variant="ghost" onClick={() => navigate("/favorites")} className="gap-2">
          <Heart className="w-4 h-4" />
          Favorites
        </Button>
        <Button variant="ghost" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-300">
              <Search className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            TagHunt
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Find Your Perfect Fashion Match
          </p>
          
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Upload a photo or snap one to discover similar products from top e-commerce platforms
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="upload" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
            <TabsTrigger value="upload" className="text-base">
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="camera" className="text-base">
              Use Camera
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-8">
            <ImageUploader
              onImageSelect={setSelectedFile}
              onSearchClick={handleImageUpload}
            />
          </TabsContent>
          
          <TabsContent value="camera" className="mt-8">
            <WebcamCapture onCapture={handleWebcamCapture} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card border hover:shadow-[var(--shadow-card)] transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Visual Search</h3>
            <p className="text-muted-foreground text-sm">
              Find products by uploading images or taking photos
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card border hover:shadow-[var(--shadow-card)] transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-3xl">🛍️</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Multi-Platform</h3>
            <p className="text-muted-foreground text-sm">
              Search across Amazon, Flipkart, and Myntra
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card border hover:shadow-[var(--shadow-card)] transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Price Compare</h3>
            <p className="text-muted-foreground text-sm">
              Filter and compare prices to find the best deals
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
