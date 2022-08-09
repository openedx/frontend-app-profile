import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  close: {
    id: 'general.altText.close',
    defaultMessage: 'Close',
    description: 'Text used as an aria-label to describe closing or dismissing a component',
  },
  registerLowercase: {
    id: 'learning.logistration.register', // ID left for historical purposes
    defaultMessage: 'register',
    description: 'Text in a link, prompting the user to create an account.  Used in "learning.logistration.alert"',
  },
  registerSentenceCase: {
    id: 'general.register.sentenceCase',
    defaultMessage: 'Register',
    description: 'Text in a button, prompting the user to register.',
  },
  signInLowercase: {
    id: 'learning.logistration.login', // ID left for historical purposes
    defaultMessage: 'Login',
    description: 'Text in a link, prompting the user to log in.  Used in "learning.logistration.alert"',
  },
  signInSentenceCase: {
    id: 'general.signIn.sentenceCase',
    defaultMessage: 'Login',
    description: 'Text in a button, prompting the user to log in.',
  },
  Explore:{
    id: 'learning.Explore courses', 
    defaultMessage: 'Explore',
    description: 'Text in a button, prompting the user to the courses page.',
  }
});

export default messages;
