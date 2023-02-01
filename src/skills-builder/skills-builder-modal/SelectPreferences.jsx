import React, { useContext } from 'react';
import {
  Button,
} from '@edx/paragon';
import {
  setGoal,
  setCurrentJobTitle,
  addCareerInterest,
  removeCareerInterest,
} from '../data/actions';
import { SkillsBuilderContext } from '../skills-builder-context';
import { useAlgoliaSearch } from '../utils/hooks';

const SelectPreferences = () => {
  // TODO: Temporarily disable the no-unused-vars check, we'll see these later
  // eslint-disable-next-line no-unused-vars
  const [algoliaClient, productSearchIndex, jobSearchIndex] = useAlgoliaSearch();
  const [{ currentGoal, currentJobTitle, careerInterests }, dispatch] = useContext(SkillsBuilderContext);

  return (
    <>
      <div className="p-4">
        <h3>Render Question 1</h3>
        <Button onClick={() => dispatch(setGoal('learn new things'))}>
          Answer question 1
        </Button>
        <p>Goal: {currentGoal}</p>
      </div>

      {currentGoal && (
      <div className="p-4">
        <h3>Render question 2</h3>
        <Button onClick={() => dispatch(setCurrentJobTitle('Software Engineer'))}>
          Answer question 2
        </Button>
        <p>Current Job Title: {currentJobTitle}</p>
      </div>
      )}

      {currentJobTitle && (
      <div className="p-4">
        <h3>Render Question 3</h3>
        <Button
          onClick={() => dispatch(addCareerInterest(`Joining the circus ${Math.random().toFixed(2)}`))}
          disabled={careerInterests.length >= 3}
        >
          Answer question 3
        </Button>
        <p>
          Career Interests (click to remove):
          {careerInterests.map(interest => (
            <Button onClick={() => dispatch(removeCareerInterest(interest))}>
              {interest}
            </Button>
          ))}
        </p>
      </div>
      )}
    </>
  );
};

export default SelectPreferences;
