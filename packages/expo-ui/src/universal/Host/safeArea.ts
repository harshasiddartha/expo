export type HostSafeArea = boolean | 'container' | 'keyboard';

/** @deprecated Use `safeArea` instead. */
export type HostIgnoreSafeArea = 'all' | 'container' | 'keyboard';

export type HostSafeAreaMode = 'none' | 'all' | 'container' | 'keyboard';

/**
 * Resolves the `safeArea` prop, and the deprecated `ignoreSafeArea` prop when `safeArea` is unset, to
 * the regions the host applies. `ignoreSafeArea` described the regions to remove from all of them.
 */
export function resolveHostSafeAreaMode(
  safeArea: HostSafeArea | undefined,
  ignoreSafeArea: HostIgnoreSafeArea | undefined
): HostSafeAreaMode {
  if (safeArea !== undefined) {
    if (safeArea === true) {
      return 'all';
    }
    if (safeArea === false) {
      return 'none';
    }
    return safeArea;
  }
  switch (ignoreSafeArea) {
    case 'all':
      return 'none';
    case 'container':
      return 'keyboard';
    case 'keyboard':
      return 'container';
    default:
      return 'none';
  }
}
