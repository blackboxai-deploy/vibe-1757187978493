"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MessageSquare, Heart, Lightbulb, Vote } from "lucide-react";

const navigationItems = [
  {
    name: "Beranda",
    href: "/",
    icon: MessageSquare,
    description: "Halaman utama"
  },
  {
    name: "Kritik & Saran",
    href: "/kritik-saran",
    icon: MessageSquare,
    description: "Sampaikan kritik dan saran"
  },
  {
    name: "Curhat",
    href: "/curhat",
    icon: Heart,
    description: "Berbagi cerita dan perasaan"
  },
  {
    name: "Ide & Opini",
    href: "/ide-opini",
    icon: Lightbulb,
    description: "Bagikan ide dan pendapat"
  },
  {
    name: "Voting",
    href: "/voting",
    icon: Vote,
    description: "Buat dan ikuti voting"
  }
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-sage-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-sage-400 to-lavender-400">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sage-600 to-lavender-600 bg-clip-text text-transparent">
              Pqsaaay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`
                      relative px-4 py-2 rounded-full transition-all duration-300
                      ${isActive 
                        ? "bg-gradient-to-r from-sage-400 to-lavender-400 text-white shadow-lg" 
                        : "text-gray-600 hover:text-sage-600 hover:bg-sage-50"
                      }
                    `}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-sage-600">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-gradient-to-b from-white to-sage-50">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-sage-400 to-lavender-400">
                      <span className="text-lg font-bold text-white">P</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-sage-600 to-lavender-600 bg-clip-text text-transparent">
                      Pqsaaay
                    </span>
                  </div>
                  
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300
                          ${isActive 
                            ? "bg-gradient-to-r from-sage-400 to-lavender-400 text-white shadow-lg" 
                            : "text-gray-600 hover:bg-white hover:shadow-md"
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className={`text-sm ${isActive ? "text-white/80" : "text-gray-400"}`}>
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}