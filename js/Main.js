"use strict";
window.addEventListener("load", function () {
    var fileInput = document.getElementById('fileInput');
    var imgFile = document.getElementById('imgFile');
    fileInput.addEventListener('change', function (e) {
        var file = fileInput.files[0];
        var imageType = /image.*/;
        if (file.type.match(imageType)) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgFile.innerHTML = "";
                var img = new Image();
                img.src = reader.result;
                imgFile.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
        else {
            imgFile.innerHTML = "Dateityp nicht unterstützt";
        }
    });
    main();
});
var gl = null;
var gModal = null;
var gCamera;
var gCameraCtrl;
var gShader = null;
var gGridShader = null;
var gGridModal = null;
var RLoop = null;
var gRLoop;
var Resources = null;
var gCubes = [];
var gInputManager = new C_InputManager();
var gVertex_shader = '#version 300 es' + "\n" +
    'in vec4 a_position;' + "\n" +
    'in vec3 a_norm;' + "\n" +
    'in vec2 a_uv;' + "\n" +
    'uniform mat4 uPMatrix;' + "\n" +
    'uniform mat4 uMVMatrix;' + "\n" +
    'uniform mat4 uCameraMatrix;' + "\n" +
    'uniform float uPositonX;' + "\n" +
    'uniform float uPositonY;' + "\n" +
    'out highp vec2 vUV;' + "\n" +
    'const float size = 1.0/16.0;' + "\n" +
    'void main(void){' + "\n" +
    '	int f = int(a_position.w);' + "\n" +
    'float u = uPositonX * size + a_uv.x * size;' + "\n" +
    'float v = uPositonY* size + a_uv.y * size;' + "\n" +
    'vUV = vec2(u,v);' + "\n" +
    'gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0); ' + "\n" +
    '}';
var gFragment_shader = '#version 300 es ' + "\n" +
    'precision mediump float; ' + "\n" +
    'uniform sampler2D uAltas; ' + "\n" +
    'in highp vec2 vUV; ' + "\n" +
    'out vec4 outColor; ' + "\n" +
    'void main(void){ outColor = texture(uAltas,vUV); } ';
var moveBot = [];
var _a = BotHelperNumbers(), uPositonX = _a.uPositonX, uPositonY = _a.uPositonY, temp = _a.temp, NewLine = _a.NewLine;
function BotHelperNumbers() {
    var uPositonX = 0;
    var uPositonY = 0;
    var temp = 15;
    var NewLine = 0;
    return { uPositonX: uPositonX, uPositonY: uPositonY, temp: temp, NewLine: NewLine };
}
//#region init webgl
function main() {
    // init webgl2
    gl = GLInstance("webglCanvas").fFitScreen(0.95, 0.9).fClear();
    gCamera = new C_Camera(gl);
    gCamera.transform.rotation.set(90, 0, 0);
    gCameraCtrl = new C_CameraController(gl, gCamera);
    gRLoop = new C_RenderLoop(onRender, 30);
    C_Resources.setup(gl, onReady).loadTexture("atlas", gInputManager.atlasLink).start();
}
//#endregion
//#region Load Objects
function onReady() {
    gShader = new C_ShaderBuilder(gl, gVertex_shader, gFragment_shader)
        .prepareUniforms("uPMatrix", "mat4", "uMVMatrix", "mat4", "uCameraMatrix", "mat4", "uFaces", "2fv", "uPositonX", "fv", "uPositonY", "fv")
        .prepareTextures("uAltas", "atlas")
        .setUniforms("uPMatrix", gCamera.projectionMatrix);
    var cubemesh = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
    gCamera.transform.position.set(7.5, -7.5, 14.7);
    for (var i = 0; i < 256; i++) {
        var model = new C_Modal(cubemesh).setPosition((i % 16), 0.0, -Math.floor(i / 16));
        gCubes.push(model);
        moveBot.push(new C_MoveBot(model.transform, model.transform.position));
        moveBot[i].SetPosition(new C_Vector3(gInputManager.startPos.x, gInputManager.startPos.y, gInputManager.startPos.z));
        moveBot[i].SetSpeed(1.0);
    }
    gRLoop.start();
}
//#endregion
//#region Render Loop 
function onRender(dt) {
    gl.fClear();
    gCamera.updateViewMatrix();
    gShader.preRender("uCameraMatrix", gCamera.viewMatrix);
    uPositonX = 0;
    uPositonY = 0;
    temp = 15;
    for (var i = 0; i < gCubes.length; i++) {
        gShader.setUniforms("uPositonX", uPositonX).setUniforms("uPositonY", uPositonY).renderModel(gCubes[i].preRender());
        SetPositioninTexture(i);
        if (moveBot[i].GetIsRun() == true && NewLine == i) {
            moveBot[i].Update();
            if (moveBot[i].GetIsRun() == false) {
                NewLine++;
            }
        }
    }
}
//#endregion
function SetPositioninTexture(i) {
    if (i >= temp) {
        temp += 16;
        uPositonY++;
        uPositonX = 0;
    }
    else {
        uPositonX++;
    }
}
//#region Shutdown
function Shutdown() {
    gl = null;
    gModal = null;
    gCamera.rest();
    gCameraCtrl.rest();
    gShader = null;
    gGridShader = null;
    gGridModal = null;
    RLoop = null;
    gRLoop.rest();
    C_Resources.rest();
    gCubes = [];
    NewLine = 0;
    uPositonX = 0;
    uPositonY = 0;
    temp = 15;
    moveBot = [];
    // we not need to null
    //  gVertex_shader = null;
    //  gFragment_shader = null;
}
//#endregion
function NewStart() {
    Shutdown();
    gInputManager.update();
    gRLoop.stop();
    // G_LoadShader();
    main();
}
function StopRenderLoop() {
    gRLoop.stop();
}
function StartRenderLoop() {
    gRLoop.start();
}
//# sourceMappingURL=Main.js.map