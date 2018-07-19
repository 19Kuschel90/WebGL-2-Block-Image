class C_Camera{
    projectionMatrix:Float32Array = new Float32Array(16);
    viewMatrix:Float32Array = new Float32Array(16);;
    mode:number = 0;
    Camera:number = 1;
    transform:C_Transform = new C_Transform();
  
	constructor(gl:any,fov:number = 45,near:number = 0.1,far:number= 100.0){
		//Setup the perspective matrix
		this.projectionMatrix = new Float32Array(16);
		var ratio = gl.canvas.width / gl.canvas.height;
		C_Matrix4.perspective(this.projectionMatrix, fov, ratio, near , far );

		this.transform = new C_Transform();		//Setup transform to control the position of the camera
		this.viewMatrix = new Float32Array(16);	//Cache the matrix that will hold the inverse of the transform.

		this.mode = 1;			//Set what sort of control mode to use.
	}

	panX(v:any):void{
		if(this.mode == 1) return; // Panning on the X Axis is only allowed when in free mode
		this.updateViewMatrix();
		this.transform.position.x += this.transform.right[0] * v;
		this.transform.position.y += this.transform.right[1] * v;
		this.transform.position.z += this.transform.right[2] * v; 
	}

	panY(v:any):void{
		this.updateViewMatrix();
		this.transform.position.y += this.transform.up[1] * v;
		if(this.mode == 1) return; //Can only move up and down the y axix in orbit mode
		this.transform.position.x += this.transform.up[0] * v;
		this.transform.position.z += this.transform.up[2] * v; 
	}

	panZ(v:any):void{
		this.updateViewMatrix();
		if(this.mode == 1){
			this.transform.position.z += v; //orbit mode does translate after rotate, so only need to set Z, the rotate will handle the rest.
		}else{
			//in freemode to move forward, we need to move based on our forward which is relative to our current rotation
			this.transform.position.x += this.transform.forward[0] * v;
			this.transform.position.y += this.transform.forward[1] * v;
			this.transform.position.z += this.transform.forward[2] * v; 
		}
	}

	//To have different modes of movements, this function handles the view matrix update for the transform object.
	updateViewMatrix():Float32Array{
		//Optimize camera transform update, no need for scale nor rotateZ
		if(this.mode == 0){
			this.transform.matView.reset()
				.vtranslate(this.transform.position)
				.rotateX(this.transform.rotation.x * this.transform.deg2Rad)
				.rotateY(this.transform.rotation.y * this.transform.deg2Rad);
				
		}else{
			this.transform.matView.reset()
				.rotateX(this.transform.rotation.x * this.transform.deg2Rad)
				.rotateY(this.transform.rotation.y * this.transform.deg2Rad)
				.vtranslate(this.transform.position);

		}

		this.transform.updateDirection();

		//Cameras work by doing the inverse transformation on all meshes, the camera itself is a lie :)
		C_Matrix4.invert(this.viewMatrix,this.transform.matView.raw);
		return this.viewMatrix;
	}

	rest():void{
		this.projectionMatrix = new Float32Array(16);
		this.viewMatrix = new Float32Array(16);;
		this.mode = 0;
		this.Camera = 1;
		this.transform = new C_Transform();
	}
}

class C_CameraController{
    canvas:any = null;
    camera:any = null;
    rotateRate:number = 0;
    panRate:number = 0;
    zoomRate:number = 0;
    offsetX:number = 0;
    offsetY:number = 0;
    initX:number = 0;
    initY:number = 0;
    prevX:number = 0;
    prevY:number = 0;
    onUpHandler:any = null;
    onMoveHandler:any = null;
	constructor(gl:any,camera:any){
		var oThis = this;
		var box = gl.canvas.getBoundingClientRect();
		this.canvas = gl.canvas;						//Need access to the canvas html element, main to access events
		this.camera = camera;							//Reference to the camera to control
		
		this.rotateRate = -300;							//How fast to rotate, degrees per dragging delta
		this.panRate = 5;								//How fast to pan, max unit per dragging delta
		this.zoomRate = 200;							//How fast to zoom or can be viewed as forward/backward movement

		this.offsetX = box.left;						//Help calc global x,y mouse cords.
		this.offsetY = box.top;

		this.initX = 0;									//Starting X,Y position on mouse down
		this.initY = 0;
		this.prevX = 0;									//Previous X,Y position on mouse move
		this.prevY = 0;

		this.onUpHandler = function(e:any):any{ oThis.onMouseUp(e); };		//Cache func reference that gets bound and unbound a lot
		this.onMoveHandler = function(e:any):any{ oThis.onMouseMove(e); }

		this.canvas.addEventListener("mousedown",function(e:any):any{ oThis.onMouseDown(e); });		//Initializes the up and move events
		this.canvas.addEventListener("mousewheel", function(e:any):any{ oThis.onMouseWheel(e); });	//Handles zoom/forward movement
	}

	//Transform mouse x,y cords to something useable by the canvas.
	getMouseVec2(e:any):any{ return {x:e.pageX - this.offsetX, y:e.pageY - this.offsetY}; }

	//Begin listening for dragging movement
	onMouseDown(e:any):void{
		this.initX = this.prevX = e.pageX - this.offsetX;
		this.initY = this.prevY = e.pageY - this.offsetY;

		this.canvas.addEventListener("mouseup",this.onUpHandler);
		this.canvas.addEventListener("mousemove",this.onMoveHandler);
	}

	//End listening for dragging movement
	onMouseUp(e:any):void{
		this.canvas.removeEventListener("mouseup",this.onUpHandler);
		this.canvas.removeEventListener("mousemove",this.onMoveHandler);
	}

	onMouseWheel(e:any):void{
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))); //Try to map wheel movement to a number between -1 and 1
		this.camera.panZ(delta * (this.zoomRate / this.canvas.height));		//Keep the movement speed the same, no matter the height diff
	}

	onMouseMove(e:any):void{
		var x = e.pageX - this.offsetX,	//Get X,y where the canvas's position is origin.
			y = e.pageY - this.offsetY,
			dx = x - this.prevX,		//Difference since last mouse move
			dy = y - this.prevY;

		//When shift is being helt down, we pan around else we rotate.
		if(!e.shiftKey){
			this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width);
			this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height);
		}else{
			this.camera.panX( -dx * (this.panRate / this.canvas.width) );
			this.camera.panY( dy * (this.panRate / this.canvas.height) );
		}

		this.prevX = x;
		this.prevY = y;
	}

	rest():void
	{
		this.canvas = null;
		this.camera = null;
		this.rotateRate = 0;
		this.panRate = 0;
		this.zoomRate = 0;
		this.offsetX = 0;
		this.offsetY = 0;
		this.initX = 0;
		this.initY = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.onUpHandler = null;
		this.onMoveHandler = null;
	}
}