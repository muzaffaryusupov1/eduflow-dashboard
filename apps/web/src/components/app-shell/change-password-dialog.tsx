'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { httpClient } from '@/lib/http/client';
import { ApiError } from '@/lib/http/types';
import { ViewFreeIcons, ViewOffSlashFreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../auth-provider';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function PasswordInput({
  id,
  value,
  onChange,
  ...props
}: React.ComponentProps<'input'> & { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input id={id} type={visible ? 'text' : 'password'} value={value} onChange={onChange} className="pr-9" {...props} />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((v) => !v)}
      >
        <HugeiconsIcon icon={visible ? ViewOffSlashFreeIcons : ViewFreeIcons} size={16} />
      </button>
    </div>
  );
}

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await httpClient('/auth/change-password', {
        method: 'POST',
        body: { currentPassword, newPassword },
      });
      toast.success('Password changed successfully. Please log in again.');
      reset();
      onOpenChange(false);
      logout();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Failed to change password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            After changing your password you will be logged out.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current password</Label>
            <PasswordInput
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <PasswordInput
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Changing...' : 'Change password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
