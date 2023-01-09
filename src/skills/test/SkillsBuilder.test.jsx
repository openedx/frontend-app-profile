import { IntlProvider } from '@edx/frontend-platform/i18n';
import { mount } from 'enzyme';
import React from 'react';
import SkillsBuilder from '../SkillsBuilder';

const SkillsBuilderWrapper = () => (
  <IntlProvider locale="en">
    <SkillsBuilder />
  </IntlProvider>
);

describe('skills-builder', () => {
  it('should render a Skills Builder modal', () => {
    const component = <SkillsBuilderWrapper />;
    const wrapper = mount(component);
    const modal = wrapper.find(SkillsBuilder);
    expect(modal.find('h2').text()).toBe('Skills Builder');
  });
});
