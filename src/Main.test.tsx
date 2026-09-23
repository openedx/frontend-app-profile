import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getAnalyticsService, IntlProvider } from '@openedx/frontend-base';

import Main from '@src/Main';

const renderMain = (initialEntries = ['/profile/u/staff']) => render(
  <IntlProvider locale="en">
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="profile" element={<Main />}>
          <Route path="u/:username" element={<div>profile page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  </IntlProvider>,
);

describe('Main', () => {
  it('renders the current route in the main landmark and sets the document title', async () => {
    renderMain();

    expect(screen.getByRole('main')).toHaveTextContent('profile page');
    // The class the app's stylesheet is scoped to.
    expect(screen.getByRole('main')).toHaveClass('profile-app');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    await waitFor(() => expect(document.title).toBe('Profile | localhost'));
  });

  it('sends a page event, as the authenticated page route used to', async () => {
    renderMain();

    await waitFor(() => expect(getAnalyticsService().sendPageEvent).toHaveBeenCalled());
  });
});
