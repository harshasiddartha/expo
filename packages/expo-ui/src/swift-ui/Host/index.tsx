import { requireNativeView } from 'expo';
import type { Ref } from 'react';
import { I18nManager, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';

import { TextInputHostProvider, useTextInputHostRef } from '../../keyboard';
import {
  resolveHostSafeAreaMode,
  type HostIgnoreSafeArea,
  type HostSafeArea,
  type HostSafeAreaMode,
} from '../../universal/Host/safeArea';
import { useMergeRefs } from '../../utils/useMergeRefs';
import { createViewModifierEventListener } from '../modifiers/utils';
import { type CommonViewModifierProps } from '../types';

export type { HostIgnoreSafeArea, HostSafeArea } from '../../universal/Host/safeArea';

export interface HostProps extends CommonViewModifierProps {
  /**
   * When true, the host view will update its size in the React Native view tree to match the content's layout from SwiftUI.
   * Can be only set once on mount.
   * @default false
   */
  matchContents?: boolean | { vertical?: boolean; horizontal?: boolean };

  /**
   * When true and no explicit size is provided, the host will use the viewport size as the proposed size for SwiftUI layout.
   * This is particularly useful for SwiftUI views that need to fill their available space, such as `Form`.
   * @default false
   */
  useViewportSizeMeasurement?: boolean;

  /**
   * Callback function that is triggered when the SwiftUI content completes its layout.
   * Provides the current dimensions of the content, which may change as the content updates.
   */
  onLayoutContent?: (event: { nativeEvent: { width: number; height: number } }) => void;

  /**
   * The color scheme of the host view.
   */
  colorScheme?: 'light' | 'dark';

  /**
   * Seed color applied to the SwiftUI content as its tint. It propagates
   * through the SwiftUI environment to theme interactive elements (buttons,
   * switches, sliders, and similar controls) rendered by the children.
   */
  seedColor?: ColorValue;

  /**
   * The layout direction for the SwiftUI content.
   * Defaults to the current locale direction from I18nManager.
   */
  layoutDirection?: 'leftToRight' | 'rightToLeft';

  /**
   * Enables SwiftUI's safe area handling inside the host view. By default, the host lays out like any other
   * React Native view: its content starts at the frame origin and the app is expected to handle the safe area
   * and the keyboard, for example with `react-native-safe-area-context` or `react-native-keyboard-controller`.
   * Use it for a host that fills the available space and renders scrolling content or text inputs, such as
   * `Form` or `List`. With `matchContents`, the host grows by the applied insets so that its frame in the
   * React Native view tree still contains the content.
   * @default false
   */
  safeArea?: HostSafeArea;

  /**
   * @deprecated Use `safeArea` instead. `ignoreSafeArea` removed regions from SwiftUI's default
   * handling; `safeArea` enables them, and no region is applied by default.
   */
  ignoreSafeArea?: HostIgnoreSafeArea;

  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  /** @hidden */
  ref?: Ref<any>;
}

const HostNativeView: React.ComponentType<
  Omit<HostProps, 'safeArea' | 'ignoreSafeArea'> & {
    matchContentsVertical?: boolean;
    matchContentsHorizontal?: boolean;
    safeArea: HostSafeAreaMode;
    ref?: Ref<any>;
  }
> = requireNativeView('ExpoUI', 'HostView');

let didWarnAboutIgnoreSafeArea = false;

/**
 * A hosting component for SwiftUI views.
 */
export function Host(props: HostProps) {
  const {
    matchContents,
    onLayoutContent,
    safeArea,
    ignoreSafeArea,
    modifiers,
    layoutDirection,
    seedColor,
    ref,
    ...restProps
  } = props;
  const hostRef = useTextInputHostRef();
  const mergedRef = useMergeRefs(ref, hostRef);
  if (
    __DEV__ &&
    ignoreSafeArea !== undefined &&
    safeArea === undefined &&
    !didWarnAboutIgnoreSafeArea
  ) {
    didWarnAboutIgnoreSafeArea = true;
    console.warn(
      'The `ignoreSafeArea` prop of `Host` is deprecated. A `Host` applies no safe-area insets by default; use `safeArea` to enable the regions SwiftUI should apply.'
    );
  }

  return (
    <TextInputHostProvider hostRef={hostRef}>
      <HostNativeView
        modifiers={modifiers}
        {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
        matchContentsVertical={
          typeof matchContents === 'object' ? matchContents.vertical : matchContents
        }
        matchContentsHorizontal={
          typeof matchContents === 'object' ? matchContents.horizontal : matchContents
        }
        onLayoutContent={onLayoutContent}
        layoutDirection={
          layoutDirection ?? (I18nManager.getConstants().isRTL ? 'rightToLeft' : 'leftToRight')
        }
        safeArea={resolveHostSafeAreaMode(safeArea, ignoreSafeArea)}
        seedColor={seedColor}
        {...restProps}
        ref={mergedRef}
      />
    </TextInputHostProvider>
  );
}
