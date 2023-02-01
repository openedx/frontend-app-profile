import { skillsReducer, skillsInitialState } from '../reducer';
import {
  SET_GOAL,
  SET_CURRENT_JOB_TITLE,
  ADD_CAREER_INTEREST,
  REMOVE_CAREER_INTEREEST,
} from '../constants';

describe('skillsReducer', () => {
  const testState = skillsInitialState;
  beforeEach(() => jest.resetModules());

  it('does not remove present data when SET_GOAL action is dispatched', () => {
    const newGoalPayload = 'test-goal';
    const returnedState = skillsReducer(testState, { type: SET_GOAL, payload: newGoalPayload });
    const finalState = {
      ...testState,
      currentGoal: 'test-goal',
    };
    expect(returnedState).toEqual(finalState);
  });

  it('does not remove present data when SET_JOB_TITLE action is dispatched', () => {
    const newJobTitlePayload = 'test-job-title';
    const returnedState = skillsReducer(testState, { type: SET_CURRENT_JOB_TITLE, payload: newJobTitlePayload });
    const finalState = {
      ...testState,
      currentJobTitle: 'test-job-title',
    };
    expect(returnedState).toEqual(finalState);
  });

  it('adds a careerInterest when ADD_CAREER_INTEREST action is dispatched', () => {
    const newCareerInterestPayload = 'test-career-interest';
    const returnedState = skillsReducer(testState, { type: ADD_CAREER_INTEREST, payload: newCareerInterestPayload });
    const finalState = {
      ...testState,
      careerInterests: [...testState.careerInterests, 'test-career-interest'],
    };
    expect(returnedState).toEqual(finalState);
  });

  it('removes a careerInterest when REMOVE_CAREER_INTEREST action is dispatched', () => {
    const newCareerInterestPayload = 'test-career-interest';
    const testStateWithInterest = {
      ...testState,
      careerInterests: [newCareerInterestPayload],
    };
    const returnedState = skillsReducer(
      testStateWithInterest,
      { type: REMOVE_CAREER_INTEREEST, payload: newCareerInterestPayload },
    );
    const finalState = {
      ...testStateWithInterest,
      // override the 'careerInterests` field and remove 'test-career-interest' from the array
      careerInterests: testStateWithInterest.careerInterests.filter(interest => interest !== newCareerInterestPayload),
    };
    expect(returnedState).toEqual(finalState);
  });
});
