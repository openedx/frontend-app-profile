import { useLocation } from 'react-router-dom';
import { productTypes as acceptedProductTypes, COURSE } from './constants';

const defaultSetting = [COURSE];

/*
 * Hook that calls the useLocation() hook from react-router-dom to have a reference to the query string in the URL.
 * The returned array determines the order in which the recommendations will appear to the user.
 *
 * @return {Array[String]} productTypes - An array of strings that represent each line of business
 */
// eslint-disable-next-line import/prefer-default-export
export const useProductTypes = () => {
  const { search } = useLocation();
  const checkedTypes = [];

  if (search) {
    // remove the "?" and split the query string at "="
    const splitString = search.slice(1).split('=');

    // if the key is not "product_types", use a default setting
    if (splitString[0] !== 'product_types') {
      return defaultSetting;
    }

    // split productTypes string into an array at ","
    const queryProductTypes = splitString[1]?.split(',');

    // compare each product type from the query string with a list of accepted product types
    queryProductTypes.forEach(productType => {
      if (acceptedProductTypes.includes(productType)) {
        checkedTypes.push(productType);
      }
    });
  }

  // if no types were set, use default setting
  return checkedTypes.length > 0 ? checkedTypes : defaultSetting;
};
