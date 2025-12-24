#!/bin/bash

echo "🎮 Setting up Venus Vacation PRISM Frontend..."

# Create Next.js project
npx create-next-app@latest venus-prism-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd venus-prism-frontend

# Install additional dependencies
npm install framer-motion @tanstack/react-query swiper react-player gsap lucide-react

# Install dev dependencies
npm install -D @types/gsap

# Create project structure
mkdir -p src/components/{Hero,Characters,Movies,Story,Products,Layout}
mkdir -p src/hooks src/services src/types src/lib

# Create basic component files
cat > src/components/Hero/HeroSection.tsx << 'EOF'
'use client';

import { motion } from 'framer-motion';
import { PlatformBadges } from './PlatformBadges';
import { FloatingBuyButton } from './FloatingBuyButton';

export function HeroSection() {
  return (
    <motion.section 
      className="relative h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Venus Vacation PRISM
        </motion.h1>
        
        <PlatformBadges />
        <FloatingBuyButton />
      </div>
    </motion.section>
  );
}
EOF

cat > src/components/Hero/PlatformBadges.tsx << 'EOF'
'use client';

import { motion } from 'framer-motion';

const platforms = [
  { name: 'PlayStation 5', icon: '🎮', color: 'from-blue-500 to-blue-700' },
  { name: 'PlayStation 4', icon: '🎮', color: 'from-blue-400 to-blue-600' },
  { name: 'Steam', icon: '💻', color: 'from-gray-500 to-gray-700' },
];

export function PlatformBadges() {
  return (
    <motion.div 
      className="flex justify-center gap-4 mb-8"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {platforms.map((platform, index) => (
        <motion.div
          key={platform.name}
          className={`px-6 py-3 rounded-full bg-gradient-to-r ${platform.color} backdrop-blur-sm border border-white/20`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
        >
          <span className="text-lg">{platform.icon}</span>
          <span className="ml-2 font-semibold">{platform.name}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
EOF

cat > src/components/Hero/FloatingBuyButton.tsx << 'EOF'
'use client';

import { motion } from 'framer-motion';

export function FloatingBuyButton() {
  return (
    <motion.button
      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{ 
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      Buy Now
    </motion.button>
  );
}
EOF

# Create API service
cat > src/services/api.ts << 'EOF'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async getCharacters() {
    return this.request('/characters');
  }

  static async getCharacter(id: string) {
    return this.request(`/characters/${id}`);
  }

  static async getProducts() {
    return this.request('/products');
  }

  static async getStoryContent() {
    return this.request('/content/story');
  }

  static async getMovies() {
    return this.request('/content/movies');
  }
}
EOF

# Update main layout
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Venus Vacation PRISM',
  description: 'Experience the ultimate beach paradise adventure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
EOF

# Update main page
cat > src/app/page.tsx << 'EOF'
import { HeroSection } from '@/components/Hero/HeroSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      {/* Other sections will be added here */}
    </main>
  );
}
EOF

# Add custom CSS for animations
cat >> src/app/globals.css << 'EOF'

/* Custom animations and effects */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
  50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); }
}

.floating {
  animation: float 3s ease-in-out infinite;
}

.glowing {
  animation: glow 2s ease-in-out infinite;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ec4899, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #f472b6, #a855f7);
}
EOF

echo "✅ Venus Vacation PRISM Frontend setup complete!"
echo ""
echo "Next steps:"
echo "1. cd venus-prism-frontend"
echo "2. npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "🎨 Your enhanced frontend is ready for development!"
EOF

chmod +x setup-venus-prism-frontend.sh