class C_Modal{
	public transform:C_Transform;
	public mesh:any;
	constructor(meshData:any){
		this.transform = new C_Transform();
		this.mesh = meshData;
	}

	//--------------------------------------------------------------------------
	//Getters/Setters
	public 	setScale(x:number,y:number,z:number){ this.transform.scale.set(x,y,z); return this; }
	public setPosition(x:number,y:number,z:number){ this.transform.position.set(x,y,z); return this; }
	public setRotation(x:number,y:number,z:number){ this.transform.rotation.set(x,y,z); return this; }

	public addScale(x:number,y:number,z:number){	this.transform.scale.x += x;	this.transform.scale.y += y;	this.transform.scale.y += y;	return this; }
	public addPosition(x:number,y:number,z:number){	this.transform.position.x += x; this.transform.position.y += y; this.transform.position.z += z; return this; }
	public addRotation(x:number,y:number,z:number){	this.transform.rotation.x += x; this.transform.rotation.y += y; this.transform.rotation.z += z; return this; }

	//--------------------------------------------------------------------------
	//Things to do before its time to render
	preRender(){ this.transform.updateMatrix(); return this; }
}