// Copyright 2011 Craig Prince. All Rights Reserved.

var advent = advent || {};

/**
 * Construct an action object. Actions for the basis of all interaction in
 * the game. An action can have a committed state as well as a tentative
 * state. The tentative state is ephemeral and only is used to represent a
 * potential future state of the action. Once an action is executed the
 * non-tentative state is used.
 * @constructor
 */
advent.Action = function() {
  /**
   * The verb component of the action.
   * @private {advent.Verb}
   */
  this.verb_ = null;

  /**
   * The tentative verb of the action.
   * @private {advent.Verb}
   */
  this.tentativeVerb_ = null;

  /**
   * The direct object of the action. The item or actor that will have the
   * action operated on.
   * @private {Object}
   */
  this.directObject_ = null;

  /**
   * The id for the direct object of the action.
   * @private {string}
   */
  this.directObjectId_ = null;

  /**
   * Tentative direct object.
   * @private {Object}
   */
  this.tentativeDirectObject_ = null;

  /**
   * The indirect object of the action. Useful only for some verbs.
   * @private {Object}
   */
  this.indirectObject_ = null;

  /**
   * The id of the indirect object of the action. Useful only for some verbs.
   * @private {Object}
   */
  this.indirectObjectId_ = null;

  /**
   * The indirect object of the action. Useful only for some verbs.
   * @private {Object}
   */
  this.tentativeIndirectObject_ = null;

  /**
   * Array of callbacks to be invoked whenever this action changes. Used
   * primarily by UI components to update the interface when the object
   * changes.
   * @type {Array.<Function>}
   */
  this.onchange = [];
};


/**
 * Enum for the action verbs.
 * TODO: These verbs will be different for every game and should probably be
 * provided as part of the API.
 * @enum {number}
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
 * Mapping from action to the verb sentence associated with that string.
 * TODO: These verbs will be different for every game and should probably be
 * provided as part of the API.
 * @type {Array.<string|boolean>}
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


/**
 * Whether the given action is a complete action or not. Actions can either
 * be complete and can then be executed or partial (i.e. pending).
 * @returns {boolean} Whether the given action is complete.
 */
advent.Action.prototype.isComplete = function() {
  if (this.verb_ !== null && this.directObject_ !== null) {
    return (this.indirectObject_ !== null ||
        (this.verb_ !== advent.Verb.GIVE && this.verb_ !== advent.Verb.USE));
  }
  return false;
};


/**
 * Set the verb for the current action. Setting the verb implicitly clears
 * the rest of the action.
 * @param {advent.Verb}
 */
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


/**
 * Set the tentative verb for the current action.
 * @param {advent.Verb}
 */
advent.Action.prototype.setTentativeVerb = function(verb) {
  if (this.getNonTentativeVerb() === null) {
    this.tentativeVerb_ = verb;
    this.verb_ = null;
  }
  this.update_();
};


/**
 * @returns {advent.Verb} The verb component of the action, ignoring any
 *     tentative verb that is set.
 */
advent.Action.prototype.getNonTentativeVerb = function() {
  return this.verb_;
};


/**
 * Get the verb of the action. If there is a tentative verb then that is
 * preferred and returned over the set verb.
 * @returns {advent.Verb} The verb that this action represents.
 */
advent.Action.prototype.getVerb = function() {
    return ((this.verb_ !== null) ? this.verb_ :
	((this.tentativeVerb_ !== null) ?
        this.tentativeVerb_ : null));
};


/**
 * Set a direct object for the action. Optionally, allow a default verb to
 * be passed in that will be set if there is not already a verb set for the
 * action.
 * @param {Object} The direct object.
 * @param {string} The id of the direct object.
 * @param {advent.Verb=} An optional verb that will be set for the action if
 *     there is not already a verb set.
 */
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


/**
 * Set the tentative direct object of the action.
 * @param {Object} The direct object.
 * @param {advent.Verb=} An optional verb that will be set for the action if
 *     there is not already a verb set.
 */
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


/**
 * Get the current direct object of the action.
 * @returns {Object}
 */
advent.Action.prototype.getDirectObject = function() {
    return ((this.directObject_ !== null) ? this.directObject_ :
        ((this.tentativeDirectObject_ !== null) ?
	this.tentativeDirectObject_ : null));
};


/**
 * Get the id of the current direct object of the action.
 * @returns {string}
 */
advent.Action.prototype.getDirectObjectId = function() {
    return this.directObjectId_;
};


/**
 * Return the current the indirect object of the action.
 * @returns {Object}
 */
advent.Action.prototype.getIndirectObject = function() {
    return (this.indirectObject_ !== null) ? this.indirectObject_ :
        ((this.tentativeIndirectObject_ !== null) ?
        this.tentativeIndirectObject_ : null);
};


/**
 * Get the id of the current indirect object of the action.
 * @returns {string}
 */
advent.Action.prototype.getIndirectObjectId = function() {
    return this.indirectObjectId_;
};


/**
 * Clear all tentative fields of this action.
 */
advent.Action.prototype.clearTentative = function() {
  this.tentativeIndirectObject_ = null;
  this.tentativeDirectObject_ = null;
  this.tentativeVerb_ = null;
  this.update_();
};


/**
 * Clear all fields of this action.
 */
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
 * Returns a textual representation of this action. This is useful for
 * displaying a description of the action in the UI. TODO: This should
 * probably be overridable by some games.
 * @returns {string}
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
 * Helper that handles the action changing. This will invoke the onchange
 * handlers so that they can update themselves to reflect the change.
 * @private
 */
advent.Action.prototype.update_ = function() {
  for (var i = 0 ; i < this.onchange.length; i++) {
    this.onchange[i](this);
  }
};
