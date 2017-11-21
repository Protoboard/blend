"use strict";

/**
 * @mixin $widgets.DomFocusable
 * @extends $widgets.Focusable
 * @extends $widget.DomWidget
 */
$widgets.DomFocusable = $oop.getClass('$widgets.DomFocusable')
.blend($oop.getClass('$widgets.Focusable'))
.blend($widget.DomWidget)
.define(/** @lends $widgets.DomFocusable# */{
  /**
   * Syncs DOM focus to `isFocused` property.
   * @protected
   */
  _syncElementFocus: function () {
    var element = this.getElement();
    if (this.isFocused) {
      element.focus();
    } else {
      element.blur();
    }
  },

  /**
   * Syncs `isFocused` property to DOM focus.
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
   * @returns {$widgets.DomFocusable}
   */
  focus: function focus() {
    var isFocusedBefore = focus.shared.isFocusedBefore;
    if (!isFocusedBefore) {
      this._syncElementFocus();
    }
    return this;
  },

  /**
   * @returns {$widgets.DomFocusable}
   */
  blur: function blur() {
    var isFocusedBefore = blur.shared.isFocusedBefore;
    if (isFocusedBefore) {
      this._syncElementFocus();
    }
    return this;
  },

  /** @ignore */
  onRender: function () {
    this._syncElementFocus();

    var element = this.getElement();
    element.addEventListener('focusin', this.onFocusIn);
    element.addEventListener('focusout', this.onFocusOut);
  },

  /**
   * @param {Event} event
   * @ignore
   */
  onFocusIn: function (event) {
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
  onFocusOut: function (event) {
    var eventTrail = $event.EventTrail.create(),
        wrapperEvent = $event.WrapperEvent.fromEventName('focusOutWrapper')
        .wrap(event);

    eventTrail.push(wrapperEvent);
    this._syncToElementFocus();
  }
});

$oop.getClass('$widgets.Focusable')
.forwardBlend($widgets.DomFocusable, function () {
  return $utils.isBrowser();
});
