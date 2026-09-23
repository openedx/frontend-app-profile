/* eslint-disable react/prop-types */
import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import * as api from '../../profile/data/api';
import { profileKeys } from '../../profile/data/queryKeys';
import { createTestQueryClient } from '../../tests/renderWithProviders';
import { renderWithForm } from '../../profile/test/renderWithForm';
import AdditionalProfileFieldsSlot from '.';

jest.mock('../../profile/data/api');

// A widget that exercises every slot prop.
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  Slot: ({
    id, profileFieldValues, profileFieldErrors, formComponents, updateUserProfile, refreshUserProfile,
  }) => (
    <div data-testid="slot" data-slot-id={id}>
      <span data-testid="values">{JSON.stringify(profileFieldValues)}</span>
      <span data-testid="errors">{JSON.stringify(profileFieldErrors)}</span>
      <span data-testid="components">{Object.keys(formComponents).join(',')}</span>
      <button
        type="button"
        onClick={() => updateUserProfile('staff', {
          extendedProfile: [{ fieldName: 'favorite_color', fieldValue: 'red' }],
        })}
      >
        save
      </button>
      <button type="button" onClick={() => refreshUserProfile('staff')}>refresh</button>
    </div>
  ),
}));

const account = {
  username: 'staff',
  extendedProfile: [{ fieldName: 'favorite_color', fieldValue: 'blue' }],
};

const renderSlot = ({ form = {} } = {}) => {
  // The account is already cached and never stale, so the slot does not fetch.
  const queryClient = createTestQueryClient({ staleTime: Infinity });
  queryClient.setQueryData(profileKeys.account('staff'), account);
  return renderWithForm(<AdditionalProfileFieldsSlot />, { form, queryClient });
};

describe('AdditionalProfileFieldsSlot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Only a refresh ever asks the server; the cache is seeded for everything else.
    api.getAccount.mockResolvedValue(account);
  });

  it('hands the widgets the extended profile, the errors and the form components', () => {
    renderSlot({ form: { errors: { favorite_color: { userMessage: 'Not a color' } } } });

    expect(screen.getByTestId('slot')).toHaveAttribute(
      'data-slot-id',
      'org.openedx.frontend.profile.additional_profile_fields.v1',
    );
    expect(screen.getByTestId('values')).toHaveTextContent(
      JSON.stringify([{ fieldName: 'favorite_color', fieldValue: 'blue' }]),
    );
    expect(screen.getByTestId('errors')).toHaveTextContent(
      JSON.stringify({ favorite_color: { userMessage: 'Not a color' } }),
    );
    expect(screen.getByTestId('components')).toHaveTextContent('SwitchContent,EmptyContent,EditableItemHeader');
    expect(api.getAccount).not.toHaveBeenCalled();
  });

  it('saves through the accounts API and shows the values the server returns', async () => {
    const updated = { extendedProfile: [{ fieldName: 'favorite_color', fieldValue: 'red' }] };
    api.patchProfile.mockResolvedValue(updated);
    const { queryClient } = renderSlot();

    fireEvent.click(screen.getByRole('button', { name: 'save' }));

    await waitFor(() => expect(api.patchProfile).toHaveBeenCalledWith('staff', updated));
    await waitFor(() => expect(screen.getByTestId('values')).toHaveTextContent(JSON.stringify(updated.extendedProfile)));
    expect(queryClient.getQueryData(profileKeys.account('staff'))).toEqual({ ...account, ...updated });
  });

  it('refreshes the profile on request', async () => {
    const { queryClient } = renderSlot();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    fireEvent.click(screen.getByRole('button', { name: 'refresh' }));

    await waitFor(() => expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: profileKeys.account('staff') }));
    await waitFor(() => expect(api.getAccount).toHaveBeenCalledWith('staff'));
  });
});
