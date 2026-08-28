'use client';

/*
::neup.documentation::back-button
::title Back Button

Reusable back navigation button with support for app-relative, cross-app, absolute, and query-preserving destinations.

::public

Pass `backsTo` as `/path`, `appname::/path`, or an absolute URL. `selectedServer` is always copied when present. Pass one or more comma-separated query parameter names through `withParameter` to copy additional current values to the destination.

::public end

::end
*/

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '#/components/ui/button';
import { getEnvVariable } from '#/core/helpers/env';
import { cn } from '#/core/utils';

type BackButtonProps = {
    /** Backward-compatible alias for backsTo. */
    href?: string;
    backsTo?: string;
    withParameter?: string | string[];
    className?: string;
};

const INTERNAL_BASE_PATH = getEnvVariable('APP_BASEPATH', true) ?? '';

const APP_ROOT_URLS: Record<string, string> = {
    estate: 'https://neupgroup.com/estate',
    drive: 'https://neupgroup.com/drive',
    crm: 'https://neupgroup.com/crm',
    sites: 'https://neupgroup.com/sites',
    site: 'https://neupgroup.com/site',
    account: 'https://neupgroup.com/account',
    neupid: 'https://neupgroup.com/account',
    shop: 'https://neupgroup.com/shop',
    cloud: 'https://neupgroup.com/cloud',
};

function getParameterNames(withParameter?: string | string[]) {
    const values = Array.isArray(withParameter) ? withParameter : [withParameter ?? ''];

    return values
        .flatMap((value) => value.split(','))
        .map((value) => value.trim())
        .concat('selectedServer')
        .filter(Boolean);
}

function normalizeBasePath(basePath: string) {
    if (!basePath.trim() || basePath.trim() === '/') return '';
    return `/${basePath.trim().replace(/^\/+|\/+$/g, '')}`;
}

function withBasePath(path: string, basePath: string) {
    const url = new URL(path.startsWith('/') ? path : `/${path}`, 'https://back-button.local');
    const normalizedBasePath = normalizeBasePath(basePath);

    if (
        !normalizedBasePath ||
        url.pathname === normalizedBasePath ||
        url.pathname.startsWith(`${normalizedBasePath}/`)
    ) {
        return `${url.pathname}${url.search}${url.hash}`;
    }

    return `${normalizedBasePath}${url.pathname}${url.search}${url.hash}`;
}

function withAppRoot(appName: string, path: string) {
    const appRoot = APP_ROOT_URLS[appName.toLowerCase()];
    if (!appRoot) return withBasePath(path, INTERNAL_BASE_PATH);

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${appRoot.replace(/\/$/, '')}${normalizedPath}`;
}

function resolveDestination(
    destination: string,
    withParameter: string | string[] | undefined,
    currentSearchParams: ReadonlyURLSearchParams,
) {
    const trimmedDestination = destination.trim() || '/';
    const separatorIndex = trimmedDestination.indexOf('::');
    const hasAppPrefix = separatorIndex > 0;
    const isAbsolute = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(trimmedDestination);

    let href = trimmedDestination;
    if (hasAppPrefix && !isAbsolute) {
        const appName = trimmedDestination.slice(0, separatorIndex).trim();
        const appPath = trimmedDestination.slice(separatorIndex + 2).trim();
        href = withAppRoot(appName, appPath);
    } else if (!isAbsolute) {
        href = withBasePath(href, INTERNAL_BASE_PATH);
    }

    const url = new URL(href, 'https://back-button.local');
    for (const parameterName of getParameterNames(withParameter)) {
        const value = currentSearchParams.get(parameterName);
        if (value !== null) url.searchParams.set(parameterName, value);
    }

    const resolvedHref = isAbsolute || hasAppPrefix
        ? url.toString().replace('https://back-button.local', '')
        : `${url.pathname}${url.search}${url.hash}`;

    return {
        href: resolvedHref,
        rawNavigation: hasAppPrefix || isAbsolute,
    };
}

export function BackButton({ href, backsTo, withParameter, className }: BackButtonProps) {
    const searchParams = useSearchParams();
    const destination = useMemo(
        () => resolveDestination(backsTo ?? href ?? '/', withParameter, searchParams),
        [backsTo, href, withParameter, searchParams],
    );

    const content = <>&lt; Go back</>;

    return (
        <Button
            type="plain"
            className={cn(
                'pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground hover:underline',
                className,
            )}
            asChild
        >
            {destination.rawNavigation ? (
                <a href={destination.href}>{content}</a>
            ) : (
                <Link href={destination.href}>{content}</Link>
            )}
        </Button>
    );
}
