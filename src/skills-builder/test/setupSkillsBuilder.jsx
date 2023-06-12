import { IntlProvider } from '@edx/frontend-platform/i18n';
import React from 'react';
import { SkillsBuilderModal } from '../skills-builder-modal';
import { SkillsBuilderContext } from '../skills-builder-context';
import { skillsInitialState } from '../data/reducer';
import { mockData } from './__mocks__/jobSkills.mockData';
import { getProductRecommendations, searchJobs, useAlgoliaSearch } from '../utils/search';

jest.mock('@edx/frontend-platform/logging');

jest.mock('react-instantsearch-hooks-web', () => ({
  // eslint-disable-next-line react/prop-types
  InstantSearch: ({ children }) => (<div>{children}</div>),
  Configure: jest.fn(() => (null)),
  useSearchBox: jest.fn(() => ({ refine: jest.fn() })),
  useHits: jest.fn(() => ({ hits: mockData.hits })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: '?query_string=values' })),
}));

jest.mock('../utils/search', () => ({
  searchJobs: jest.fn(),
  getProductRecommendations: jest.fn(),
  useAlgoliaSearch: jest.fn(),
}));

searchJobs.mockReturnValue(mockData.searchJobs);
getProductRecommendations.mockReturnValue(mockData.productRecommendations);
useAlgoliaSearch.mockReturnValue(mockData.useAlgoliaSearch);

export const dispatchMock = jest.fn();

export const contextValue = {
  state: {
    ...skillsInitialState,
  },
  dispatch: dispatchMock,
  algolia: {
    // Without this, tests would fail to destructure `searchClient` in the <JobTitleSelect> component
    searchClient: {},
    productSearchIndex: {},
    jobSearchIndex: {},
  },
};

export const SkillsBuilderWrapperWithContext = (value = contextValue) => (
  <IntlProvider locale="en">
    <SkillsBuilderContext.Provider value={value}>
      <SkillsBuilderModal />
    </SkillsBuilderContext.Provider>
  </IntlProvider>
);
