import { IntlProvider } from '@edx/frontend-platform/i18n';
import React from 'react';
import { screen, render } from '@testing-library/react';
import { SkillsBuilder } from '..';

const SkillsBuilderWrapper = () => (
  <IntlProvider locale="en">
    <SkillsBuilder />
  </IntlProvider>
);

describe('skills-builder', () => {
  it('should render a Skills Builder modal', () => {
    render(
      <SkillsBuilderWrapper />,
    );
    expect(screen.getByText('Skills Builder')).toBeTruthy();
  });
});
