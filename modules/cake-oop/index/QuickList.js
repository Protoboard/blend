/**
 * Structure that stores items both in an array and lookup form. The array
 * is for functional iteration and fast item count, the lookup allows quick
 * item presence check.
 * @typedef {{list:Array,lookup:Object.<string,boolean>}} $oop.QuickList
 */