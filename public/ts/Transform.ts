class C_Transform{
	public position:C_Vector3;
	public scale:C_Vector3;
	public rotation:C_Vector3;
	public matView:C_Matrix4;
	public  matNormal:Float32Array;
	public  forward:Float32Array;
	public  up:Float32Array;
	public  right:Float32Array;
	public  deg2Rad:number = Math.PI/180;
	constructor(){
		//C_Transform vectors
		this.position	= new C_Vector3(0,0,0);	//Traditional X,Y,Z 3d position
		this.scale		= new C_Vector3(1,1,1);	//How much to scale a mesh. Having a 1 means no scaling is done.
		this.rotation	= new C_Vector3(0,0,0);	//Hold rotation values based on degrees, Object will translate it to radians
		this.matView 	= new C_Matrix4();		//Cache the results when calling updateMatrix
		this.matNormal	= new Float32Array(9);	//This is a Mat3, raw array to hold the values is enough for what its used for

		//Direction Vectors, Need 4 elements for math operations with matrices
		this.forward	= new Float32Array(4);	//When rotating, keep track of what the forward direction is
		this.up			= new Float32Array(4);	//what the up direction is, invert to get bottom
		this.right		= new Float32Array(4);	//what the right direction is, invert to get left
	}

	//--------------------------------------------------------------------------
	//Methods
	public updateMatrix(){
		this.matView.reset() //Order is very important!!
			.vtranslate(this.position)
			.rotateX(this.rotation.x * this.deg2Rad)
			.rotateZ(this.rotation.z * this.deg2Rad)
			.rotateY(this.rotation.y * this.deg2Rad)
			.vscale(this.scale);

		//Calcuate the Normal Matrix which doesn't need translate, then transpose and inverses the mat4 to mat3
		C_Matrix4.normalMat3(this.matNormal,this.matView.raw);

		//Determine Direction after all the C_Transformations.
		C_Matrix4.transformVec4(this.forward,	[0,0,1,0],this.matView.raw); //Z
		C_Matrix4.transformVec4(this.up,		[0,1,0,0],this.matView.raw); //Y
		C_Matrix4.transformVec4(this.right,	[1,0,0,0],this.matView.raw); //X
		// console.log(this.matView.raw);

		return this.matView.raw;
	}

	public updateDirection(){
		C_Matrix4.transformVec4(this.forward,	[0,0,1,0],this.matView.raw);
		C_Matrix4.transformVec4(this.up,		[0,1,0,0],this.matView.raw);
		C_Matrix4.transformVec4(this.right,	[1,0,0,0],this.matView.raw);
		return this;
	}

	public getViewMatrix(){	return this.matView.raw; }
	public getNormalMatrix(){	return this.matNormal; }

	public reset(){
		this.position.set(0,0,0);
		this.scale.set(1,1,1);
		this.rotation.set(0,0,0);
	}
}


