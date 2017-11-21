"use strict";

/**
 * @mixin $widgets.BinaryStateful
 * @extends $widget.Stateful
 * @augments $widget.Widget
 */
$widgets.BinaryStateful = $oop.getClass('$widgets.BinaryStateful')
.blend($widget.Stateful)
.expect($widget.Widget) // todo Move to Stateful
.define(/** @lends $widgets.BinaryStateful# */{
  /**
   * @member {$data.Collection} $widgets.BinaryStateful#binaryStates
   */

  /** @ignore */
  defaults: function () {
    this.binaryStates = this.binaryStates || $data.Collection.create();
  },

  /**
   * @param {string} stateName
   * @param {boolean} [cascades]
   * @returns {$widgets.BinaryStateful}
   */
  addBinaryState: function (stateName, cascades) {
    var binaryStates = this.binaryStates,
        binaryState;
    if (!binaryStates.getValue(stateName)) {
      binaryState = $widgets.BinaryState.create({
        stateName: stateName,
        cascades: cascades
      });
      binaryStates.setItem(stateName, binaryState);
    }
    return this;
  },

  /**
   * @param {string} stateName
   * @param {string} stateSourceId
   * @returns {$widgets.BinaryStateful}
   */
  addBinaryStateSourceId: function (stateName, stateSourceId) {
    var binaryState = this.binaryStates.getValue(stateName),
        stateOnBefore = binaryState.isStateOn(),
        stateOnAfter;

    binaryState.addStateSourceId(stateSourceId);
    stateOnAfter = binaryState.isStateOn();

    if (stateOnAfter && !stateOnBefore) {
      // state got switched on
      if (binaryState.cascades &&
          stateSourceId !== $widgets.BINARY_STATE_SOURCE_ID_IMPOSED
      ) {
        // imposing cascading state on children
        this.getAllChildNodes()
        .filter(function (childNode) {
          return $widgets.BinaryStateful.mixedBy(childNode) &&
              childNode.binaryStates.getValue(stateName);
        })
        .forEach(function (binaryStateful) {
          binaryStateful.addBinaryStateSourceId(
              stateName, $widgets.BINARY_STATE_SOURCE_ID_IMPOSED);
        });
      }

      // updating Stateful state
      this.setStateValue(stateName, true);
    }

    return this;
  },

  /**
   * @param {string} stateName
   * @param stateSourceId
   * @returns {$widgets.BinaryStateful}
   */
  removeBinaryStateSourceId: function (stateName, stateSourceId) {
    var binaryState = this.binaryStates.getValue(stateName),
        stateOnBefore = binaryState.isStateOn(),
        stateOnAfter;

    binaryState.removeStateSourceId(stateSourceId);
    stateOnAfter = binaryState.isStateOn();

    if (stateOnBefore && !stateOnAfter) {
      // state got switched off
      if (binaryState.cascades &&
          stateSourceId !== $widgets.BINARY_STATE_SOURCE_ID_IMPOSED
      ) {
        // removing imposed state from children
        this.getAllChildNodes()
        .filter(function (childNode) {
          return $widgets.BinaryStateful.mixedBy(childNode) &&
              childNode.binaryStates.getValue(stateName);
        })
        .forEach(function (binaryStateful) {
          binaryStateful.removeBinaryStateSourceId(
              stateName, $widgets.BINARY_STATE_SOURCE_ID_IMPOSED);
        });
      }

      // updating Stateful state
      this.setStateValue(stateName, false);
    }

    return this;
  },

  /**
   * @param {string} stateName
   * @returns {boolean}
   */
  isStateOn: function (stateName) {
    var binaryState = this.binaryStates.getValue(stateName);
    return binaryState && binaryState.isStateOn();
  },

  /** @ignore */
  onAttach: function () {
    var that = this;

    this.binaryStates
    // for cascading states...
    .filter(function (binaryState) {
      return binaryState.cascades;
    })
    // ...that have matching parents
    .filter(function (binaryState, stateName) {
      return that.getClosestParentNode(function (parentNode) {
        return $widgets.BinaryStateful.mixedBy(parentNode) &&
            parentNode.isStateOn(stateName);
      });
    })
    // applying an imposed state
    .forEachItem(function (binaryState, stateName) {
      that.addBinaryStateSourceId(
          stateName, $widgets.BINARY_STATE_SOURCE_ID_IMPOSED);
    });
  },

  /** @ignore */
  onDetach: function () {
    var that = this;

    // removing imposed states
    this.binaryStates
    .forEachItem(function (binaryState, stateName) {
      that.removeBinaryStateSourceId(
          stateName, $widgets.BINARY_STATE_SOURCE_ID_IMPOSED);
    });
  }
});

$oop.copyProperties($widgets, /** @lends $widgets */{
  /** @constant */
  BINARY_STATE_SOURCE_ID_IMPOSED: 'imposed'
});
