|Build Status| |Coveralls| |npm_version| |npm_downloads| |license|

frontend-app-profile
=========================

Please tag **@edx/arch-team** on any PRs or issues.

Introduction
------------

React app for user account management.

Important Note
--------------

The production Webpack configuration for this repo uses `Purgecss <https://www.purgecss.com/>`_ 
to remove unused CSS from the production css file. In webpack/webpack.prod.config.js the Purgecss
plugin is configured to scan directories to determine what css selectors should remain. Currently
the src/ directory is scanned along with all @edx/frontend-component* node modules and paragon.
If you add and use a component in this repo that relies on HTML classes or ids for styling you
must add it to the Purgecss configuration or it will be unstyled in the production build. 

.. |Build Status| image:: https://api.travis-ci.org/edx/frontend-app-profile.svg?branch=master
   :target: https://travis-ci.org/edx/frontend-app-profile
.. |Coveralls| image:: https://img.shields.io/coveralls/edx/frontend-app-profile.svg?branch=master
   :target: https://coveralls.io/github/edx/frontend-app-profile
.. |npm_version| image:: https://img.shields.io/npm/v/@edx/frontend-app-profile.svg
   :target: @edx/frontend-app-profile
.. |npm_downloads| image:: https://img.shields.io/npm/dt/@edx/frontend-app-profile.svg
   :target: @edx/frontend-app-profile
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-profile.svg
   :target: @edx/frontend-app-profile
