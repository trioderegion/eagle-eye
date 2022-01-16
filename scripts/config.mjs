import { MODULE } from './module.mjs'

export class CONFIG {

  static MODULE = {
    NAME: 'eagle-eye',
    PATH: '/modules/eagle-eye',
    TITLE: 'Eagle Eye'
  }

  static register() {

    /* create the container if it doesnt already exist */
    if(!game[CONFIG.MODULE.NAME]) {
      game[CONFIG.MODULE.NAME] = {}
    }

    game[CONFIG.MODULE.NAME].CONFIG = this.MODULE;
  }

  /* ------------------ */
  static get() {
    game[this.MODULE.NAME].CONFIG;
  }

  static applySettings(settingsData) {
    Object.entries(settingsData).forEach(([key, data]) => {
      game.settings.register(
        CONFIG.MODULE.NAME, key, {
          name: MODULE.localize(`setting.${key}.name`),
          hint: MODULE.localize(`setting.${key}.hint`),
          ...data
        }
      );
    });
  }

  static setting(key) {
    return game.settings.get(CONFIG.get().NAME, key);
  }
}
