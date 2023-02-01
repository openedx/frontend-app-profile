import {
  SET_GOAL,
} from './constants';

export function skillsReducer(state, action) {
  switch (action.type) {
    case SET_GOAL:
      return {
        ...state,
        currentGoal: action.payload,
      };
    default:
      return state;
  }
}

export const skillsInitialState = {
  currentGoal: '',
};

export default skillsReducer;
