"use strict";
// this conde is not use G_LoadShader 
function G_LoadShader() {
    try {
        G_loadTextResource('../glsl/vertex_shader.glsl', function (vsErr, vertex_shader) {
            if (vsErr) {
                alert(' error getting vertex shader (see console) 2522018033326');
                console.error(vsErr);
                return;
            }
            else {
                G_loadTextResource('../glsl/fragment_shader.glsl', function (fsErr, fragment_shader) {
                    if (fsErr) {
                        alert(' error getting fragment shader (see console) 2522018033327');
                        console.error(fsErr);
                        return;
                    }
                    else {
                        // main(
                        //     vertex_shader,
                        //     fragment_shader);
                    }
                });
            }
        });
    }
    catch (e) {
        alert('Fatal error getting Susan texture (see console) 2522018033520');
    }
}
// load Text Resource
var G_loadTextResource = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
        }
        else {
            callback(null, request.responseText);
        }
    };
    try {
        request.send(); // No Server Error
    }
    catch (e) {
        // runFail();
        console.log("No run Fail() ");
    }
};
// Load Image
var G_loadImage = function (url, callback) {
    var image = new Image();
    image.onload = function () {
        callback(null, image);
    };
    image.src = url;
};
// load josn
var G_loadJSONResource = function (url, callback) {
    G_loadTextResource(url, function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            try {
                callback(null, JSON.parse(result));
            }
            catch (e) {
                callback(e);
            }
        }
    });
};
//# sourceMappingURL=Util.js.map