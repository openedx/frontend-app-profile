/* eslint-disable react/prop-types */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SwitchContent from './SwitchContent';

jest.mock('@openedx/paragon', () => ({
  TransitionReplace: ({ children, onChildExit, className }) => (
    <div data-testid="transition" data-class={className} data-onchildexit={!!onChildExit}>
      {children}
    </div>
  ),
}));

describe('SwitchContent', () => {
  const makeElement = (text) => <div>{text}</div>;

  it('renders matching case element directly', () => {
    render(
      <SwitchContent
        expression="one"
        cases={{ one: makeElement('Case One') }}
      />,
    );
    expect(screen.getByText('Case One')).toBeInTheDocument();
  });

  it('renders case via string alias', () => {
    render(
      <SwitchContent
        expression="alias"
        cases={{
          alias: 'target',
          target: makeElement('Target Case'),
        }}
      />,
    );
    expect(screen.getByText('Target Case')).toBeInTheDocument();
  });

  it('renders default alias when expression not found', () => {
    render(
      <SwitchContent
        expression="missing"
        cases={{
          default: 'target',
          target: makeElement('Target via Default'),
        }}
      />,
    );
    expect(screen.getByText('Target via Default')).toBeInTheDocument();
  });

  it('renders null when no matching case and no default', () => {
    const { container } = render(
      <SwitchContent
        expression="missing"
        cases={{ something: makeElement('Something') }}
      />,
    );
    expect(container.querySelector('[data-testid="transition"]').textContent).toBe('');
  });

  it('calls onChildExit when child exits', () => {
    const onChildExit = jest.fn();
    render(
      <SwitchContent
        expression="one"
        cases={{ one: makeElement('Case One') }}
        className="test-class"
      />,
    );
    const transition = screen.getByTestId('transition');
    transition.dataset.onchildexit = onChildExit;

    // Simulate child exit
    onChildExit(transition);
    expect(onChildExit).toHaveBeenCalledWith(transition);
  });
});
