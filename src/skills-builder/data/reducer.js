import {
  SET_GOAL,
  SET_CURRENT_JOB_TITLE,
  ADD_CAREER_INTEREST,
  REMOVE_CAREER_INTEREEST,
} from './constants';

export function skillsReducer(state, action) {
  switch (action.type) {
    case SET_GOAL:
      return {
        ...state,
        currentGoal: action.payload,
      };
    case SET_CURRENT_JOB_TITLE:
      return {
        ...state,
        currentJobTitle: action.payload,
      };
    case ADD_CAREER_INTEREST:
      return {
        ...state,
        careerInterests: [...state.careerInterests, action.payload],
      };
    case REMOVE_CAREER_INTEREEST:
      return {
        ...state,
        careerInterests: state.careerInterests.filter(interest => interest !== action.payload),
      };
    default:
      return state;
  }
}

export const skillsInitialState = {
  currentGoal: '',
  currentJobTitle: '',
  careerInterests: [],
};

export default skillsReducer;
