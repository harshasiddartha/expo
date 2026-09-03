import { resolveHostSafeAreaMode } from '../safeArea';

describe(resolveHostSafeAreaMode, () => {
  it('applies no regions by default', () => {
    expect(resolveHostSafeAreaMode(undefined, undefined)).toBe('none');
    expect(resolveHostSafeAreaMode(false, undefined)).toBe('none');
  });

  it('maps safeArea to the regions it names', () => {
    expect(resolveHostSafeAreaMode(true, undefined)).toBe('all');
    expect(resolveHostSafeAreaMode('container', undefined)).toBe('container');
    expect(resolveHostSafeAreaMode('keyboard', undefined)).toBe('keyboard');
  });

  it('inverts the deprecated ignoreSafeArea, which removed regions from all of them', () => {
    expect(resolveHostSafeAreaMode(undefined, 'all')).toBe('none');
    expect(resolveHostSafeAreaMode(undefined, 'container')).toBe('keyboard');
    expect(resolveHostSafeAreaMode(undefined, 'keyboard')).toBe('container');
  });

  it('prefers safeArea when both props are given', () => {
    expect(resolveHostSafeAreaMode(false, 'keyboard')).toBe('none');
    expect(resolveHostSafeAreaMode('container', 'all')).toBe('container');
  });
});
