// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Constructor.
 */
advent.Action = function() {
  this.verb_ = null;
  this.tentativeVerb_ = null;
  this.directObject_ = null;
  this.directObjectId_ = null;
  this.tentativeDirectObject_ = null;
  this.indirectObject_ = null;
  this.indirectObjectId_ = null;
  this.tentativeIndirectObject_ = null;
  this.onchange = [];
};


/**
 * Enum for the action verb.
 */
advent.Verb = {
  GIVE: 0,
  OPEN: 1,
  CLOSE: 2,
  PICKUP: 3,
  LOOKAT: 4,
  TALKTO: 5,
  USE: 6,
  PUSH: 7,
  PULL: 8,
  WALKTO: 9
};


/**
 * The properties of the actions.
 */
advent.Action.VerbProperties = [
  ['Give', true, 'to'], 
  ['Open', false],
  ['Close', false],
  ['Pick up', false],
  ['Look at', false],
  ['Talk to', false],
  ['Use', true, 'on'],
  ['Push', false],
  ['Pull', false],
  ['Walk to', false]
];


advent.Action.prototype.isComplete = function() {
  if (this.verb_ !== null && this.directObject_ !== null) {
    return (this.indirectObject_ !== null ||
        (this.verb_ !== advent.Verb.GIVE && this.verb_ !== advent.Verb.USE));
  }
  return false;
};


advent.Action.prototype.setTentativeVerb = function(verb) {
  if (this.getNonTentativeVerb() === null) {
    this.tentativeVerb_ = verb;
    this.verb_ = null;
  }
  this.update_();
};


advent.Action.prototype.setVerb = function(verb) {
  this.verb_ = verb;
  this.tentativeVerb_ = null;
  this.directObject_ = null;
  this.directObjectId_ = null;
  this.tentativeDirectObject_ = null;
  this.indirectObject_ = null;
  this.indirectObjectId_ = null;
  this.tentativeIndirectObject_ = null;
  this.update_();
};


advent.Action.prototype.setObject = function(txt, id, opt_defaultVerb) {
  if (this.getNonTentativeVerb() === null && opt_defaultVerb !== undefined) {
    this.setVerb(opt_defaultVerb);
  }
  if (this.getVerb() !== null) {
    if (this.directObject_ === null) {
      this.directObject_ = txt;
      this.directObjectId_ = id;
    } else if (this.indirectObject_ === null) {
      this.indirectObject_ = txt;
      this.indirectObjectId_ = id;
    }
    this.tentativeDirectObject_ = null;
    this.tentativeIndirectObject_ = null;
  }
  this.update_();
};

advent.Action.prototype.setTentativeObject = function(txt, opt_defaultVerb) {
  if (this.getNonTentativeVerb() == null && opt_defaultVerb !== undefined) {
    this.setTentativeVerb(opt_defaultVerb);
  }
  if (this.getVerb() != null) {
    if (this.directObject_ === null) {
      this.tentativeDirectObject_ = txt;
    } else if (this.indirectObject_ === null) {
      this.tentativeIndirectObject_ = txt;
    }
  }
  this.update_();
};

advent.Action.prototype.getNonTentativeVerb = function() {
  return this.verb_;
};


/**
 * Get the verb of the action.
 */
advent.Action.prototype.getVerb = function() {
    return ((this.verb_ !== null) ? this.verb_ :
	((this.tentativeVerb_ !== null) ?
        this.tentativeVerb_ : null));
};

/**
 * Get the direct object of the action.
 */
advent.Action.prototype.getDirectObject = function() {
    return ((this.directObject_ !== null) ? this.directObject_ :
        ((this.tentativeDirectObject_ !== null) ?
	this.tentativeDirectObject_ : null));
};


/**
 * Get the direct object id of the action.
 */
advent.Action.prototype.getDirectObjectId = function() {
    return this.directObjectId_;
};


/**
 * Get the indirect object of the action.
 */
advent.Action.prototype.getIndirectObject = function() {
    return (this.indirectObject_ !== null) ? this.indirectObject_ :
        ((this.tentativeIndirectObject_ !== null) ?
        this.tentativeIndirectObject_ : null);
};


/**
 * Get the direct object id of the action.
 */
advent.Action.prototype.getIndirectObjectId = function() {
    return this.indirectObjectId_;
};


/**
 * Clear all the tentative values.
 */
advent.Action.prototype.clearTentative = function() {
  this.tentativeIndirectObject_ = null;
  this.tentativeDirectObject_ = null;
  this.tentativeVerb_ = null;
  this.update_();
};

advent.Action.prototype.clearAction = function() {
  this.indirectObject_ = null;
  this.indirectObject_ = null;
  this.tentativeIndirectObject_ = null;
  this.directObject_ = null;
  this.directObjectId_ = null;
  this.tentativeDirectObject_ = null;
  this.verb_ = null;
  this.tentativeVerb_ = null;
  this.update_();
};

/**
 * Get textual representation of an action.
 */
advent.Action.prototype.getText = function() {
  var text = '';
  var verb = this.getVerb();
  var directObject = this.getDirectObject();
  var indirectObject = this.getIndirectObject();
  if (verb !== null) {
    var props = advent.Action.VerbProperties[verb];
    text += props[0];
    if (directObject !== null) {
      text += ' ' + directObject;
      if (props[1]) {
        text += ' ' + props[2];
        if (indirectObject) {
	  text += ' ' + indirectObject;
        }
      }
    }
  }
  return text;
};


/**
 * Handle the action changing. Inform the current area of the change.
 */
advent.Action.prototype.update_ = function() {
  for (var i = 0 ; i < this.onchange.length; i++) {
    this.onchange[i](this);
  }
};
