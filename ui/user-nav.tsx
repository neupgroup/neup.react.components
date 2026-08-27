'use client';

import Link from 'next/link';
import { HeaderUserbar } from '@/component/elements/header.userbar';
import { useSession } from '@/core/providers/session';

export function UserNav() {
  const { user } = useSession();

  const displayName = user?.displayName?.trim() || 'User';
  const secondaryText = user?.neupId?.trim() || user?.accountId?.trim() || null;

  return (
    <Link href="/profile" aria-label="Open profile">
      <HeaderUserbar
        displayName={displayName}
        displayImage={user?.displayImage}
        neupid={secondaryText ?? ''}
      />
    </Link>
  );
}
