 const ATTR_POSITION_NAME:string	= "a_position";
const ATTR_POSITION_LOC:number		= 0;
const ATTR_NORMAL_NAME:string		= "a_norm";
const ATTR_NORMAL_LOC:number	    = 1;
const ATTR_UV_NAME:string			= "a_uv";
const ATTR_UV_LOC:number			= 2;

function GLInstance(canvasID:string):any{
    var canvas:any = document.getElementById(canvasID);
	var	gl:any = canvas.getContext("webgl2");

	if(!gl){ console.error("WebGL context is not available."); return null; }
	//Setup custom properties
	gl.mMeshCache = [];	//Cache all the mesh structs, easy to unload buffers if they all exist in one place.
	gl.mTextureCache = [];

    //...................................................
    //Setup GL, Set all the default configurations we need.
    gl.cullFace(gl.BACK); //Back is also default
    gl.frontFace(gl.CCW); //Dont really need to set it, its ccw by default.
    gl.enable(gl.DEPTH_TEST); //Shouldn't use this, use something else to add depth detection
    gl.enable(gl.CULL_FACE); //Cull back face, so only show triangles that are created clockwise
    gl.depthFunc(gl.LEQUAL); //Near things obscure far things
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); //Setup default alpha blending

	gl.clearColor(1.0,0.7,1.0,1.0);		//Set clear color


	//...................................................
	//Methods	
    gl.fClear = function():any{ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; }


	gl.fCreateArrayBuffer = function(floatAry:any,isStatic:any):any{
		if(isStatic === undefined) isStatic = true; //So we can call this function without setting isStatic

		var buf = this.createBuffer();
		this.bindBuffer(this.ARRAY_BUFFER,buf);
		this.bufferData(this.ARRAY_BUFFER, floatAry, (isStatic)? this.STATIC_DRAW : this.DYNAMIC_DRAW );
		this.bindBuffer(this.ARRAY_BUFFER,null);
		return buf;
	}

	//Turns arrays into GL buffers, then setup a VAO that will predefine the buffers to standard shader attributes.
	gl.fCreateMeshVAO = function(name:any,aryInd:any,aryVert:any,aryNorm:any,aryUV:any,vertLen:any ):any{
		var rtn:any = { drawMode:this.TRIANGLES };

		//Create and bind vao
		rtn.vao = this.createVertexArray();															
		this.bindVertexArray(rtn.vao);	//Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.

		if (aryVert !== undefined && aryVert != null) {
            rtn.bufVertices = this.createBuffer(); //Create buffer...
            rtn.vertexComponentLen = vertLen || 3; //How many floats make up a vertex
            rtn.vertexCount = aryVert.length / rtn.vertexComponentLen; //How many vertices in the array

            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufVertices);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryVert), this.STATIC_DRAW); //then push array into it.
            this.enableVertexAttribArray(ATTR_POSITION_LOC); //Enable Attribute location
            this.vertexAttribPointer(ATTR_POSITION_LOC, rtn.vertexComponentLen, this.FLOAT, false, 0, 0); //Put buffer at location of the vao
        }
		//.......................................................
		//Setup normals
		if(aryNorm !== undefined && aryNorm != null){
			rtn.bufNormals = this.createBuffer();
			this.bindBuffer(this.ARRAY_BUFFER, rtn.bufNormals);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryNorm), this.STATIC_DRAW);
			this.enableVertexAttribArray(ATTR_NORMAL_LOC);
			this.vertexAttribPointer(ATTR_NORMAL_LOC,3,this.FLOAT,false, 0,0);
		}

		//.......................................................
		//Setup UV
		if(aryUV !== undefined && aryUV != null){
			rtn.bufUV = this.createBuffer();
			this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
			this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryUV), this.STATIC_DRAW);
			this.enableVertexAttribArray(ATTR_UV_LOC);
			this.vertexAttribPointer(ATTR_UV_LOC,2,this.FLOAT,false,0,0);	//UV only has two floats per component
		}

		if (aryInd !== undefined && aryInd != null) {
            rtn.bufIndex = this.createBuffer();
            rtn.indexCount = aryInd.length;
            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
            this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), this.STATIC_DRAW);
            //this.bindBuffer(this.ELEMENT_ARRAY_BUFFER,null); //TODO REMOVE THIS AND ADD TO CLEANUP
        }


		//Clean up
		this.bindVertexArray(null); //Unbind the VAO, very Important. always unbind when your done using one.
        this.bindBuffer(this.ARRAY_BUFFER, null); //Unbind any buffers that might be set
        if (aryInd != null && aryInd !== undefined) this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);

        this.mMeshCache[name] = rtn;
        return rtn;
	}

    gl.fLoadTexture = function(name:any, img:any, doYFlip:any, noMips:any) {
        var tex = this.createTexture();
        this.mTextureCache[name] = tex;
        return this.fUpdateTexture(name, img, doYFlip, noMips);
	};
	
	gl.fUpdateTexture = function(name:any, img:any, doYFlip:any, noMips:any) {
        var tex = this.mTextureCache[name];
        if (doYFlip == true) this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true); //Flip the texture by the Y Position, So 0,0 is bottom left corner.

        this.bindTexture(this.TEXTURE_2D, tex); //Set text buffer for work
        this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img); //Push image to GPU.

        if (noMips === undefined || noMips == false) {
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR); //Setup up scaling
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST); //Setup down scaling
            this.generateMipmap(this.TEXTURE_2D); //Precalc different sizes of texture for better quality rendering.
        } else {
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.NEAREST);
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.NEAREST);
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
        }

        this.bindTexture(this.TEXTURE_2D, null); //Unbind

        if (doYFlip == true) this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, false); //Stop flipping textures
        return tex;
	}
	

    //imgAry must be 6 elements long and images placed in the right order
    //RIGHT,LEFT,TOP,BOTTOM,BACK,FRONT
    gl.fLoadCubeMap = function(name:any, imgAry:any):any {
        if (imgAry.length != 6)
        {
         return null;
        }
        
        var tex = this.createTexture();
        this.bindTexture(this.TEXTURE_CUBE_MAP, tex);

        //push image to specific spot in the cube map.
        for (var i = 0; i < 6; i++) {
            this.texImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, imgAry[i]);
        }

        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MAG_FILTER, this.LINEAR); //Setup up scaling
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MIN_FILTER, this.LINEAR); //Setup down scaling
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE); //Stretch image to X position
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE); //Stretch image to Y position
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_R, this.CLAMP_TO_EDGE); //Stretch image to Z position
        //this.generateMipmap(this.TEXTURE_CUBE_MAP);

        this.bindTexture(this.TEXTURE_CUBE_MAP, null);
        this.mTextureCache[name] = tex;
        return tex;
    };



    gl.fSetSize = function():any
    {
		
        this.canvas.style.width = String(gInputManager.canvasSizeW) + "px" ;
		this.canvas.style.height = String(gInputManager.canvasSizeH) + "px" ;
		this.canvas.width = 1024;
		this.canvas.height = 1024;

		this.viewport(0,0,1024,1024);
		return this;
	}

		//Set the size of the canvas to fill a % of the total screen.
	gl.fFitScreen = function(wp:any,hp:any):any{ return this.fSetSize(); }
	return gl;
}

//--------------------------------------------------
// Util  Class 
//--------------------------------------------------
// wird grade nicht verwendet
class C_GlUtil {

    //Convert Hex colors to float arrays, can batch process a list into one big array.
    //example : GlUtil.rgbArray("#FF0000","00FF00","#0000FF");
    static rgbArray():any {
        if (arguments.length == 0) return null;
        var rtn = [];

        for (var i = 0, c, p; i < arguments.length; i++) {
            if (arguments[i].length < 6) continue;
            c = arguments[i]; //Just an alias(copy really) of the color text, make code smaller.
            p = (c[0] == "#") ? 1 : 0; //Determine starting position in char array to start pulling from

            rtn.push(
                parseInt(c[p] + c[p + 1], 16) / 255.0,
                parseInt(c[p + 2] + c[p + 3], 16) / 255.0,
                parseInt(c[p + 4] + c[p + 5], 16) / 255.0
            );
        }
        return rtn;
    }

}