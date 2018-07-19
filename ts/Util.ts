// this conde is not use G_LoadShader 
function G_LoadShader():void {
    try {
        G_loadTextResource('../glsl/vertex_shader.glsl', function(vsErr:any, vertex_shader:string) {
            if (vsErr) {
                alert(' error getting vertex shader (see console) 2522018033326');
                console.error(vsErr);
                return;
            } else {
                G_loadTextResource('../glsl/fragment_shader.glsl', function(fsErr:any, fragment_shader:string) {
                    if (fsErr) {
                        alert(' error getting fragment shader (see console) 2522018033327');
                        console.error(fsErr);
                        return;
                    } else {
                 
                        // main(
                        //     vertex_shader,
                        //     fragment_shader);
                        }
                    });
                }
            });
        } catch (e) {
            alert('Fatal error getting Susan texture (see console) 2522018033520');
        }
}

// load Text Resource
var G_loadTextResource = function(url:string, callback:any) {

    var request = new XMLHttpRequest();

    request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
    request.onload = function() {
        if (request.status < 200 || request.status > 299) {
            callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
        } else {
            callback(null, request.responseText);
        }
    };
    try {
        request.send(); // No Server Error
    } catch (e) {
        // runFail();
        console.log("No run Fail() ");
    }

};


// Load Image
var G_loadImage = function(url:string, callback:any) {
    var image = new Image();
    image.onload = function() {
        callback(null, image);
    };
    image.src = url;
};

// load josn
var G_loadJSONResource = function(url:string, callback:any) {
    G_loadTextResource(url, function(err:any, result:any) {
        if (err) {
            callback(err);
        } else {
            try {
                callback(null, JSON.parse(result));
            } catch (e) {
                callback(e);
            }
        }
    });
}