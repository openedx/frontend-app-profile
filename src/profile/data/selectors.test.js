import { getCountryList, getLocale } from '@edx/frontend-platform/i18n';
import { sortedCountriesSelector } from './selectors';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
  getCountryList: jest.fn(),
}));

const countries = [
  { code: 'CA', name: 'Canada' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
];

const buildState = ({ countriesCodesList, country = null }) => ({
  profilePage: {
    account: { country },
    countriesCodesList,
  },
});

describe('sortedCountriesSelector', () => {
  beforeEach(() => {
    getLocale.mockReturnValue('en');
    getCountryList.mockReturnValue(countries);
  });

  it('returns the full country list when the LMS sends no allow-list', () => {
    const result = sortedCountriesSelector(buildState({ countriesCodesList: [] }));

    expect(result).toEqual(countries);
  });

  it('keeps only allow-listed countries when the LMS sends a list', () => {
    const result = sortedCountriesSelector(buildState({ countriesCodesList: ['US', 'CA'] }));

    expect(result.map(({ code }) => code)).toEqual(['CA', 'US']);
  });

  it('always keeps the country already saved on the account', () => {
    const result = sortedCountriesSelector(buildState({ countriesCodesList: ['US'], country: 'UA' }));

    expect(result.map(({ code }) => code)).toEqual(['UA', 'US']);
  });
});
