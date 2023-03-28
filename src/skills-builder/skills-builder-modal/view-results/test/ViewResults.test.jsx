import {
  screen, render, cleanup, fireEvent, act,
} from '@testing-library/react';
import { mergeConfig } from '@edx/frontend-platform';
import { SkillsBuilderWrapperWithContext, contextValue } from '../../../test/setupSkillsBuilder';
import { getProductRecommendations } from '../../../utils/search';

const renderSkillsBuilderWrapper = (
  value = {
    ...contextValue,
    state: {
      ...contextValue.state,
      currentGoal: 'I want to start my career',
      currentJobTitle: 'Goblin Lackey',
      careerInterests: ['Prospector', 'Mirror Breaker', 'Bombardment'],
    },
  },
) => {
  render(SkillsBuilderWrapperWithContext(value));
};

describe('view-results', () => {
  beforeAll(() => {
    mergeConfig({
      ALGOLIA_JOBS_INDEX_NAME: 'test-job-index-name',
    });
  });

  describe('user interface', () => {
    beforeEach(async () => {
      cleanup();
      // Render the form filled out
      renderSkillsBuilderWrapper();
      // Click the next button to trigger "fetching" the data
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Next Step' }));
      });
    });

    it('should render a <JobSillsSelectableBox> for each career interest the learner has submitted', async () => {
      expect(screen.getByText('Prospector')).toBeTruthy();
      expect(screen.getByText('Mirror Breaker')).toBeTruthy();

      const chipComponents = document.querySelectorAll('.pgn__chip');
      expect(chipComponents[0].textContent).toEqual('finding shiny things');
      expect(chipComponents[1].textContent).toEqual('mining');
    });

    it('renders a carousel of <Card> components', async () => {
      expect(screen.getByText('Course recommendations for Prospector')).toBeTruthy();
    });

    it('changes the recommendations based on the selected job title', () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Mirror Breaker' }));
      expect(screen.getByText('Course recommendations for Mirror Breaker')).toBeTruthy();
    });
  });

  describe('fetch recommendations', () => {
    beforeEach(() => {
      cleanup();
      // Render the form filled out
      renderSkillsBuilderWrapper();
    });

    it('renders an alert if an error is thrown while fetching', async () => {
      getProductRecommendations.mockImplementationOnce(() => {
        throw new Error();
      });

      // Click the next button to trigger "fetching" the data
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Next Step' }));
      });

      expect(screen.getByText('We were not able to retrieve recommendations at this time. Please try again later.')).toBeTruthy();
    });
  });
});
