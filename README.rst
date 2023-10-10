|Build Status| |Codecov| |license|

frontend-app-profile
====================

This is a micro-frontend application responsible for the display and updating of user profiles. Please tag **@openedx/2u-aperture** on any PRs or issues.

When a user views their own profile, they're given fields to edit their full name, location, primary spoken language, education, social links, and bio.  Each field also has a dropdown to select the visibility of that field - i.e., whether it can be viewed by other learners.

When a user views someone else's profile, they see all those fields that that user set as public.

----------

Development
-----------

Start Devstack
^^^^^^^^^^^^^^

To use this application `devstack <https://github.com/openedx/devstack>`__ must be running and you must be logged into it.

-  Start devstack
-  Log in (http://localhost:18000/login)

Start the development server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this project, install requirements and start the development server by running:

.. code:: bash

   npm install
   npm start # The server will run on port 1995

Once the dev server is up visit http://localhost:1995/u/staff.

----------

Configuration and Deployment
----------------------------

This MFE is configured via node environment variables supplied at build time. See the .env file for the list of required environment variables. Example build syntax with a single environment variable:

.. code:: bash

   NODE_ENV=production ACCESS_TOKEN_COOKIE_NAME='edx-jwt-cookie-header-payload' npm run build


For more information see the document: `Micro-frontend applications in Open
edX <https://edx.readthedocs.io/projects/edx-developer-docs/en/latest/micro-frontends-in-open-edx.html>`__.

.. |Build Status| image:: https://api.travis-ci.org/edx/frontend-app-profile.svg?branch=master
   :target: https://travis-ci.org/edx/frontend-app-profile
.. |Codecov| image:: https://img.shields.io/codecov/c/github/edx/frontend-app-profile
   :target: https://codecov.io/gh/edx/frontend-app-profile
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-profile.svg
   :target: @edx/frontend-app-profile
