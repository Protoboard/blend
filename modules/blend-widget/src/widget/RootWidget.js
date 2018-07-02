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
  init: function () {
    var listeningPath = 'widget.' + this.instanceId;

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('widget');

    // Letting `init` finish for all mixers before running onAttach()
    $utils.setTimeout(0)
    .timerPromise
    .then(this.onAttach);
  }
})
.build();
