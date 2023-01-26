import React from 'react';
import { SkillsBuilderModal } from './skills-builder-modal';
import { SkillsBuilderProvider } from './skills-builder-context';

const SkillsBuilder = () => (
  <SkillsBuilderProvider>
    <SkillsBuilderModal />
  </SkillsBuilderProvider>
);

export default SkillsBuilder;
