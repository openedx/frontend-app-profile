import { breakpoints, useWindowSize } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

export function useIsOnTabletScreen() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.medium.minWidth;
}

export function useIsOnMobileScreen() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.small.minWidth;
}

export function useIsVisibilityEnabled() {
  return getConfig().DISABLE_VISIBILITY_EDITING === 'true';
}

export function useHandleChange(changeHandler) {
  return (e) => {
    const { name, value } = e.target;
    changeHandler(name, value);
  };
}

export function useHandleSubmit(submitHandler, formId) {
  return (e) => {
    e.preventDefault();
    submitHandler(formId);
  };
}

export function useCloseOpenHandler(handler, formId) {
  return () => handler(formId);
}
