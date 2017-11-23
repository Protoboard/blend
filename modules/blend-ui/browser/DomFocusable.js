"use strict";

/**
 * @mixin $ui.DomFocusable
 * @extends $ui.Focusable
 * @extends $widget.DomWidget
 */
$ui.DomFocusable = $oop.getClass('$ui.DomFocusable')
.blend($oop.getClass('$ui.Focusable'))
.blend($widget.DomWidget)
.define(/** @lends $ui.DomFocusable# */{
  /**
   * Syncs DOM focus to 'focused' state.
   * @protected
   */
  _syncElementFocus: function () {
    var element = this.getElement();
    if (element) {
      if (this.isFocused()) {
        element.focus();
      } else {
        element.blur();
      }
    }
  },

  /**
   * Syncs 'focused' state to DOM focus.
   * @protected
   */
  _syncToElementFocus: function () {
    var element = this.getElement();
    if (document.activeElement === element) {
      this.focus();
    } else {
      this.blur();
    }
  },

  /**
   * @returns {$ui.DomFocusable}
   */
  focus: function focus() {
    var focusedStateBefore = focus.shared.focusedStateBefore;
    if (!focusedStateBefore) {
      this._syncElementFocus();
    }
    return this;
  },

  /**
   * @returns {$ui.DomFocusable}
   */
  blur: function blur() {
    var focusedStateBefore = blur.shared.focusedStateBefore;
    if (focusedStateBefore) {
      this._syncElementFocus();
    }
    return this;
  },

  /** @ignore */
  onRender: function () {
    this._syncElementFocus();

    var element = this.getElement();
    element.addEventListener('focusin', this.onElementFocusIn);
    element.addEventListener('focusout', this.onElementFocusOut);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementFocusIn: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('focusInWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
    this._syncToElementFocus();
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onElementFocusOut: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('focusOutWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
    this._syncToElementFocus();
  }
});

$oop.getClass('$ui.Focusable')
.forwardBlend($ui.DomFocusable, $utils.isBrowser);
