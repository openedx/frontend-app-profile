|Build Status| |Codecov| |npm_version| |license|

frontend-app-profile
====================

This is a micro-frontend application responsible for the display and
updating of user profiles. Please tag **@edx/arch-fed** on any PRs or
issues.

For information on configuration and deployment see the documentation:
`Micro-frontend applications in Open
edX <https://github.com/edx/edx-developer-docs/blob/5191e800bf16cf42f25c58c58f983bdaf7f9305d/docs/micro-frontends-in-open-edx.rst>`__.

Development
-----------

To use this application `devstack <https://github.com/edx/devstack>`__
must be running and you must be logged into it.

-  Start devstack
-  Log in (http://localhost:18000/login)

Start the development server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this project, install requirements and start the development server
by running:

.. code:: bash

   npm install
   npm start # The server will run on port 1995

Once the dev server is up visit http://localhost:1995/u/staff.

Notes
-----

The production Webpack configuration for this repo uses
`Purgecss <https://www.purgecss.com/>`__ to remove unused CSS from the
production css file. In ``webpack.prod.config.js`` the Purgecss plugin
is configured to scan directories to determine what css selectors should
remain. Currently the src/ directory is scanned along with all
``@edx/frontend-component*`` node modules and ``@edx/paragon``. **If you
add and use a component in this repo that relies on HTML classes or ids
for styling you must add it to the Purgecss configuration or it will be
unstyled in the production build.**

.. |Build Status| image:: https://api.travis-ci.org/edx/frontend-app-profile.svg?branch=master
   :target: https://travis-ci.org/edx/frontend-app-profile
.. |Codecov| image:: https://img.shields.io/codecov/c/github/edx/frontend-app-profile
   :target: https://codecov.io/gh/edx/frontend-app-profile
.. |npm_version| image:: https://img.shields.io/npm/v/@edx/frontend-app-profile.svg
   :target: https://www.npmjs.com/package/@edx/frontend-app-profile
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-profile.svg
   :target: @edx/frontend-app-profile
