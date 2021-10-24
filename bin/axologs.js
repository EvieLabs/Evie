"use strict";
exports.axo = (function () {
    let axo = {};
    let title = "Axo's inbuilt toolset for JS";
    axo.startupMsg = function (startupMsg) {
        console.log('\x1b[34m[Startup] \x1b[0m' + startupMsg);
        return;
    };
    axo.log = function (msg) {
        console.log('\x1b[36m[Evie] \x1b[0m' + msg);
        return;
    };
    axo.err = function (err) {
        console.log('\x1b[31m[ERROR] \x1b[0m' + err);
        return;
    };
    axo.i = function (i) {
        console.log('\x1b[36m[Interaction] \x1b[0m' + i);
        return;
    };
    return axo;
})();
