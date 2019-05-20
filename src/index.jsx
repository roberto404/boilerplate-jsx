
import request from 'superagent';

// 94Kb
import Application from '@1studio/utils/models/application';


/* !- Redux Store */

// 163Kb
import store from '@1studio/ui/store';
import { createUserStorage } from '@1studio/ui/authentication/reducers';


/* !- React Elements */

import AppElement from './app';


/* !- Assets */

require('../assets/style/index.scss');
require('../assets/html/index.pug');


/* !- Constants */

/**
 * @type {String} config postfix dynamic timestamp on prod mode.
 */
const configPostfix = (process.env.NODE_ENV === 'production') ?
  `@${new Date().getTime()}` : '';


/**
 * Initialization
 *
 * 1. Load public config
 * 2. Create Redux Store with unique user storeage
 * 3. Create Application model with store, config and use one React App every url path (action).
 */
const init = () =>
  request
    .get(`/json/app${configPostfix}.json`)
    .then((response) =>
    {
      const config = response.body;

      createUserStorage({}, { password: '%>"oo[In!>>"4FqU', key: 'user', sessionTime: 30 * 24 * 60 });

      /**
       * App Class ~100Kb, include: ui/Store, Crypto, PropTypes.
       * Base Package ~330Kb, include: ui/App, React, Redux.
       * @type {Application}
       */
      const App = new Application({
        store: store(),
        config,
        actions: {
          '.*': [AppElement],
        },
      });

      if (config.application.global || process.env.NODE_ENV !== 'production')
      {
        window.App = App;
      }
    });

  window.onload = init;
