'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Facebook, Instagram, Twitter, Plus } from 'lucide-react';

export default function SocialPostingPage() {
  return (
    <div className="p-4 md:p-6 pt-6 md:pt-12">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="space-y-1 min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Social Posting
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage social media posts and campaigns
          </p>
        </div>
        <Button className="w-full lg:w-auto shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-blue-600" />
                Facebook
              </CardTitle>
              <Badge variant="outline">Connected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Posts This Month</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                View Posts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                Instagram
              </CardTitle>
              <Badge variant="outline">Not Connected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Posts This Month</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Connect Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                Twitter
              </CardTitle>
              <Badge variant="outline">Not Connected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Posts This Month</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Connect Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <p>No posts yet</p>
            <p className="text-sm mt-2">Create your first social media post from the Inventory page</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
