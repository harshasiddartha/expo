import { render } from '@testing-library/react-native';
import { View } from 'react-native';

import { Host } from '..';
import { findNativeViewProps } from '../../../__mocks__/expo';

jest.mock('expo', () => jest.requireActual('../../../__mocks__/expo'));

describe('Host', () => {
  describe('safeArea', () => {
    it('applies no regions by default', () => {
      render(
        <Host style={{ flex: 1 }}>
          <View />
        </Host>
      );

      expect(findNativeViewProps('HostView')?.safeArea).toBe('none');
    });

    it('applies no regions by default on a matchContents host', () => {
      render(
        <Host matchContents>
          <View />
        </Host>
      );

      expect(findNativeViewProps('HostView')?.safeArea).toBe('none');
    });

    it('passes the regions it names', () => {
      render(
        <Host safeArea style={{ flex: 1 }}>
          <View />
        </Host>
      );

      expect(findNativeViewProps('HostView')?.safeArea).toBe('all');
    });

    it('passes a single region', () => {
      render(
        <Host safeArea="container" matchContents>
          <View />
        </Host>
      );

      expect(findNativeViewProps('HostView')?.safeArea).toBe('container');
    });

    it('maps the deprecated ignoreSafeArea prop onto the regions it kept', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      render(
        <Host ignoreSafeArea="keyboard" style={{ flex: 1 }}>
          <View />
        </Host>
      );

      expect(findNativeViewProps('HostView')?.safeArea).toBe('container');
      warn.mockRestore();
    });
  });
});
