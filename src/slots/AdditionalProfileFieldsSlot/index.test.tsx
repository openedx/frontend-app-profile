import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mergeSiteConfig, useSlotContext, WidgetOperationTypes } from '@openedx/frontend-base';

import * as api from '@src/profile/data/api';
import { profileKeys } from '@src/profile/data/queryKeys';
import { renderWithForm } from '@src/profile/test/renderWithForm';
import { createTestQueryClient } from '@src/tests/renderWithProviders';
import AdditionalProfileFieldsSlot from '@src/slots/AdditionalProfileFieldsSlot';

jest.mock('@src/profile/data/api');

// A widget standing in for an operator's custom field, exercising every slot prop.
const Probe = () => {
  const context = useSlotContext();
  const updateUserProfile = context.updateUserProfile as (username: string, params: object) => void;
  const refreshUserProfile = context.refreshUserProfile as (username: string) => void;
  const formComponents = context.formComponents as Record<string, unknown>;

  return (
    <>
      <div data-testid="values">{JSON.stringify(context.profileFieldValues)}</div>
      <div data-testid="errors">{JSON.stringify(context.profileFieldErrors)}</div>
      <div data-testid="components">{Object.keys(formComponents).join(',')}</div>
      <button
        type="button"
        onClick={() => updateUserProfile('staff', {
          extendedProfile: [{ fieldName: 'favorite_color', fieldValue: 'red' }],
        })}
      >
        save
      </button>
      <button type="button" onClick={() => refreshUserProfile('staff')}>refresh</button>
    </>
  );
};

mergeSiteConfig({
  apps: [{
    appId: 'org.openedx.frontend.app.profileTest',
    slots: [{
      slotId: 'org.openedx.frontend.slot.profile.additionalProfileFields.v1',
      id: 'org.openedx.frontend.widget.profileTest.probe',
      op: WidgetOperationTypes.APPEND,
      component: Probe,
    }],
  }],
});

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
    jest.mocked(api.getAccount).mockResolvedValue(account);
  });

  it('hands the widgets the extended profile, the errors and the form components', () => {
    renderSlot({ form: { errors: { favorite_color: { userMessage: 'Not a color' } } } });

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
    jest.mocked(api.patchProfile).mockResolvedValue(updated);
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
