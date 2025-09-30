import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import siteConfig from 'site.config';
import { mergeSiteConfig, addAppConfigs } from '@openedx/frontend-base';

mergeSiteConfig(siteConfig);
addAppConfigs();
