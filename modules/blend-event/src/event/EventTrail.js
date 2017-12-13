"use strict";

/**
 * @function $event.EventTrail.create
 * @returns {$event.EventTrail}
 */

/**
 * Maintains a chain of in-flight events. This class is mostly used
 * internally, except when handling outside events. (Events not based on
 * `$event.Event`.) For an example, see {@link $event.WrapperEvent}.
 * @class $event.EventTrail
 * @mixes $oop.Singleton
 * @extends $data.Chain
 */
$event.EventTrail = $oop.createClass('$event.EventTrail')
.blend($oop.Singleton)
.blend($data.Chain)
.build();
