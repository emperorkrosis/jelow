// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Constructor.
 */
advent.Animation = function(el, frames) {
  this.timerId_ = null;
  this.element_ = el;
  this.frames_ = frames;
  this.counter_ = -1;
};

advent.Animation.prototype.start = function() {
  var timeout = (this.counter_ == -1) ? 1000 : this.frames_[this.counter_][1];
  this.counter_++;
  if (this.counter_ >= this.frames_.length) {
    this.counter_ = 0;
  }
  var object = this;
  this.timerId_ = window.setTimeout(function() {
        object.tick();
      }, timeout);
};

advent.Animation.prototype.tick = function() {
  this.element_.src = this.frames_[this.counter_][0];
  this.start();
};

advent.Animation.prototype.stop = function() {
  if (this.timerId_ != null) {
    window.clearTimeout(this.timerId_);
  }
  this.timerId_ = null;
  this.counter_ = 0;
};
