
export class EagleEyeToken {

  static NAME = "EagleEyeToken";

  static register() {
    this.patch();
  }

  static _super = {};

  static patch() {

    const superFn = {
      isVisible: {
        get: this.isVisible
      },
      updateVisionSource: {
        value: this.updateVisionSource
      }
    }

    Object.entries(superFn).forEach( ([fn, override]) => {

      /* get the current version */
      const original = Object.getOwnPropertyDescriptor(Token.prototype, fn)

      /* if our copy already has a value here, we dont want to overwrite */
      if ( !Object.hasOwn(this._super, fn) ){ 
        Object.defineProperty(this._super, fn, original);
      }

      /* set the replacement function */
      Object.defineProperty(Token.prototype, fn, mergeObject(original, override));

    })
  }


  static isVisible() {
    const gm = game.user.isGM;
    if ( this.document.hidden ) return gm;
    if ( !canvas.effects.visibility.tokenVision ) return true;
    if ( this._controlled ) return true;
    if ( canvas.effects.visionSources.has(this.sourceId) ||
      canvas.effects.visionSources.has(this.sourceId+"_2") ||
      canvas.effects.visionSources.has(this.sourceId+"_3") ||
      canvas.effects.visionSources.has(this.sourceId+"_4")  ) return true;

    const tolerance = canvas.grid.size / 2

    return canvas.effects.visibility.testVisibility(this.center, {tolerance, object: this});
  }

  static updateVisionSource({defer=false, deleted=false, skipUpdateFog=false}={}) {
    if(!this.vision2) this.vision2 = new VisionSource({object: this});
    if(!this.vision3) this.vision3 = new VisionSource({object: this});
    if(!this.vision4) this.vision4 = new VisionSource({object: this});
    // Prepare data

    const sourceId = this.sourceId;
    const d = canvas.dimensions;
    const isVisionSource = this._isVisionSource();

    // Initialize vision source
    if ( isVisionSource && !deleted ) {
      this.vision.initialize({
        x: this.x + 2,
        y: this.y + 2,
        radius: Math.clamped(this.getLightRadius(this.document.sight.range), 0, d.maxR),
        externalRadius: this.externalRadius,
        angle: this.document.sight.angle,
        rotation: this.document.rotation,
        disabled: !this.document.sight.enabled,
        color: this.document.sight.color,
        contrast: this.document.sight.contrast,
        attenuation: this.document.sight.attenuation,
        saturation: this.document.sight.saturation,
        brightness: this.document.sight.brightness,
        visionMode: this.document.sight.visionMode,
        blinded: this.actor.statuses.has('blinded')
      });
      canvas.effects.visionSources.set(sourceId, this.vision);

      this.vision2.initialize({
        x: this.x + this.w - 2,
        y: this.y + 2,
        radius: Math.clamped(this.getLightRadius(this.document.sight.range), 0, d.maxR),
        externalRadius: this.externalRadius,
        angle: this.document.sight.angle,
        rotation: this.document.rotation,
        disabled: !this.document.sight.enabled,
        color: this.document.sight.color,
        contrast: this.document.sight.contrast,
        attenuation: this.document.sight.attenuation,
        saturation: this.document.sight.saturation,
        brightness: this.document.sight.brightness,
        visionMode: this.document.sight.visionMode,
        blinded: this.actor.statuses.has('blinded')
      });
      canvas.effects.visionSources.set(sourceId+"_2", this.vision2);

      this.vision3.initialize({
        x: this.x + this.w - 2,
        y: this.y + this.h - 2,
        radius: Math.clamped(this.getLightRadius(this.document.sight.range), 0, d.maxR),
        externalRadius: this.externalRadius,
        angle: this.document.sight.angle,
        rotation: this.document.rotation,
        disabled: !this.document.sight.enabled,
        color: this.document.sight.color,
        contrast: this.document.sight.contrast,
        attenuation: this.document.sight.attenuation,
        saturation: this.document.sight.saturation,
        brightness: this.document.sight.brightness,
        visionMode: this.document.sight.visionMode,
        blinded: this.actor.statuses.has('blinded')
      });
      canvas.effects.visionSources.set(sourceId+"_3", this.vision3);

      this.vision4.initialize({
        x: this.x + 2,
        y: this.y + this.h - 2,
        radius: Math.clamped(this.getLightRadius(this.document.sight.range), 0, d.maxR),
        externalRadius: this.externalRadius,
        angle: this.document.sight.angle,
        rotation: this.document.rotation,
        disabled: !this.document.sight.enabled,
        color: this.document.sight.color,
        contrast: this.document.sight.contrast,
        attenuation: this.document.sight.attenuation,
        saturation: this.document.sight.saturation,
        brightness: this.document.sight.brightness,
        visionMode: this.document.sight.visionMode,
        blinded: this.actor.statuses.has('blinded')
      });
      canvas.effects.visionSources.set(sourceId+"_4", this.vision4);
    }
    // Remove vision source
    else {
      canvas.effects.visionSources.delete(sourceId);
      canvas.effects.visionSources.delete(sourceId+"_2");
      canvas.effects.visionSources.delete(sourceId+"_3");
      canvas.effects.visionSources.delete(sourceId+"_4");
    } 

    // Schedule a perception update
    if ( !defer && (isVisionSource || deleted) ) canvas.perception.update({
      refreshVision: true
    }, true);
  }
}

