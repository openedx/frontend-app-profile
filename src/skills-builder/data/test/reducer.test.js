import { skillsReducer } from '../reducer';
import {
  SET_GOAL,
} from '../constants';

describe('skillsReducer', () => {
  const testState = {
    currentGoal: '',
  };

  it('does not remove present data when SET_GOAL action is dispatched', () => {
    const newSkillsPayload = 'test-goal';
    const returnedState = skillsReducer(testState, { type: SET_GOAL, payload: newSkillsPayload });
    const finalState = {
      ...testState,
      currentGoal: 'test-goal',
    };
    expect(returnedState).toEqual(finalState);
  });
});
