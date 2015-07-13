'use strict';

export default class Generator {
  constructor(instance, speed) {
    this.instance = instance;
    this.speed = speed || instance.options.animationTime;
    this.fn = null;
    this.timer = null;
  }

  run(fn) {
    this.fn = fn(this.instance);
    this.play();
  }

  runAnimation(animation) {
    if (Array.isArray(animation)) {
      return animation.forEach(this.runAnimation, this);
    }

    if (typeof animation === 'function') {
      return animation(this.instance);
    }

    var type = this.instance[animation.type];
    return type[animation.op].apply(type, animation.args || []);
  }

  play(value) {
    var self = this;
    var next = this.fn.next(value);
    if (!next.done) {
      this.runAnimation(next.value);
      this.timer = setTimeout(function () {
        self.play(next.value);
      }, this.speed);
    }
  }

  pause() {
    clearTimeout(this.timer);
  }
}
