// fekerr 20180302
//TODO: update pins used to be compatible with cape
//

//# fekerr 20180227
//# https://github.com/beagleboard/pocketbeagle/wiki/System-Reference-Manual#221_PocketBone

// http://www.surplusgizmos.com/assets/images/44_LED_arduino_code.pdf
//
// http://192.168.7.2/bone101/Support/BoneScript/shiftOut/

//**************************************************************//
//// Name : shiftOutCode, to drive LED bar //
//// with STP08CL596

var b = require('bonescript');

var LE = "P2_33" ; // GPIO45
var SPI = "P2_25"; // MOSI
var CLK = "P2_29"; // CLK

var AIN = "P1_19"; // Analog Input

var value = 0;

setup();

function setup()
{
    // Configure pins as outputs
    b.pinMode(LE, b.OUTPUT);
    b.pinMode(SPI, b.OUTPUT);
    b.pinMode(CLK, b.OUTPUT);

    // initial states
    b.digitalWrite(LE, b.LOW);
    b.digitalWrite(SPI, b.LOW);
    b.digitalWrite(CLK, b.LOW);

    setInterval(doit, 100);
}

//not used currently
function doUpdate()
{
    var i;
    b.digitalWrite(LE, b.LOW);
    for(i=0; i<6; ++i)
    {
        b.shiftOut(SPI, CLK, b.MSBFIRST, chip[i]);
    }
    b.digitalWrite(LE, b.HIGH);
}

function spam(val)
{
    console.log("spam:" + val);
}

function shiftVal(val)
{
    b.digitalWrite(LE, b.LOW);
    b.shiftOut(SPI,CLK, b.MSBFIRST, val, spam(val));
    b.digitalWrite(LE, b.HIGH);
}

function doit()
{
    
    var bit7 = 0;
    var newbit0 = 0;

    var i;
    var val=b.pow(2,44);
    console.log(val);

    for(i=0;i<44;++i)
    {
        b.bitSet(val,i);
        console.log(val);

        shiftVal(val);

        b.bitClear(val,i);
    }

    ++value;
    console.log(value);

    b.digitalWrite(LE, b.LOW);
    b.shiftOut(SPI,CLK, b.MSBFIRST, value);
    b.digitalWrite(LE, b.HIGH);
}
