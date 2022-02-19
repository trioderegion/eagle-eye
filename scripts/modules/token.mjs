
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
      }
    };

    Object.entries(superFn).forEach( ([fn, override]) => {

      /* get the current version */
      const original = Object.getOwnPropertyDescriptor(Token.prototype, fn)

      /* if our copy already has a value here, we dont want to overwrite */
      if ( !Object.hasOwn(this._super, fn) ){ 
        Object.defineProperty(this._super, fn, original);
      }

      /* set the replacement function */
      Object.defineProperty(Token.prototype, fn, mergeObject(original, override));

    });

    libWrapper.register(
      "eagle-eye",
      "Token.prototype.updateVisionSource",
      EagleEyeToken.updateVisionSource,
      "OVERRIDE"
    )
  }


  static isVisible() {
    const gm = game.user.isGM;
    if ( this.data.hidden ) return gm;
    if ( !canvas.sight.tokenVision ) return true;
    if ( this._controlled ) return true;
    if ( canvas.sight.sources.has(this.sourceId) ||
      canvas.sight.sources.has(this.sourceId+"_2") ||
      canvas.sight.sources.has(this.sourceId+"_3") ||
      canvas.sight.sources.has(this.sourceId+"_4")  ) return true;

    const tolerance = canvas.grid.size / 2;

    return canvas.sight.testVisibility(this.center, {tolerance, object: this});
  }

  static updateVisionSource({defer=false, deleted=false, skipUpdateFog=false}={}) {
    if(!this.vision2) this.vision2 = new VisionSource(this);
    if(!this.vision3) this.vision3 = new VisionSource(this);
    if(!this.vision4) this.vision4 = new VisionSource(this);
    // Prepare data

    const sourceId = this.sourceId;
    const d = canvas.dimensions;
    const isVisionSource = this._isVisionSource();

    // Initialize vision source
    if ( isVisionSource && !deleted ) {
      this.vision.initialize({
        x: this.x + 2,
        y: this.y + 2,
        dim: Math.clamped(this.getLightRadius(this.data.dimSight), 0, d.maxR),
        bright: Math.clamped(this.getLightRadius(this.data.brightSight), 0, d.maxR),
        angle: this.data.sightAngle,
        rotation: this.data.rotation
      });
      canvas.sight.sources.set(sourceId, this.vision);

      this.vision2.initialize({
        x: this.x + this.w - 2,
        y: this.y + 2,
        dim: Math.clamped(this.getLightRadius(this.data.dimSight), 0, d.maxR),
        bright: Math.clamped(this.getLightRadius(this.data.brightSight), 0, d.maxR),
        angle: this.data.sightAngle,
        rotation: this.data.rotation
      });
      canvas.sight.sources.set(sourceId+"_2", this.vision2);

      this.vision3.initialize({
        x: this.x + this.w - 2,
        y: this.y + this.h - 2,
        dim: Math.clamped(this.getLightRadius(this.data.dimSight), 0, d.maxR),
        bright: Math.clamped(this.getLightRadius(this.data.brightSight), 0, d.maxR),
        angle: this.data.sightAngle,
        rotation: this.data.rotation
      });
      canvas.sight.sources.set(sourceId+"_3", this.vision3);

      this.vision4.initialize({
        x: this.x + 2,
        y: this.y + this.h - 2,
        dim: Math.clamped(this.getLightRadius(this.data.dimSight), 0, d.maxR),
        bright: Math.clamped(this.getLightRadius(this.data.brightSight), 0, d.maxR),
        angle: this.data.sightAngle,
        rotation: this.data.rotation
      });
      canvas.sight.sources.set(sourceId+"_4", this.vision4);
    }
    // Remove vision source
    else {
      canvas.sight.sources.delete(sourceId);
      canvas.sight.sources.delete(sourceId+"_2");
      canvas.sight.sources.delete(sourceId+"_3");
      canvas.sight.sources.delete(sourceId+"_4");
    } 

    // Schedule a perception update
    if ( !defer && (isVisionSource || deleted) ) canvas.perception.schedule({
      sight: {refresh: true, skipUpdateFog}
    });
  }
}

