'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Recycle,
  ShoppingBag,
  User,
  ShieldAlert,
  Truck,
  Bell,
  Wallet,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  Check,
  LogIn,
  LogOut,
  Package,
  Settings,
} from 'lucide-react';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { AuthModal } from '@/components/auth-modal';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const {
    activeRole,
    setActiveRole,
    currentUser,
    cart,
    notifications,
    markNotificationRead,
    isAuthenticated,
    logout,
  } = useRecycloStore();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifs = notifications.filter((n) => !n.read && (n.role === activeRole || n.role === 'ALL'));

  const roleColors: Record<Role, string> = {
    CUSTOMER: 'bg-primary text-primary-foreground border-primary font-bold',
    AGENT: 'bg-foreground text-background border-foreground font-bold',
    ADMIN: 'bg-muted text-foreground border-border font-bold',
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How it Works' },
    { href: '/recycle/create', label: 'Recycle Clothes' },
    { href: '/store', label: 'Upcycled Store' },
    { href: '/impact', label: 'Impact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md transition-colors">
        <div className="bg-foreground text-background border-b border-border px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="size-3.5 text-primary fill-primary animate-pulse" />
            <span>Interactive Role Tester:</span>
            <span className="hidden sm:inline opacity-80">Switch roles to experience all platform perspectives</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-none border border-primary/40 bg-background text-foreground font-semibold text-xs transition-colors hover:border-primary cursor-pointer"
            >
              <span className="text-muted-foreground">Operating as:</span>
              <Badge variant="outline" className={roleColors[activeRole]}>
                {activeRole === 'CUSTOMER' && <User className="size-3 mr-1" />}
                {activeRole === 'AGENT' && <Truck className="size-3 mr-1" />}
                {activeRole === 'ADMIN' && <ShieldAlert className="size-3 mr-1" />}
                {activeRole}
              </Badge>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-none border-2 border-primary bg-background text-foreground shadow-2xl p-2 z-50 animate-in fade-in-0 slide-in-from-top-2">
                <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Select Active Perspective
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('CUSTOMER');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-xs font-medium transition-colors cursor-pointer ${
                    activeRole === 'CUSTOMER' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="size-4" />
                    <div className="text-left">
                      <div>Customer ({currentUser.name.split(' ')[0]})</div>
                      <div className="text-[10px] opacity-80">Lister & Buyer</div>
                    </div>
                  </div>
                  {activeRole === 'CUSTOMER' && <Check className="size-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('AGENT');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-xs font-medium transition-colors cursor-pointer ${
                    activeRole === 'AGENT' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="size-4" />
                    <div className="text-left">
                      <div>Pickup Agent (Vikram)</div>
                      <div className="text-[10px] opacity-80">Inspector & Collector</div>
                    </div>
                  </div>
                  {activeRole === 'AGENT' && <Check className="size-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('ADMIN');
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-xs font-medium transition-colors cursor-pointer ${
                    activeRole === 'ADMIN' ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="size-4" />
                    <div className="text-left">
                      <div>Admin / Operations</div>
                      <div className="text-[10px] opacity-80">Platform Controller</div>
                    </div>
                  </div>
                  {activeRole === 'ADMIN' && <Check className="size-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-10 rounded-none bg-primary flex items-center justify-center text-primary-foreground shadow-sm transition-transform group-hover:scale-105 border border-black/10">
              <Recycle className="size-6" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-extrabold tracking-tight leading-none text-foreground">
                Recyclo
              </span>
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase leading-none mt-1">
                Circular Textile
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-none text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-foreground text-background font-bold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground rounded-none"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              >
                <Bell className="size-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 rounded-none bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border border-black/10">
                    {unreadNotifs.length}
                  </span>
                )}
              </Button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 rounded-none border-2 border-primary bg-background text-foreground shadow-2xl p-3 z-50 animate-in fade-in-0 slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Notifications ({unreadNotifs.length})
                    </span>
                    <Badge variant="outline" className="text-[10px] rounded-none bg-primary text-primary-foreground">
                      Role: {activeRole}
                    </Badge>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.filter((n) => n.role === activeRole || n.role === 'ALL').length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted-foreground">No notifications</div>
                    ) : (
                      notifications
                        .filter((n) => n.role === activeRole || n.role === 'ALL')
                        .map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`p-2.5 rounded-none border text-xs cursor-pointer transition-colors ${
                              notif.read ? 'bg-muted/30 border-transparent text-muted-foreground' : 'bg-primary/10 border-primary/30 text-foreground font-medium'
                            }`}
                          >
                            <div className="font-semibold">{notif.title}</div>
                            <div className="text-muted-foreground text-[11px] mt-0.5">{notif.message}</div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-none">
                <ShoppingBag className="size-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 rounded-none bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border border-black/10">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1 rounded-none border-2 border-primary bg-background hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="size-7 rounded-none overflow-hidden bg-muted border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-foreground max-w-24 truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground mr-1" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-none border-2 border-primary bg-background text-foreground shadow-2xl p-2 z-50 animate-in fade-in-0 slide-in-from-top-2">
                    <div className="p-2 border-b border-border space-y-0.5">
                      <div className="font-bold text-xs text-foreground truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{currentUser.email}</div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors"
                      >
                        <Settings className="size-3.5 text-primary" /> My Profile & Addresses
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors"
                      >
                        <Recycle className="size-3.5 text-primary" /> Recycling Listings
                      </Link>

                      <Link
                        href="/wallet"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors"
                      >
                        <Wallet className="size-3.5 text-primary" /> Wallet (₹{currentUser.totalEarnings})
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors"
                      >
                        <Package className="size-3.5 text-primary" /> Upcycled Orders
                      </Link>
                    </div>

                    <div className="border-t border-border pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="size-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                size="sm"
                className="bg-primary text-primary-foreground font-bold text-xs gap-1.5 rounded-none border border-black/10"
              >
                <LogIn className="size-3.5" /> Sign In / Register
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
