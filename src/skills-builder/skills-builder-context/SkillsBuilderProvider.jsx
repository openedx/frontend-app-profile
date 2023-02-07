import React, { createContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import reducer, { skillsInitialState } from '../data/reducer';

export const SkillsBuilderContext = createContext();

export const SkillsBuilderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, skillsInitialState);
  const value = useMemo(() => ([state, dispatch]), [state]);

  return (
    <SkillsBuilderContext.Provider value={value}>
      {children}
    </SkillsBuilderContext.Provider>
  );
};

SkillsBuilderProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
