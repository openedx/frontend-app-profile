import { IntlProvider } from '@edx/frontend-platform/i18n';
import React from 'react';
import {
  screen, render, act,
} from '@testing-library/react';
import { SkillsBuilder } from '..';
import { SkillsBuilderProvider } from '../skills-builder-context';

describe('skills-builder', () => {
  it('should render a Skills Builder modal with a prompt for the user', () => {
    act(() => {
      render(
        <IntlProvider locale="en">
          <SkillsBuilderProvider>
            <SkillsBuilder />
          </SkillsBuilderProvider>
        </IntlProvider>,
      );
    });
    expect(screen.getByText('Skills Builder')).toBeTruthy();
    expect(screen.getByText('First, tell us what you want to achieve')).toBeTruthy();
  });
});
