#####################
frontend-app-profile
#####################

|license-badge| |status-badge| |ci-badge| |codecov-badge|

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-app-profile.svg
    :target: https://github.com/openedx/frontend-app-profile/blob/main/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen

.. |ci-badge| image:: https://github.com/openedx/frontend-app-profile/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-app-profile/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-app-profile/coverage.svg?branch=main
    :target: https://codecov.io/github/openedx/frontend-app-profile?branch=main
    :alt: Codecov

********
Purpose
********

This is a micro-frontend application responsible for the display and updating of user profiles.

When a user views their own profile, they're given fields to edit their full name, location, primary spoken language, education, social links, and bio.  Each field also has a dropdown to select the visibility of that field - i.e., whether it can be viewed by other learners.

When a user views someone else's profile, they see all those fields that that user set as public.

***************
Getting Started
***************

Installation
============

Follow these steps to provision, run, and enable an instance of the
Profile MFE for local development via the `devstack`_.

.. _devstack: https://github.com/openedx/devstack#getting-started

#. To use this application, `devstack <https://github.com/openedx/devstack>`__ must be running and you must be logged into it.

   * Start devstack
   * Log in (http://localhost:18000/login)

#. To run Profile, install requirements and start the development server by running:

.. code-block::

  1. Clone your new repo:

    ``git clone https://github.com/openedx/frontend-app-profile.git``

  2. Use node v18.x.

    The current version of the micro-frontend build scripts support node 18.
    Using other major versions of node *may* work, but this is unsupported.  For
    convenience, this repository includes an .nvmrc file to help in setting the
    correct node version via `nvm <https://github.com/nvm-sh/nvm>`_.

  3. Install npm dependencies:

    ``cd frontend-app-profile && npm ci``

  4. Start the dev server:

    ``npm start``
     The server will run on port 1995

Once the dev server is up, visit http://localhost:1995/u/staff.

Plugins
=======
This MFE can be customized using `Frontend Plugin Framework <https://github.com/openedx/frontend-plugin-framework>`_.

The parts of this MFE that can be customized in that manner are documented `here </src/plugin-slots>`_.

Configuration
=============

This MFE is configured via node environment variables supplied at build time. See the .env file for the list of required environment variables. Example build syntax with a single environment variable:

.. code-block::

   NODE_ENV=production ACCESS_TOKEN_COOKIE_NAME='edx-jwt-cookie-header-payload' npm run build

Getting Help
============

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.  Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.  Please tag **@openedx/2u-infinity** on any PRs or issues.

https://github.com/openedx/frontend-app-profile/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/getting-help

License
=======

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
============

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

The Open edX Code of Conduct
============================

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

People
======

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://backstage.herokuapp.com/catalog/default/component/frontend-app-profile

Reporting Security Issues
=========================

Please do not report security issues in public.  Email security@openedx.org instead.
