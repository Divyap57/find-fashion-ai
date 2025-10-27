# TagHunt Backend Setup Guide

## Overview
This document explains how to set up the backend for TagHunt's visual search functionality.

## Architecture

### Frontend (Current Implementation)
- React + TypeScript + Vite
- Image upload and webcam capture
- Product display and filtering
- Responsive design with Tailwind CSS

### Backend (To Be Implemented)

#### Option 1: Lovable Cloud (Recommended)
Lovable Cloud provides serverless edge functions powered by Supabase for handling:
- Image uploads
- API integration with e-commerce platforms
- Response processing

**Setup Steps:**
1. Enable Lovable Cloud in your project
2. Create edge functions for API integration
3. Configure secrets for API keys

#### Option 2: Custom Node.js Backend
Alternative setup using Express.js:
- API routes for image processing
- Integration with e-commerce APIs
- CORS configuration

---

## E-Commerce API Integration

### Required APIs

#### 1. Amazon Product Advertising API
- **URL**: https://webservices.amazon.com/paapi5/documentation/
- **Requirements**: Amazon Associates account
- **Features**: Product search, pricing, images

#### 2. Flipkart Affiliate API
- **URL**: https://affiliate.flipkart.com/api-docs
- **Requirements**: Flipkart Affiliate account
- **Features**: Product catalog access

#### 3. Myntra API
- **Note**: No official public API
- **Alternative**: Use web scraping (be mindful of ToS) or third-party APIs

#### 4. RapidAPI (For Demo/Testing)
- **URL**: https://rapidapi.com/
- **Alternatives**:
  - Amazon Product Details API
  - Shopping API by Apilayer
  - Product Search API

---

## Lovable Cloud Edge Function Example

### 1. Create Edge Function: `search-products`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    // In production, implement:
    // 1. Image analysis/similarity search
    // 2. Call e-commerce APIs
    // 3. Process and normalize results
    
    // For now, return mock data
    const products = [
      {
        id: "1",
        name: "Product Name",
        price: 2999,
        image: "https://example.com/image.jpg",
        platform: "Amazon",
        link: "https://amazon.in/product"
      }
    ];

    return new Response(
      JSON.stringify({ products }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

### 2. Configure Secrets
Store API keys securely:
- `AMAZON_ACCESS_KEY`
- `AMAZON_SECRET_KEY`
- `FLIPKART_AFFILIATE_ID`
- `RAPIDAPI_KEY`

---

## Frontend Integration

### Update Search.tsx to call backend:

```typescript
const searchProducts = async (imageData: string) => {
  setIsLoading(true);
  try {
    const response = await fetch('YOUR_EDGE_FUNCTION_URL/search-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData })
    });
    
    const data = await response.json();
    setProducts(data.products);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to search products",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};
```

---

## Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Backend Deployment
- **Lovable Cloud**: Automatic deployment
- **Custom Backend**: Use Railway, Render, or Heroku

---

## Future Enhancements

1. **AI-Powered Visual Search**
   - Use Google Vision API or AWS Rekognition
   - Implement similarity scoring

2. **Database Integration**
   - Store search history
   - User favorites/wishlists
   - Product caching

3. **Authentication**
   - User accounts
   - Saved searches
   - Personalized recommendations

4. **Advanced Filtering**
   - Color detection
   - Style matching
   - Brand preferences

---

## Testing APIs

Use these tools for testing:
- **Postman**: API testing
- **Insomnia**: Alternative API client
- **RapidAPI Hub**: Test available APIs

---

## Support

For issues or questions about:
- **Lovable Cloud**: Check Lovable docs
- **API Integration**: Refer to respective API documentation
- **General Setup**: Review this guide

---

**Note**: This is a starter template. In production, implement proper:
- Error handling
- Rate limiting
- Caching
- Image optimization
- Security measures
