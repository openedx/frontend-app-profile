import { breakpoints, useWindowSize } from '@openedx/paragon';

export function useIsOnTabletScreen() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.medium.minWidth;
}

export function useIsOnMobileScreen() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.small.minWidth;
}
