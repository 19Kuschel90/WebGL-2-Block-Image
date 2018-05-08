"use strict";
var C_InputManager = /** @class */ (function () {
    function C_InputManager() {
        this.atlasLink = "../image/c62bb9b27329447cb2b937fe6213889a.jpg";
        this.startPos = new C_Vector3(8, 15, -20);
        this.canvasSizeW = 600;
        this.canvasSizeH = 600;
    }
    C_InputManager.prototype.update = function () {
        this.startPos.x = Number(document.getElementById("SX").value);
        this.startPos.y = Number(document.getElementById("SY").value);
        this.startPos.z = Number(document.getElementById("SZ").value);
        this.canvasSizeW = Number(document.getElementById("canvasSizeW").value);
        this.canvasSizeH = Number(document.getElementById("canvasSizeH").value);
        this.atlasLink = document.getElementById("imgFile").children[0].src;
    };
    return C_InputManager;
}());
//# sourceMappingURL=HtmlInputManager.js.map