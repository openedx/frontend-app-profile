import { useMemo } from 'react';
import { getConfig } from '@edx/frontend-platform';

import algoliasearch from 'algoliasearch';

// eslint-disable-next-line import/prefer-default-export
export const useAlgoliaSearch = () => {
  const config = getConfig();

  const [searchClient, productSearchIndex, jobSearchIndex] = useMemo(
    () => {
      const client = algoliasearch(
        config.ALGOLIA_APP_ID,
        config.ALGOLIA_SEARCH_API_KEY,
      );
      const productIndex = client.initIndex(config.ALGOLIA_PRODUCT_INDEX_NAME);
      const jobIndex = client.initIndex(config.ALGOLIA_JOBS_INDEX_NAME);
      return [client, productIndex, jobIndex];
    },
    [
      config.ALGOLIA_APP_ID,
      config.ALGOLIA_PRODUCT_INDEX_NAME,
      config.ALGOLIA_JOBS_INDEX_NAME,
      config.ALGOLIA_SEARCH_API_KEY,
    ],
  );
  return [searchClient, productSearchIndex, jobSearchIndex];
};
