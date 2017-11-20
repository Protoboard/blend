"use strict";

/**
 * @function $widget.RootWidget.create
 * @returns {$widget.RootWidget}
 */

/**
 * @class $widget.RootWidget
 * @extends $widget.Widget
 */
$widget.RootWidget = $oop.getClass('$widget.RootWidget')
.blend($oop.getClass('$widget.Widget'))
.blend($oop.Singleton)
.define(/** @lends $widget.RootWidget */{
  /** @ignore */
  defaults: function () {
    this.nodeName = this.nodeName || 'root';
  },

  /** @ignore */
  init: function () {
    var listeningPath = $data.TreePath.fromComponentsToString([
      'widget', String(this.instanceId)]);

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('widget');

    $utils.setTimeout(0)
    .timerPromise
    .then(this.onAttach);
  }
});
