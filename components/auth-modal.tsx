'use client';

import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, User, Truck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { Role } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, signup } = useRecycloStore();

  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('CUSTOMER');

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = login(email, password, selectedRole);
    if (ok) {
      setSuccessMessage('Successfully logged in!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1000);
    } else {
      setError('Account not found. Use 1-Click Demo Login below or register a new account.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone) {
      setError('Please fill in all required fields.');
      return;
    }
    signup(name, email, phone, password, selectedRole);
    setSuccessMessage('Account created successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  const handleQuickDemoLogin = (demoRole: Role) => {
    setError('');
    if (demoRole === 'CUSTOMER') {
      login('aarav.sharma@example.com', 'password123', 'CUSTOMER');
    } else if (demoRole === 'AGENT') {
      login('vikram.singh@recyclo.in', 'password123', 'AGENT');
    } else {
      login('priya.nair@recyclo.in', 'password123', 'ADMIN');
    }
    setSuccessMessage(`Logged in as Demo ${demoRole}!`);
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="space-y-6">
        <DialogHeader className="p-4 bg-primary/15 border-b border-primary/30 -mx-6 -mt-6">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary text-primary-foreground font-bold text-xs rounded-none border border-black/10">
              Recyclo Identity
            </Badge>
            <span className="text-xs text-muted-foreground">Secure Access</span>
          </div>
          <DialogTitle className="text-2xl font-extrabold tracking-tight">
            Welcome to Recyclo
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Sign in to access your recycling listings, upcycled orders, and financial wallet.
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <div className="p-3 rounded-none bg-primary/20 border-2 border-primary text-xs font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-foreground" /> {successMessage}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-none bg-destructive/10 border-2 border-destructive text-xs font-bold text-destructive">
            {error}
          </div>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'login' | 'signup')} className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-none border-2 border-border bg-muted">
            <TabsTrigger value="login" className="text-xs font-bold rounded-none gap-1.5">
              <LogIn className="size-3.5" /> Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-xs font-bold rounded-none gap-1.5">
              <UserPlus className="size-3.5" /> Create Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="pt-4 space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="e.g. aarav.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none border-2 border-border"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Password / Security PIN</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-none border-2 border-border"
                />
              </div>

              <Button type="submit" className="w-full font-bold h-10 rounded-none border border-black/10">
                <LogIn className="size-4 mr-1" /> Sign In to Account
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="pt-4 space-y-4">
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Operating Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('CUSTOMER')}
                    className={`p-2 rounded-none border-2 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === 'CUSTOMER' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    }`}
                  >
                    <User className="size-4" /> Recycler
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('AGENT')}
                    className={`p-2 rounded-none border-2 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === 'AGENT' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    }`}
                  >
                    <Truck className="size-4" /> Agent
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('ADMIN')}
                    className={`p-2 rounded-none border-2 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === 'ADMIN' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    }`}
                  >
                    <ShieldAlert className="size-4" /> Admin
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
                <Input
                  placeholder="e.g. Ananya Rao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-none border-2 border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-none border-2 border-border"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Phone</label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="rounded-none border-2 border-border"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Set Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-none border-2 border-border"
                />
              </div>

              <Button type="submit" className="w-full font-bold h-10 rounded-none border border-black/10">
                <UserPlus className="size-4 mr-1" /> Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-border space-y-2">
          <div className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
            <span>Instant Demo 1-Click Login:</span>
            <Sparkles className="size-3 text-primary fill-primary" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoLogin('CUSTOMER')}
              className="text-[11px] font-bold rounded-none border-2 border-border"
            >
              Aarav (User)
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoLogin('AGENT')}
              className="text-[11px] font-bold rounded-none border-2 border-border"
            >
              Vikram (Agent)
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="text-[11px] font-bold rounded-none border-2 border-border"
            >
              Priya (Admin)
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
