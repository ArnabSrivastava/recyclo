'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { useFuseSearch } from '@/hooks/use-fuse-search';
import { PRODUCT_FUSE_KEYS, ITEM_FUSE_KEYS } from '@/lib/fuse-search';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GlobalFuseSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalFuseSearch({ isOpen, onClose }: GlobalFuseSearchProps) {
  const router = useRouter();
  const { products, listings } = useRecycloStore();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRODUCTS' | 'CATEGORIES'>('ALL');

  const { results: productResults, fuseResults: productFuseResults, hasQuery } = useFuseSearch(products, query, {
    keys: PRODUCT_FUSE_KEYS,
    threshold: 0.4,
  });

  const allClothingItems = useMemo(() => {
    return listings.flatMap((l) => l.items);
  }, [listings]);

  const { results: itemResults } = useFuseSearch(allClothingItems, query, {
    keys: ITEM_FUSE_KEYS,
    threshold: 0.4,
  });

  const productScoreMap = useMemo(() => {
    const map = new Map<string, number>();
    productFuseResults.forEach((res) => {
      if (res.item && res.score !== undefined) {
        map.set(res.item.id, Math.round((1 - res.score) * 100));
      }
    });
    return map;
  }, [productFuseResults]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const searchTerm = query.trim();
    onClose();
    if (searchTerm) {
      router.push(`/store?q=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/store');
    }
  };

  const handleTagClick = (tag: string) => {
    onClose();
    router.push(`/store?q=${encodeURIComponent(tag)}`);
  };

  const handleSelectProduct = (productName: string, productId: string) => {
    onClose();
    const searchTerm = query.trim() || productName;
    router.push(`/store?q=${encodeURIComponent(searchTerm)}#product-${productId}`);
  };

  const POPULAR_SEARCHES = ['Patchwork Denim', 'Banarasi Silk', 'Ajrakh Cotton', 'Woolen Jacket', 'Indigo Blue'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-md animate-in fade-in-0">
      <div className="relative w-full max-w-2xl bg-card border-2 border-foreground shadow-2xl rounded-none overflow-hidden animate-in zoom-in-95">
        <form onSubmit={handleSearchSubmit} className="relative border-b-2 border-border bg-muted/20 p-4 flex items-center gap-3">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search products, materials, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold placeholder:text-muted-foreground outline-none text-foreground"
          />
          {query ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer transition-colors"
                title="Clear query"
              >
                <X className="size-4" />
              </button>
              <Button
                type="submit"
                size="sm"
                className="h-8 px-3 rounded-none text-xs font-bold cursor-pointer gap-1"
              >
                Search
              </Button>
            </div>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-muted text-muted-foreground border border-border rounded-none shrink-0">
              ESC
            </kbd>
          )}
        </form>

        {hasQuery && (
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 border-b border-border text-xs">
            <span className="text-muted-foreground font-semibold">Filter Results:</span>
            <Button
              variant={activeTab === 'ALL' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('ALL')}
              className="h-7 px-3 text-xs font-bold rounded-none cursor-pointer"
            >
              All ({productResults.length + itemResults.length})
            </Button>
            <Button
              variant={activeTab === 'PRODUCTS' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('PRODUCTS')}
              className="h-7 px-3 text-xs font-bold rounded-none cursor-pointer"
            >
              Upcycled Products ({productResults.length})
            </Button>
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
          {!hasQuery ? (
            <div className="py-6 text-center space-y-5">
              <div className="space-y-1.5">
                <Sparkles className="size-8 mx-auto text-primary opacity-90 mb-2" />
                <h3 className="text-base font-bold text-foreground">
                  Search Recyclo Store
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Find upcycled garments by name, fabric material, color, or category
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  Popular Searches
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 bg-muted hover:bg-foreground hover:text-background border border-border text-xs font-semibold rounded-none transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : productResults.length === 0 && itemResults.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Search className="size-8 mx-auto opacity-40" />
              <div className="font-bold text-foreground">No matches found for &quot;{query}&quot;</div>
              <p className="text-xs">Try searching by category, fabric type, or broader keywords.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'ALL' || activeTab === 'PRODUCTS') && productResults.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Upcycled Store Products</span>
                    <span>{productResults.length} matches</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {productResults.map((product) => {
                      const matchPct = productScoreMap.get(product.id) || 100;
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.name, product.id)}
                          className="p-3 bg-muted/30 hover:bg-muted border border-border hover:border-primary transition-all cursor-pointer flex items-center justify-between gap-3 group rounded-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-12 bg-background border border-border overflow-hidden shrink-0 rounded-none">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                  {product.name}
                                </span>
                                <Badge className="bg-primary text-primary-foreground text-[10px] font-extrabold rounded-none">
                                  {matchPct}% Match
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {product.tagline} • ₹{product.price} • {product.material}
                              </div>
                            </div>
                          </div>

                          <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-muted/40 p-3 px-4 text-xs flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Press Enter to view all store results</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 px-4 text-xs font-bold rounded-none border-border hover:border-foreground hover:bg-background cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
