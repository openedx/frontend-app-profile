import { renderHook } from '@testing-library/react-hooks';
import { useProductTypes } from '../hooks';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: global.query_string || '' })),
}));

describe('useProductTypes', () => {
  test('returns default setting if no query string is provided', () => {
    const { result } = renderHook(() => useProductTypes());

    const productTypes = result.current;

    expect(productTypes).toEqual(['course']);
  });

  test('returns a list of settings when serialized correctly', () => {
    global.query_string = '?product_types=boot_camp,course';

    const { result } = renderHook(() => useProductTypes());

    const productTypes = result.current;

    expect(productTypes).toEqual(['boot_camp', 'course']);
  });

  test('returns the default setting if query string is not serialized correctly', () => {
    global.query_string = '?legend_of_zelda=boot_camp,course';
    const { result } = renderHook(() => useProductTypes());

    const productTypes = result.current;

    expect(productTypes).toEqual(['course']);
  });

  test('returns a filtered list if unrecognized values are provided', () => {
    global.query_string = '?product_types=boot_camp,course,hack_the_mainframe';

    const { result } = renderHook(() => useProductTypes());

    const productTypes = result.current;

    expect(productTypes).toEqual(['boot_camp', 'course']);
  });
});
