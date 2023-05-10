import {
  screen, render, cleanup, fireEvent,
} from '@testing-library/react';
import { mergeConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { SkillsBuilderWrapperWithContext, dispatchMock, contextValue } from '../../../test/setupSkillsBuilder';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

describe('select-preferences', () => {
  beforeAll(() => {
    mergeConfig({
      ALGOLIA_JOBS_INDEX_NAME: 'test-job-index-name',
    });
  });
  beforeEach(() => cleanup());

  describe('render behavior', () => {
    it('should render the second prompt if a goal is selected', () => {
      render(
        SkillsBuilderWrapperWithContext(
          {
            ...contextValue,
            state: {
              ...contextValue.state,
              currentGoal: 'I want to start my career',
            },
          },
        ),
      );
      const expectedGoal = {
        payload: 'I want to advance my career',
        type: 'SET_GOAL',
      };
      const expectedStudent = {
        payload: 'student',
        type: 'SET_CURRENT_JOB_TITLE',
      };

      const expectedJobTitle = {
        payload: 'Prospector',
        type: 'SET_CURRENT_JOB_TITLE',
      };

      const goalSelect = screen.getByTestId('goal-select-dropdown');
      fireEvent.change(goalSelect, { target: { value: 'I want to advance my career' } });

      const checkbox = screen.getByRole('checkbox', { name: 'I\'m a student' });
      fireEvent.click(checkbox);

      const jobTitleInput = screen.getByTestId('job-title-select');
      fireEvent.change(jobTitleInput, { target: { value: 'Prospector' } });
      fireEvent.click(screen.getByRole('button', { name: 'Prospector' }));

      expect(screen.getByText('Next, search and select your current job title')).toBeTruthy();
      expect(dispatchMock).toHaveBeenCalledWith(expectedGoal);
      expect(dispatchMock).toHaveBeenCalledWith(expectedStudent);
      expect(dispatchMock).toHaveBeenCalledWith(expectedJobTitle);
      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.goal.select',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          learner_data: {
            current_goal: 'I want to advance my career',
          },
        },
      );
      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.current_job.student',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
        },
      );
      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.current_job.select',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          learner_data: {
            current_job_title: 'Prospector',
          },
        },
      );
    });

    it('should render the third prompt if a current job title is selected', () => {
      render(
        SkillsBuilderWrapperWithContext(
          {
            ...contextValue,
            state: {
              ...contextValue.state,
              currentGoal: 'I want to start my career',
              currentJobTitle: 'Goblin Guide',
            },
          },
        ),
      );
      expect(screen.getByText('What careers are you interested in?')).toBeTruthy();
    });

    it('should render a <CareerInterestCard> for each career interest', () => {
      render(
        SkillsBuilderWrapperWithContext(
          {
            ...contextValue,
            state: {
              ...contextValue.state,
              currentGoal: 'I want to start my career',
              currentJobTitle: 'Goblin Lackey',
              careerInterests: ['Prospector'],
            },
          },
        ),
      );
      expect(screen.getByText('Prospector')).toBeTruthy();

      const careerInterestInput = screen.getByTestId('career-interest-select');
      fireEvent.change(careerInterestInput, { target: { value: 'Mirror Breaker' } });
      fireEvent.click(screen.getByRole('button', { name: 'Mirror Breaker' }));

      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.career_interest.added',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          learner_data: {
            career_interest: 'Mirror Breaker',
          },
        },
      );
      expect(dispatchMock).toHaveBeenCalledWith(
        {
          payload: 'Mirror Breaker',
          type: 'ADD_CAREER_INTEREST',
        },
      );
    });
  });

  describe('controlled behavior', () => {
    it('should remove a <CareerInterestCard> when the corresponding close button is selected', () => {
      render(
        SkillsBuilderWrapperWithContext(
          {
            ...contextValue,
            state: {
              ...contextValue.state,
              currentGoal: 'I want to start my career',
              currentJobTitle: 'Goblin Lackey',
              careerInterests: ['Prospector', 'Mirror Breaker', 'Bombardment'],
            },
          },
        ),
      );

      const expected = {
        payload: 'Prospector',
        type: 'REMOVE_CAREER_INTEREST',
      };

      fireEvent.click(screen.getByLabelText('Remove career interest: Prospector'));
      expect(dispatchMock).toHaveBeenCalledWith(expected);
      expect(sendTrackEvent).toHaveBeenCalledWith(
        'edx.skills_builder.career_interest.removed',
        {
          app_name: 'skills_builder',
          category: 'skills_builder',
          learner_data: {
            career_interest: 'Prospector',
          },
        },
      );
    });
  });
});
