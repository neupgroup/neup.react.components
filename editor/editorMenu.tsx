import type { ReactNode } from 'react';
import {
  BaseMenu,
  BaseMenuButton,
  BaseMenuSeparator,
  type BaseMenuPosition,
} from './baseMenu';

export type EditorMenuAction =
  | 'h2'
  | 'h3'
  | 'paragraph'
  | 'numbered-list'
  | 'unnumbered-list'
  | 'callout'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'highlight'
  | 'link';

export interface EditorMenuOption {
  action: EditorMenuAction;
  label: string;
  icon: ReactNode;
  separatorBefore?: boolean;
  className?: string;
}

interface EditorMenuProps<TCalloutType extends string> {
  activeActions?: EditorMenuAction[];
  activeCalloutType?: TCalloutType;
  calloutOptions?: Array<{ value: TCalloutType; label: string; icon: string }>;
  mode?: 'default' | 'callout';
  options: EditorMenuOption[];
  onAction: (action: EditorMenuAction) => void;
  onBack?: () => void;
  onCalloutTypeChange?: (type: TCalloutType) => void;
  position: BaseMenuPosition;
  showHeadingActions?: boolean;
}

// Render the editor's configured selection menu and app-provided option sets.
export function EditorMenu<TCalloutType extends string = string>({
  activeActions = [],
  activeCalloutType,
  calloutOptions = [],
  mode = 'default',
  options,
  onAction,
  onBack,
  onCalloutTypeChange,
  position,
  showHeadingActions = true,
}: EditorMenuProps<TCalloutType>) {
  if (mode === 'callout') {
    return (
      <BaseMenu
        ariaLabel="Callout block menu"
        dataAttribute="data-selection-menu"
        position={position}
      >
        <BaseMenuButton
          aria-label="Back"
          title="Back"
          onClick={onBack}
          className="text-lg font-bold"
        >
          &#8592;
        </BaseMenuButton>

        <BaseMenuSeparator />

        {calloutOptions.map(({ value, label, icon }) => (
          <BaseMenuButton
            key={value}
            active={activeCalloutType === value}
            aria-label={`${label} callout`}
            title={label}
            onClick={() => onCalloutTypeChange?.(value)}
            className="text-lg font-bold"
          >
            {icon}
          </BaseMenuButton>
        ))}
      </BaseMenu>
    );
  }

  return (
    <BaseMenu
      ariaLabel="Editor selection menu"
      dataAttribute="data-selection-menu"
      position={position}
    >
      {options
        .filter((option) => showHeadingActions || (option.action !== 'h2' && option.action !== 'h3'))
        .map((option, index) => (
          <EditorMenuOptionButton
            key={option.action}
            option={option}
            active={activeActions.includes(option.action)}
            showSeparator={option.separatorBefore && index > 0}
            onAction={onAction}
          />
        ))}
    </BaseMenu>
  );
}

// Render one configured editor action and its optional group separator.
function EditorMenuOptionButton({
  option,
  active,
  showSeparator = false,
  onAction,
}: {
  option: EditorMenuOption;
  active: boolean;
  showSeparator?: boolean;
  onAction: (action: EditorMenuAction) => void;
}) {
  return (
    <>
      {showSeparator && <BaseMenuSeparator />}
      <BaseMenuButton
        active={active}
        aria-label={option.label}
        title={option.label}
        onClick={() => onAction(option.action)}
        className={option.className}
      >
        {option.icon}
      </BaseMenuButton>
    </>
  );
}
