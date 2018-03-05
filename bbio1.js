// fekerr 20180305

// https://github.com/julianduque/beaglebone-io

var BeagleBone = require('beaglebone-io');
var board = new BeagleBone();

board.on('ready', function () {
      this.pinMode('USR3', this.MODES.OUTPUT);
      this.digitalWrite('USR3', this.HIGH);

      this.pinMode('A0', this.MODES.ANALOG);
      this.analogRead('A0', function (value) {
              console.log(value);
            });
});


