'use client';

import React, { useState, useEffect } from 'react';
import { Post, CreatePostRequest, UpdatePostRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, X } from 'lucide-react';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostRequest | UpdatePostRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  post,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    isPublished: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        isPublished: post.isPublished,
      });
    }
  }, [post]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'A cím megadása kötelező';
    } else if (formData.title.length > 200) {
      newErrors.title = 'A cím nem lehet hosszabb 200 karakternél';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'A tartalom megadása kötelező';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'A tartalom nem lehet hosszabb 10 000 karakternél';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit post:', error);
    }
  };

  const handleInputChange = (
    field: keyof CreatePostRequest,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{post ? 'Bejegyzés szerkesztése' : 'Új bejegyzés létrehozása'}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Cím</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Írd be a bejegyzés címét..."
              className={errors.title ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Tartalom</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Írd le a bejegyzés tartalmát..."
              rows={8}
              className={errors.content ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formData.content.length}/10 000 karakter
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="isPublished">Azonnal közzétesz</Label>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Mégse
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {post ? 'Bejegyzés frissítése' : 'Bejegyzés létrehozása'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 