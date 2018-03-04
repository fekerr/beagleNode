//# fekerr 20180227
//# https://github.com/beagleboard/pocketbeagle/wiki/System-Reference-Manual#221_PocketBone

// http://www.surplusgizmos.com/assets/images/44_LED_arduino_code.pdf
//
// http://192.168.7.2/bone101/Support/BoneScript/shiftOut/

//**************************************************************//
//// Name : shiftOutCode, to drive LED bar //
//// with STP08CL596
//// Author : mike carter //
//// Date : NOV 11, 2015 //
//// Version : 1.0 //
//// Notes : Code for using led bar with built in Shift Register //
//// : to count turn on LED's in a pattern //
//// 6 chips in the bar. 5 with 8 LED's each and one with 4 LED's //
////**************************************************************//
//// Here is how we will wire up the led bar to the arduino
//// Attach OE pin (output enable pin) to ground
//// attach power and ground

var b = require('bonescript');

var LE = "P2_33" ; // GPIO45
var SPI = "P2_25"; // MOSI
var CLK = "P2_29"; // CLK

var chip = new Array(0,0,0,0,0,0);

//fek++hack
f = {}

f.fekShiftOut = function(dataPin, clockPin, bitOrder, val, bits, callback) {
    var i = 0;
    var bit;
    var clock = 0;
    var mask = 0;
    /*
    console.log("f.fekShiftOut(dataPin=" + dataPin +
        " clockPin=" + clockPin +
        " bitOrder=" + bitOrder +
        " val=" + val +
        " bits=" + bits +
        " callback=" + callback);
        */

    function next(err) {
        if(err || i == bits) { // TODO: fek 8
            callback({'err': err});
            return;
        }

        if(bitOrder == b.LSBFIRST) {
            mask = (1<<i);
            bit = val & (1 << i);
//            console.log("#0: mask=" + mask + " bit="+bit);
        } else {
//            mask = 
//            bit = val & (1 << ((bits-1) - i)); //TODO: fek 8
            mask = (b.bitSet(0,bits-i));
            bit = val & (b.bitSet(0,bits-i));
//            console.log("#1: mask=" + mask + " bit="+bit);
        }
        if(clock === 0) {
            clock = 1;
            if(bit) {
                b.digitalWrite(dataPin, b.HIGH, next);
            } else {
                b.digitalWrite(dataPin, b.LOW, next);
            }
        } else if(clock == 1) {
            clock = 2;
            b.digitalWrite(clockPin, b.HIGH, next);
        } else if(clock == 2) {
            i++;
            clock = 0;
            b.digitalWrite(clockPin, b.LOW, next);
        }
    }
    
    if(callback) {
        next();
    } else {
        for(i = 0; i < bits; i++) { //TODO: 8
            if(bitOrder == b.LSBFIRST) {
                mask = (1 << i);
                bit = val & (1 << i);
//                console.log("#2: i=" + i + " mask=" + mask + " bit="+bit);
            } else {
//                bit = val & (1 << ((bits-1) - i)); // TODO: 8
//                console.log("#2: bit="+bit);
                mask = 1 << (bits-i-1);
//                bit = val & (b.bitSet(0,bits-i));
                bit = val & mask;
//            console.log("#3:i=" + i + " mask=" + mask + " bit="+bit);
            }
            
            if(bit) {
                b.digitalWrite(dataPin, b.HIGH);
            } else {
                b.digitalWrite(dataPin, b.LOW);
            }
            b.digitalWrite(clockPin, b.HIGH);
            b.digitalWrite(clockPin, b.LOW);
        }
    }
};
f.fekShiftOut.args = ['dataPin', 'clockPin', 'bitOrder', 'val', 'bits', 'callback'];
//fek--hack

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

//    setInterval(doit, 10);
    doit();
}

function doUpdate()
{
    var i;
    b.digitalWrite(LE, b.LOW);
    // shift out the 4 bits for the last chip.
    f.fekShiftOut(SPI, CLK, b.MSBFIRST, chip[5], 4);
    for(i=4;i>=0;--i)
    {
        f.fekShiftOut(SPI, CLK, b.MSBFIRST, chip[i], 8);
    }
    b.digitalWrite(LE, b.HIGH);
}

function clockPulse(t)
{
    var i;
    for(i=0; i<t; ++i)
    {
        b.digitalWrite(CLK, b.HIGH);
        b.digitalWrite(CLK, b.LOW);
    }
}

function set1()
{
    b.digitalWrite(SPI, b.HIGH);
    b.digitalWrite(LE, b.HIGH);
   
    clockPulse(1);
    
    b.digitalWrite(LE, b.LOW);
    b.digitalWrite(SPI, b.LOW);
}

function runway()
{
    var i;

    set1();

    for(i=0; i<43; ++i)
    {
//        b.digitalWrite(LE, b.HIGH);
        clockPulse(1);
//        b.digitalWrite(LE, b.LOW);
    }

    for(i=43; i>=0; --i)
    {
        set1();
        clockPulse(i);
    }
}

function doit()
{
    var i;
    var carry=false;

    while(1)
    {
        runway();

        console.log(chip);

        ++chip[0];
        for(i=0; i<5; ++i)
        {
            if(chip[i] > 255)
            {
                chip[i] = 0;
                carry = true;
                continue;
            }
            if(carry)
            {
                ++chip[i];
                carry = false;
            }
        }
        if(chip[5] > 0xF) chip[5] = 0;

        doUpdate();
    }
}


