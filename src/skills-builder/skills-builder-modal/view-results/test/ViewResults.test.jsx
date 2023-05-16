import {
  screen, render, cleanup, fireEvent, act,
} from '@testing-library/react';
import { mergeConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { SkillsBuilderWrapperWithContext, contextValue } from '../../../test/setupSkillsBuilder';
import { getProductRecommendations } from '../../../utils/search';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

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

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render a <JobSillsSelectableBox> for each career interest the learner has submitted', () => {
      expect(screen.getByText('Prospector')).toBeTruthy();
      expect(screen.getByText('Mirror Breaker')).toBeTruthy();

      const chipComponents = document.querySelectorAll('.pgn__chip');
      expect(chipComponents[0].textContent).toEqual('finding shiny things');
      expect(chipComponents[1].textContent).toEqual('mining');
      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.recommendation.shown',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          page: 'skills_builder',
          selected_recommendations: {
            job_id: 0,
            job_name: 'Prospector',
            courserun_keys: [
              {
                title: 'Mining with the Mons',
                courserun_key: 'MONS101',
              },
              {
                title: 'The Art of Warren Upkeep',
                courserun_key: 'WAR101',
              },
            ],
          },
          is_default: true,
        },
      );
      // called once when "Next Step" button is clicked and then again for above event
      expect(sendTrackEvent).toHaveBeenCalledTimes(2);
    });

    it('renders a carousel of <Card> components', () => {
      expect(screen.getByText('Course recommendations for Prospector')).toBeTruthy();
    });

    it('changes the recommendations based on the selected job title', () => {
      fireEvent.click(screen.getByRole('radio', { name: 'Mirror Breaker' }));
      expect(screen.getByText('Course recommendations for Mirror Breaker')).toBeTruthy();
      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.recommendation.shown',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          page: 'skills_builder',
          selected_recommendations: {
            job_id: 1,
            job_name: 'Mirror Breaker',
            courserun_keys: [
              {
                title: 'Mining with the Mons',
                courserun_key: 'MONS101',
              },
              {
                title: 'The Art of Warren Upkeep',
                courserun_key: 'WAR101',
              },
            ],
          },
          is_default: false,
        },
      );
    });

    it('sends an event when the "Next Step" button is clicked', () => {
      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.next_step',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          learner_data: {
            current_goal: 'I want to start my career',
            current_job_title: 'Goblin Lackey',
            career_interests: ['Prospector', 'Mirror Breaker', 'Bombardment'],
          },
        },
      );
    });

    it('fires an event when a product recommendation is clicked', () => {
      fireEvent.click(screen.getByText('Mining with the Mons'));
      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.recommendation.click',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          page: 'skills_builder',
          courserun_key: 'MONS101',
          product_type: 'course',
          selected_recommendations: {
            job_id: 0,
            job_name: 'Prospector',
            courserun_keys: [
              {
                title: 'Mining with the Mons',
                courserun_key: 'MONS101',
              },
              {
                title: 'The Art of Warren Upkeep',
                courserun_key: 'WAR101',
              },
            ],
          },
        },
      );
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
