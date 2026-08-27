//to be remade

'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/core/hooks/useToast'
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastDismissButton,
  ToastTitle,
  ToastViewport,
} from './toast'

function getStateIcon(state?: 'info' | 'warning' | 'error' | 'success') {
  const className = 'h-5 w-5'

  switch (state) {
    case 'warning':
      return <TriangleAlert className={className} />
    case 'error':
      return <CircleX className={className} />
    case 'success':
      return <CircleCheck className={className} />
    case 'info':
    default:
      return <Info className={className} />
  }
}

export function Toaster() {
  const { toasts, dismiss, dismissByName } = useToast()
  const [dismissingNames, setDismissingNames] = useState<Set<string>>(new Set())
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set())
  const toastGroups = Array.from(
    toasts.filter((toast) => toast.open !== false).reduce((groups, toast) => {
      const group = groups.get(toast.name) ?? []
      group.push(toast)
      groups.set(toast.name, group)
      return groups
    }, new Map<string, typeof toasts>()).entries()
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const overflow = toastGroups
      .filter(([, group]) => group.length > 2)
      .map(([name, group]) => ({
        name,
        count: group.length - 2,
        ids: group.slice(2).map((toast) => toast.id),
      }))

    window.sessionStorage.setItem('neup-toast-overflow', JSON.stringify(overflow))
  }, [toastGroups])

  const dismissToastGroup = (name: string) => {
    if (dismissingNames.has(name)) return

    setDismissingNames((current) => new Set(current).add(name))
    window.setTimeout(() => {
      dismissByName(name)
      setDismissingNames((current) => {
        const next = new Set(current)
        next.delete(name)
        return next
      })
    }, 600)
  }

  const dismissToast = (id: string) => {
    if (dismissingIds.has(id)) return

    setDismissingIds((current) => new Set(current).add(id))
    window.setTimeout(() => {
      dismiss(id)
      setDismissingIds((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
    }, 600)
  }

  return (
    <ToastProvider>
      <ToastViewport>
        {toastGroups.map(([name, group]) => (
          <div key={name} className={group.length > 1 ? 'flex flex-col items-end pt-7' : 'flex flex-col items-end'}>
            <div className="grid w-full grid-cols-1">
              {[...group].reverse().slice(-2).map(({ id, name: _name, title, description, action, icon, autoDismiss, state, onOpenChange: _onOpenChange, ...props }, index, stack) => (
                <Toast
                  key={id}
                  {...props}
                  onOpenChange={(open) => {
                    if (!open) dismissToast(id)
                  }}
                  state={state}
                  style={{
                    gridArea: '1 / 1',
                    opacity: dismissingNames.has(name) || dismissingIds.has(id) ? 0 : index === stack.length - 1 ? 1 : 0.72,
                    transform: dismissingNames.has(name) || dismissingIds.has(id)
                      ? 'translateX(110%)'
                      : props.open === false
                      ? undefined
                      : index === stack.length - 1
                        ? undefined
                        : 'translateY(-28px) scale(0.975)',
                    zIndex: index + 1,
                    pointerEvents: index === stack.length - 1 ? 'auto' : 'none',
                  }}
                  duration={autoDismiss === false || autoDismiss === undefined ? Infinity : autoDismiss * 1000}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 shrink-0">{icon ?? getStateIcon(state)}</div>
                    <div className="grid min-w-0 gap-1">
                      {title && <ToastTitle>{title}</ToastTitle>}
                      {description && <ToastDescription>{description}</ToastDescription>}
                      {props.open !== false && !dismissingNames.has(name) && !dismissingIds.has(id) && (autoDismiss === false || autoDismiss === undefined) && group.length >= 2 && index === stack.length - 1 && (
                        <ToastDismissButton
                          type="button"
                          size="sm"
                          className="mt-1 h-7 justify-self-start px-2 text-xs"
                          onClick={() => dismissToastGroup(name)}
                        >
                          Dismiss ({group.length})
                        </ToastDismissButton>
                      )}
                    </div>
                  </div>
                  {action}
                  <ToastClose />
                  {typeof autoDismiss === 'number' && (
                    <div
                      role="progressbar"
                      aria-label="Toast dismiss countdown"
                      aria-valuemin={0}
                      aria-valuemax={autoDismiss}
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left bg-current/40"
                      style={{ animation: `toast-progress ${autoDismiss}s linear forwards` }}
                    />
                  )}
                </Toast>
              ))}
            </div>
          </div>
        ))}
      </ToastViewport>
    </ToastProvider>
  )
}
