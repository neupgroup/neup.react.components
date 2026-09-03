import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '#/core/utils';
import { H1, H2, H3, Subtitle } from '#/components/ui/text';

type TitleSetLevel = 1 | 2 | 3;

export interface TitleSetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  level?: TitleSetLevel;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function TitleSet({
  title,
  subtitle,
  level = 1,
  className,
  titleClassName,
  subtitleClassName,
  ...props
}: TitleSetProps) {
  const Title = level === 1 ? H1 : level === 2 ? H2 : H3;

  return (
    <div className={cn('space-y-1', className)} {...props}>
      <Title className={titleClassName}>{title}</Title>
      {subtitle && <Subtitle className={subtitleClassName}>{subtitle}</Subtitle>}
    </div>
  );
}
