"use strict";

/**
 * @class $demo.Logger
 */
$demo.Logger = $oop.createClass('$demo.Logger')
.build();

$event.EventSpace.create()
.on($router.EVENT_ROUTE_CHANGE,
    'route',
    $demo.Logger.__className,
    function logRouteChange(event) {
      console.log("route changed from `" + event.routeBefore + "` to `" + event.routeAfter + "`");
    })
.on($entity.EVENT_ENTITY_CHANGE,
    'entity',
    $demo.Logger.__className,
    function logEntityChange(event) {
      console.log(
          "entity `" + event.sender.entityKey + "` changed" +
          (event.nodeBefore !== event.nodeAfter ?
              " from `" + event.nodeBefore + "` to `" + event.nodeAfter + "`" :
              " adding `" + event.propertiesAdded + "`, removing `" + event.propertiesRemoved + "`"), event);
    })
.on($widget.EVENT_STATE_CHANGE,
    'widget',
    $demo.Logger.__className,
    function logWidgetStateChange(event) {
      console.log("widget `" + event.sender.instanceId + "` state `" +
          event.stateName + "` changed from `" + event.stateValueBefore +
          "` to  `" + event.stateValueAfter + "`");
    })
.on($widget.EVENT_CLICKABLE_CLICK,
    'widget',
    $demo.Logger.__className,
    function logClickableClick(event) {
      console.log("widget `" + event.sender.instanceId + "` clicked");
    })
.on($i18n.EVENT_LOCALE_CHANGE,
    'locale',
    $demo.Logger.__className,
    function logLocaleChange(event) {
      console.log("locale changed from `" + event.localeBefore + "` to  `" +
          event.localeAfter + "`");
    });