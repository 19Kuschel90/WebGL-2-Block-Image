
class C_MoveBot{
    private MyObjectTransform:C_Transform;
   private TragetVec:C_Vector3;
   private isRun:boolean;
   private speed:number = 1;
    constructor( 
        ObjectTransform:C_Transform = new C_Transform()
        ,TragetVec:C_Vector3 = new C_Vector3(0,0,0)      
        ,imRun:boolean = true
        ,Speed:number = 1
    ) {
        this.MyObjectTransform = ObjectTransform;
        this.TragetVec = TragetVec;
        this.isRun = imRun;
        this.speed = Speed;
    }


    public  Update():void{

        if(this.MyObjectTransform.position.x === this.TragetVec.x)
        {
            
        }else{
            if(this.MyObjectTransform.position.x < this.TragetVec.x)
            {
                this.MoveX(1);               
            }else{
                 this.MoveX(-1);
            }
        }
        if(this.MyObjectTransform.position.z === this.TragetVec.z)
        {

        }else{
            if(this.MyObjectTransform.position.z < this.TragetVec.z)
            {
                this.MoveZ(1);               
            }else{
                 this.MoveZ(-1);
            }
        }
        if(this.MyObjectTransform.position.y === this.TragetVec.y)
        {

        }else{
            if(this.MyObjectTransform.position.y < this.TragetVec.y)
            {
                this.MoveY(1);               
            }else{
                 this.MoveY(-1);
            }
        }
        if(this.MyObjectTransform.position.z === this.TragetVec.z)
        {

        if(this.MyObjectTransform.position.x === this.TragetVec.x){
            if(this.MyObjectTransform.position.y === this.TragetVec.y)
            {
                this.isRun = false;
            }
        }
    }
}


    // step * speed
    public  MoveZ(step:number):void{
        var temp:number =  step * this.speed;
        this.MyObjectTransform.position.z +=  temp;
        if(this.MyObjectTransform.position.z < this.TragetVec.z)
        {
            if(this.MyObjectTransform.position.z + temp >  this.TragetVec.z )
            {
                this.MyObjectTransform.position.z = this.TragetVec.z;
            }
        }
        if(this.MyObjectTransform.position.z > this.TragetVec.z)
        {
            if(this.MyObjectTransform.position.z + temp <  this.TragetVec.z )
            {
                this.MyObjectTransform.position.z = this.TragetVec.z;
            }
        }
    }

    // step * speed
    public  MoveX(step:number):void{
        var temp:number =  step * this.speed;
        this.MyObjectTransform.position.x +=  temp;
        if(this.MyObjectTransform.position.x < this.TragetVec.x)
        {
            if(this.MyObjectTransform.position.x + temp >  this.TragetVec.x )
            {
                this.MyObjectTransform.position.x = this.TragetVec.x;
            }
        }
        if(this.MyObjectTransform.position.x > this.TragetVec.x)
        {
            if(this.MyObjectTransform.position.x + temp <  this.TragetVec.x )
            {
                this.MyObjectTransform.position.x = this.TragetVec.x;
            }
        }
    }

    // step * speed
    public   MoveY(step:number):void{
        var temp:number =  step * this.speed;
        this.MyObjectTransform.position.y +=  temp;
        if(this.MyObjectTransform.position.y < this.TragetVec.y)
        {
            if(this.MyObjectTransform.position.y + temp >  this.TragetVec.y )
            {
                this.MyObjectTransform.position.y = this.TragetVec.y;
            }
        }
        if(this.MyObjectTransform.position.y > this.TragetVec.y)
        {
            if(this.MyObjectTransform.position.y + temp <  this.TragetVec.y )
            {
                this.MyObjectTransform.position.y = this.TragetVec.y;
            }
        }
     
    }

    private saveMove(pos:number, stepSpeed:number):void {
        // if(pos + (stepSpeed*2) <  )
    }

 
    ////////////////////////////////////////////
    public GetSpeed():number{
         return this.speed;
    }

    public SetSpeed(Speed:number){
        this.speed = Speed;
    }

//////////////////////////////////////////////////////
    public  GetMyObjectTransform():C_Transform{
            return this.MyObjectTransform;
    }
    public SetMyObjectTransform(newTransform:C_Transform):void{
        this.MyObjectTransform = newTransform;
    }
    /////////////////////////////////////////////////////
    public GetPosition():C_Vector3{
        return this.MyObjectTransform.position;
    }
    public  SetPosition(NewVector:C_Vector3):void{
        this.MyObjectTransform.position = NewVector;
    }
    ////////////////////////////////////
    public GetIsRun():boolean{
        return this.isRun;
    }
    public SetIsRun(wert:boolean){
         this.isRun = wert;
    }
}