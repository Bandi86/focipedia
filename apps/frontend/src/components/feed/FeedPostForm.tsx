'use client';

import React, { useState } from 'react';
import { Post, CreatePostRequest, UpdatePostRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Loader2, 
  Save, 
  X, 
  Image as ImageIcon,
  Hash,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/lib/auth-hooks';

interface FeedPostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostRequest | UpdatePostRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FeedPostForm: React.FC<FeedPostFormProps> = ({
  post,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    isPublished: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
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
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {user?.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {user?.displayName}
              </div>
              <div className="text-sm text-gray-500">
                {post ? 'Bejegyzés szerkesztése' : 'Új bejegyzés létrehozása'}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
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

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Tartalom</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Írd le a bejegyzés tartalmát... Használj hashtag-eket (#futball, #bajnokság) a jobb kategorizáláshoz!"
              rows={6}
              className={errors.content ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{formData.content.length}/10 000 karakter</span>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span>Hashtag-ek támogatottak</span>
              </div>
            </div>
          </div>

          {/* Image Upload (placeholder) */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Képfeltöltés hamarosan elérhető...
            </p>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="isPublished" className="flex items-center gap-2">
              {formData.isPublished ? (
                <>
                  <Eye className="w-4 h-4" />
                  Azonnal közzétesz
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Vázlatként ment
                </>
              )}
            </Label>
          </div>

          {/* Submit Button */}
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