"use strict";

/**
 * @function $event.OriginalEventChain#create
 * @param {string} eventName
 * @returns {$event.OriginalEventChain}
 */

/**
 * @class $event.OriginalEventChain
 * @extends $data.Chain
 */
$event.OriginalEventChain = $oop.getClass('$event.OriginalEventChain')
.mix($oop.Singleton)
.mix($data.Chain);
