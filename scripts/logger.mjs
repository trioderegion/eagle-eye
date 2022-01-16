/* Code used with permission:
 *  Copyright (c) 2020-2021 DnD5e Helpers Team and Contributors
 *  Full License at "scripts/licenses/DnD5e-Helpers-LICENSE"
 */

import { CONFIG } from './config.mjs'

export class logger {
  static NAME = this.name;

  static info(...args) {
    console.log(`${COMMON?.DATA?.title || "" }  | `, ...args);
  }

  static debug(...args) {
    if (CONFIG.setting('debug'))
      this.info("DEBUG | ", ...args);
  }

  static error(notify, ...args) {
    console.error(`${COMMON?.DATA?.title || "" } | ERROR | `, ...args);

    if(notify) {
      ui.notifications.error(`${COMMON?.DATA?.title || "" } | ERROR | ${args[0]}`);
    }
  }

  static warning(notify, ...args) {
    console.warn(`${COMMON?.DATA?.title || "" } | WARNING | `, ...args);
    if(notify) this.warn(...args)
  }

  static notify(...args) {
    ui.notifications.notify(`${args[0]}`);
  }

  static warn(...args) {
    ui.notifications.warn(`${args[0]}`);
  }

  static register(){
    logger.settings()
  }

  static settings(){
    const config = true;
    const settingsData = {
      debug : {
        scope: "client", config, default: false, type: Boolean,
      },
    };

    CONFIG.applySettings(settingsData);
  }
}
