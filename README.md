# Find-Fashion-AI- Visual Fashion Search Platform

Find your perfect fashion match by uploading images or taking photos to discover similar products from top e-commerce platforms.

## 🎯 Features

- **Visual Search**: Upload images or use your camera to find similar fashion items
- **Multi-Platform Results**: Search across Amazon, Flipkart, and Myntra
- **Smart Filtering**: Filter products by price range
- **Responsive Design**: Beautiful UI that works on desktop and mobile
- **Real-time Camera**: Take photos directly from your device

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for modern styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Lucide Icons** for beautiful icons

### Backend (Setup Required)
- **Lovable Cloud** (Supabase Edge Functions)
- **E-commerce APIs**: Amazon, Flipkart, Myntra
- See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed instructions

## 📦 Project Structure

```
taghunt/
├── src/
│   ├── assets/              # Images and static files
│   ├── components/          # React components
│   │   ├── ui/             # shadcn UI components
│   │   ├── ImageUploader.tsx
│   │   ├── WebcamCapture.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── PriceFilter.tsx
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Homepage
│   │   ├── Search.tsx      # Search results
│   │   └── NotFound.tsx    # 404 page
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles & design system
├── index.html
├── tailwind.config.ts      # Tailwind configuration
├── vite.config.ts          # Vite configuration
├── BACKEND_SETUP.md        # Backend setup guide
└── README.md               # This file
```

## 🎨 Design System

The app uses a sophisticated design system defined in `src/index.css`:

- **Primary Color**: Deep indigo (#4F46E5) for sophistication
- **Accent Color**: Vibrant coral (#FF6B6B) for CTAs
- **Gradients**: Custom CSS variables for depth
- **Shadows**: Elegant shadows for cards and interactions
- **Animations**: Smooth transitions using cubic-bezier

All colors use HSL format for easy theming and dark mode support.

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd taghunt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 🌐 Setting Up Backend

The current implementation uses mock data. To connect to real e-commerce APIs:

1. **Enable Lovable Cloud** (recommended)
   - Click "Connect Lovable Cloud" in your project
   - Follow the setup wizard

2. **Follow Backend Setup Guide**
   - See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed instructions
   - Configure API keys as secrets
   - Deploy edge functions

## 📱 Features Overview

### Homepage (`/`)
- Hero section with branding
- Dual upload options (file upload or camera)
- Feature highlights
- Responsive tabs for different input methods

### Search Results (`/search`)
- Grid layout of similar products
- Price range filter
- Product cards with:
  - Product image
  - Name and description
  - Price
  - Platform badge
  - External link to buy

### Components

#### ImageUploader
- Drag-and-drop support
- File preview
- Clear image option
- Hover states and animations

#### WebcamCapture
- Camera access
- Real-time video preview
- Capture button
- Permission handling

#### ProductCard
- Hover effects
- Platform badges
- Price display
- External link button

#### PriceFilter
- Dual-range slider
- Real-time filtering
- Min/max display

## 🎯 Usage

1. **Upload an Image**
   - Click "Choose File" or drag & drop
   - Preview appears
   - Click "Find Similar Products"

2. **Use Camera**
   - Switch to "Use Camera" tab
   - Grant camera permissions
   - Point at item and capture
   - Automatically searches

3. **Browse Results**
   - View grid of similar products
   - Adjust price filter
   - Click "View Product" to buy

## 🚢 Deployment

### Frontend Deployment

**Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Backend Deployment
- **Lovable Cloud**: Automatic deployment
- **Custom Backend**: Railway, Render, or Heroku

## 🔐 Environment Variables

For backend integration, configure these secrets in Lovable Cloud:

```
AMAZON_ACCESS_KEY=your_key_here
AMAZON_SECRET_KEY=your_secret_here
FLIPKART_AFFILIATE_ID=your_id_here
RAPIDAPI_KEY=your_key_here
```

## 🎨 Customization

### Colors
Edit `src/index.css` to change the design system:
```css
:root {
  --primary: 237 58% 59%;  /* Indigo */
  --accent: 6 90% 70%;     /* Coral */
  /* Add custom colors */
}
```

### Components
All components use the design system tokens:
```tsx
<Button variant="hero">Click Me</Button>
```

## 📝 API Integration

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for:
- Setting up e-commerce APIs
- Creating edge functions
- Frontend-backend integration
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **shadcn/ui** for the component library
- **Lucide** for icons
- **Tailwind CSS** for styling
- **Lovable** for the development platform

## 📞 Support

For issues or questions:
- Check [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- Review Lovable documentation
- Open an issue on GitHub

---

Built with ❤️ using [Lovable](https://lovable.dev)
