import {
  screen, render, cleanup, fireEvent,
} from '@testing-library/react';
import { mergeConfig } from '@edx/frontend-platform';
import { SkillsBuilderWrapperWithContext, dispatchMock, contextValue } from '../../../test/setupSkillsBuilder';

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
      const expectedJobTitle = {
        payload: 'Student',
        type: 'SET_CURRENT_JOB_TITLE',
      };

      const goalSelect = screen.getByTestId('goal-select-dropdown');
      fireEvent.change(goalSelect, { target: { value: 'I want to advance my career' } });

      const checkbox = screen.getByRole('checkbox', { name: 'I\'m a student' });
      fireEvent.click(checkbox);

      expect(screen.getByText('Next, search and select your current job title')).toBeTruthy();
      expect(dispatchMock).toHaveBeenCalledWith(expectedGoal);
      expect(dispatchMock).toHaveBeenCalledWith(expectedJobTitle);
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
              careerInterests: ['Prospector', 'Mirror Breaker', 'Bombardment'],
            },
          },
        ),
      );
      expect(screen.getByText('Prospector')).toBeTruthy();
      expect(screen.getByText('Mirror Breaker')).toBeTruthy();
      expect(screen.getByText('Bombardment')).toBeTruthy();
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
    });
  });
});
