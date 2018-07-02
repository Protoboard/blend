"use strict";

/**
 * @function $widget.RootWidget.create
 * @returns {$widget.RootWidget}
 */

/**
 * @class $widget.RootWidget
 * @extends $widget.Widget
 */
$widget.RootWidget = $oop.createClass('$widget.RootWidget')
.blend($widget.Widget)
.blend($oop.Singleton)
.define(/** @lends $widget.RootWidget */{
  /** @ignore */
  defaults: function () {
    this.nodeName = this.nodeName || 'root';
  },

  /** @ignore */
  init: function init() {
    var listeningPath = 'widget.' + this.instanceId;

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('widget');

    // Running onAttach when `init` finished for all mixers.
    init.followUps.push(this.onAttach);
  }
})
.build();
