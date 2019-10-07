2. Build time customization using NPM aliases
---------------------------------------------

Status
------

Accepted

Context
-------

Frontend applications created throughout FY2019 contain hardcoded edX brand specific elements
such as the site's header, footer, logo, visual style, and navigational links. This enabled
teams to move more quickly in efforts to adopt a micro-frontend architecture to enable more
rapid UI innovation in the future. There was no easy path for these new applications to be
incorporated into the Open edX platform where they need to be branded properly.

Decision
--------

In order to make frontend applications brand agnostic, we will split branded elements into
npm packages such as ``frontend-component-header``. Frontend applications will expect to
find components or other exports according to a defined interface. Package interfaces will
be defined in the README for each npm package repository.

.. code-block:: javascript

  // exports React component as default and a 'messages' object for i18n 
  import Header, { messages } from '@edx/frontend-component-header';

To build a frontend application for a specific brand (edX or other Open edX implementation) we
will leverage npm aliases to override these npm packages with branded packages that implement the
same interface before build. For example, ``frontend-component-header`` will be overriden with
``frontend-component-header-edx``. This is done using the 
`npm alias syntax introduced in version 6.9.0`_. 

We install aliases using the syntax below:

.. code-block:: bash
  
  # npm install <package-name>@<type>:<branded-package>
  
  # npm package
  npm install @edx/frontend-component-header@npm:@edx/frontend-component-header-edx@latest

  # git repository
  npm install @edx/frontend-component-header@git:https://github.com/edx/frontend-component-header-edx.git
  
  # local folder
  npm install @edx/frontend-component-header@file:../path/to/local/module/during/build

After installing overrides using npm aliases, we build the project normally:

.. code-block:: bash

  npm run build

Using this mechanism branded packages are substituted for the default unbranded packages at build
and deployment time.

.. _npm alias syntax introduced in version 6.9.0: https://github.com/npm/rfcs/blob/latest/implemented/0001-package-aliases.md

Consequences
------------

One drawback of this process is the inability to automatically test substituted packages before
deployment. This is a risk we are willing to accept until it becomes an issue.

edX has built a deployment pipeline that will read configuration for npm packages to override
and alias. This code is open source but heavily catered to edX's specific deployment needs.
The Open edX community will need to collaborate on a simpler, less opinionated build and 
deployment process for micro-frontend applications.
