import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'profile.education.education': {
    id: 'profile.education.education',
    defaultMessage: 'Education',
    description: 'A section of a user profile',
  },
  'profile.education.levels.p': {
    id: 'profile.education.levels.p',
    defaultMessage: 'Doctorate',
    description: 'Selected by the user if their highest level of education is a doctorate degree.',
  },
  'profile.education.levels.m': {
    id: 'profile.education.levels.m',
    defaultMessage: "Master's or professional degree",
    description: "Selected by the user if their highest level of education is a master's or professional degree from a college or university.",
  },
  'profile.education.levels.b': {
    id: 'profile.education.levels.b',
    defaultMessage: "Bachelor's Degree",
    description: "Selected by the user if their highest level of education is a four year college or university bachelor's degree.",
  },
  'profile.education.levels.a': {
    id: 'profile.education.levels.a',
    defaultMessage: "Associate's degree",
    description: "Selected by the user if their highest level of education is an associate's degree. 1-2 years of college or university.",
  },
  'profile.education.levels.hs': {
    id: 'profile.education.levels.hs',
    defaultMessage: 'Secondary/high school',
    description: 'Selected by the user if their highest level of education is secondary or high school.  9-12 years of education.',
  },
  'profile.education.levels.jhs': {
    id: 'profile.education.levels.jhs',
    defaultMessage: 'Junior secondary/junior high/middle school',
    description: 'Selected by the user if their highest level of education is junior or middle school. 6-8 years of education.',
  },
  'profile.education.levels.el': {
    id: 'profile.education.levels.el',
    defaultMessage: 'Elementary/primary school',
    description: 'Selected by the user if their highest level of education is elementary or primary school.  1-5 years of education.',
  },
  'profile.education.levels.none': {
    id: 'profile.education.levels.none',
    defaultMessage: 'No formal education',
    description: 'Selected by the user to describe their education.',
  },
  'profile.education.levels.o': {
    id: 'profile.education.levels.o',
    defaultMessage: 'Other education',
    description: 'Selected by the user if they have a type of education not described by the other choices.',
  },
});

export default messages;
