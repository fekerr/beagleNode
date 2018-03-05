201803 fekerr

This repository contains various Javascript / Bonescript experiments utilizing a Pocket Beagle and a 44-LED 31" light bar:

http://www.surplusgizmos.com/44-Yellow-LED-Programmable-Bar_p_2881.html

# beagleNode
Experiments with Bonescript and node.js

led44a.js
  This is just a simple script to shift out to a 44-LED light bar.
  TODO: fix outputs to be compatible with e-ale cape
  TODO: cleanup - there previously was a chip[] array for the 6 chips in the bar
  http://www.surplusgizmos.com/assets/images/44_LED_arduino_code.pdf
  
https://github.com/fekerr/beagleNode/blob/master/led44_0304.js
  Modified shiftout function from bonescript incorporated. (Need to attribute better.)
      * Allows shifting 1-31 bits instead of only 8 bit shifting.
  "Runway" blips an LED from the "far" end to the connector end.
  Also counts in binary going the other way.
  
  Other references:
    https://events.linuxfoundation.org/events/elc-openiot-north-america-2018/
    https://e-ale.org/
