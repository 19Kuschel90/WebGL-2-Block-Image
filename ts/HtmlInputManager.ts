class  C_InputManager {
  public atlasLink:string = "../image/Pony.svg";
  public startPos:C_Vector3 = new C_Vector3(8,15,-20);
  public canvasSizeW:number = 600;
  public canvasSizeH:number = 600;
    constructor() {
    }
    update():void{
      this.startPos.x = Number((<HTMLInputElement>document.getElementById("SX")).value);
      this.startPos.y = Number((<HTMLInputElement>document.getElementById("SY")).value);
      this.startPos.z = Number((<HTMLInputElement>document.getElementById("SZ")).value);
      this.canvasSizeW =  Number((<HTMLInputElement>document.getElementById("canvasSizeW")).value);
      this.canvasSizeH =  Number((<HTMLInputElement>document.getElementById("canvasSizeH")).value);
      
      this.atlasLink = (<any> (<HTMLInputElement> document.getElementById("imgFile"))).children[0].src;
    }
}