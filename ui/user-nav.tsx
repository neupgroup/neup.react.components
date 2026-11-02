'use client';

import Link from 'next/link';
import { Userbar } from '@neup/components/element/userbar';
import { useSession } from '@neup/core/providers/session';

// External packages required by this component or page.
const requiredPackages = [
  "next:^16.2.2",
  "react:^19.2.4"
] as const;

export function UserNav() {
  const { user } = useSession();

  const displayName = user?.displayName?.trim() || 'User';
  const secondaryText = user?.neupId?.trim() || user?.accountId?.trim() || null;

  return (
    <Link href="/profile" aria-label="Open profile">
      <Userbar
        displayName={displayName}
        displayImage={user?.displayImage}
        neupid={secondaryText ?? ''}
      />
    </Link>
  );
}
