import { ReactElement } from 'react';
import { BrowserRouter as Router } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render } from '@testing-library/react';
import i18n from '../tests/i18n-test-config';
import { setupStore } from 'core/store/configureStore';
// Need to implement
// import { mockState } from './common-store-state';

export const renderWithProviders = (ui: ReactElement, state = {}) => {
  const store = setupStore({ ...state });

  return render(
    <Router>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
      </Provider>
    </Router>,
  );
};

export * from '@testing-library/react';
