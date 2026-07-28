import { useEffect, useMemo, useState } from 'react';
import { breakpoints, useWindowSize } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

import { getCourseCompletion } from './services';
import { deriveProfileStatusCounts } from '../profileStatusCardsUtils';

export function useIsOnTabletScreen() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.medium.minWidth;
}

export function useIsOnMobileScreen() {
  const windowSize = useWindowSize();
  return windowSize.width <= breakpoints.small.minWidth;
}

export function useIsVisibilityEnabled() {
  return getConfig().DISABLE_VISIBILITY_EDITING !== 'true';
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

// Course status counts for the profile header. The completion endpoint is
// scoped to the session user, so callers disable it on other users' profiles.
export function useCourseCompletionCounts(enabled = true) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setCourses([]);
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;
    setIsLoading(true);

    getCourseCompletion().then((completionData) => {
      if (isMounted) {
        setCourses(completionData);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  const counts = useMemo(() => deriveProfileStatusCounts(courses), [courses]);

  return { counts, isLoading };
}
