import React from "react";
import { Link } from "wouter";
import { SiX, SiInstagram, SiYoutube, SiTiktok } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container max-w-screen-2xl px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/">
              <span className="font-display font-bold text-2xl tracking-tighter text-primary cursor-pointer">
                Scrolltek
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your go-to source for tech, digital culture, AI tools, lifestyle, and the trends shaping how we live online.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="https://twitter.com/scrolltek" target="_blank" rel="noopener noreferrer" aria-label="Scrolltek on X (Twitter)" className="hover:text-primary transition-colors"><SiX className="h-5 w-5" /></a>
              <a href="https://instagram.com/scrolltek" target="_blank" rel="noopener noreferrer" aria-label="Scrolltek on Instagram" className="hover:text-primary transition-colors"><SiInstagram className="h-5 w-5" /></a>
              <a href="https://youtube.com/@scrolltek" target="_blank" rel="noopener noreferrer" aria-label="Scrolltek on YouTube" className="hover:text-primary transition-colors"><SiYoutube className="h-5 w-5" /></a>
              <a href="https://tiktok.com/@scrolltek" target="_blank" rel="noopener noreferrer" aria-label="Scrolltek on TikTok" className="hover:text-primary transition-colors"><SiTiktok className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/tech" className="hover:text-primary transition-colors">Tech</Link></li>
              <li><Link href="/category/culture" className="hover:text-primary transition-colors">Culture</Link></li>
              <li><Link href="/category/lifestyle" className="hover:text-primary transition-colors">Lifestyle</Link></li>
              <li><Link href="/category/ai-tools" className="hover:text-primary transition-colors">AI Tools</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-lg">More</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/phone-tips" className="hover:text-primary transition-colors">Phone Tips</Link></li>
              <li><Link href="/category/productivity" className="hover:text-primary transition-colors">Productivity</Link></li>
              <li><Link href="/category/trending" className="hover:text-primary transition-colors">Trending</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Advertise</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Scrolltek. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}