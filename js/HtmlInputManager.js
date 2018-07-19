"use strict";
class C_InputManager {
    constructor() {
        this.atlasLink = "../image/Pony.svg";
        this.startPos = new C_Vector3(8, 15, -20);
        this.canvasSizeW = 600;
        this.canvasSizeH = 600;
    }
    update() {
        this.startPos.x = Number(document.getElementById("SX").value);
        this.startPos.y = Number(document.getElementById("SY").value);
        this.startPos.z = Number(document.getElementById("SZ").value);
        this.canvasSizeW = Number(document.getElementById("canvasSizeW").value);
        this.canvasSizeH = Number(document.getElementById("canvasSizeH").value);
        this.atlasLink = document.getElementById("imgFile").children[0].src;
    }
}
//# sourceMappingURL=HtmlInputManager.js.map