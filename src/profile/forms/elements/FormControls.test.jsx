import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormControls from './FormControls';
import messages from './FormControls.messages';

const defaultProps = {
  cancelHandler: jest.fn(),
  changeHandler: jest.fn(),
  visibilityId: 'visibility-id',
  visibility: 'private',
  saveState: null,
};

jest.mock('@edx/frontend-platform/i18n', () => {
  const actual = jest.requireActual('@edx/frontend-platform/i18n');
  return {
    ...actual,
    useIntl: () => ({
      formatMessage: (msg) => msg.id, // returns id so we can assert on it
    }),
    injectIntl: (Component) => (props) => (
      <Component
        {...props}
        intl={{
          formatMessage: (msg) => msg.id, // returns id so we can assert on it
        }}
      />
    ),
    intlShape: {}, // optional, prevents prop-type warnings
  };
});

jest.mock('../../data/hooks', () => ({
  useIsVisibilityEnabled: () => true,
}));

describe('FormControls', () => {
  it('renders Save button label when saveState is null', () => {
    render(<FormControls {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: messages['profile.formcontrols.button.save'].id }),
    ).toBeInTheDocument();
  });

  it('renders Saved label when saveState is complete', () => {
    render(<FormControls {...defaultProps} saveState="complete" />);
    expect(
      screen.getByRole('button', { name: messages['profile.formcontrols.button.saved'].id }),
    ).toBeInTheDocument();
  });

  it('renders Saving label when saveState is pending', () => {
    render(<FormControls {...defaultProps} saveState="pending" />);
    expect(
      screen.getByRole('button', { name: messages['profile.formcontrols.button.saving'].id }),
    ).toBeInTheDocument();
  });

  it('calls cancelHandler when Cancel button is clicked', () => {
    render(<FormControls {...defaultProps} />);
    fireEvent.click(
      screen.getByRole('button', { name: messages['profile.formcontrols.button.cancel'].id }),
    );
    expect(defaultProps.cancelHandler).toHaveBeenCalled();
  });
});
