import {
  SET_GOAL,
  SET_CURRENT_JOB_TITLE,
  ADD_CAREER_INTEREST,
  REMOVE_CAREER_INTEREST,
} from './constants';

export const setGoal = (payload) => ({
  type: SET_GOAL,
  payload,
});

export const setCurrentJobTitle = (payload) => ({
  type: SET_CURRENT_JOB_TITLE,
  payload,
});

export const addCareerInterest = (payload) => ({
  type: ADD_CAREER_INTEREST,
  payload,
});

export const removeCareerInterest = (payload) => ({
  type: REMOVE_CAREER_INTEREST,
  payload,
});
