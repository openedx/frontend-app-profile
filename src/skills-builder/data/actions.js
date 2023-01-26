import {
  SET_GOAL,
} from './constants';

// eslint-disable-next-line import/prefer-default-export
export const setGoal = (payload) => ({
  type: SET_GOAL,
  payload,
});
