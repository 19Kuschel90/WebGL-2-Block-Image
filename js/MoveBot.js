"use strict";
class C_MoveBot {
    constructor(ObjectTransform = new C_Transform(), TragetVec = new C_Vector3(0, 0, 0), imRun = true, Speed = 1) {
        this.speed = 1;
        this.MyObjectTransform = ObjectTransform;
        this.TragetVec = TragetVec;
        this.isRun = imRun;
        this.speed = Speed;
    }
    Update() {
        if (this.MyObjectTransform.position.x === this.TragetVec.x) {
        }
        else {
            if (this.MyObjectTransform.position.x < this.TragetVec.x) {
                this.MoveX(1);
            }
            else {
                this.MoveX(-1);
            }
        }
        if (this.MyObjectTransform.position.z === this.TragetVec.z) {
        }
        else {
            if (this.MyObjectTransform.position.z < this.TragetVec.z) {
                this.MoveZ(1);
            }
            else {
                this.MoveZ(-1);
            }
        }
        if (this.MyObjectTransform.position.y === this.TragetVec.y) {
        }
        else {
            if (this.MyObjectTransform.position.y < this.TragetVec.y) {
                this.MoveY(1);
            }
            else {
                this.MoveY(-1);
            }
        }
        if (this.MyObjectTransform.position.z === this.TragetVec.z) {
            if (this.MyObjectTransform.position.x === this.TragetVec.x) {
                if (this.MyObjectTransform.position.y === this.TragetVec.y) {
                    this.isRun = false;
                }
            }
        }
    }
    // step * speed
    MoveZ(step) {
        var temp = step * this.speed;
        this.MyObjectTransform.position.z += temp;
        if (this.MyObjectTransform.position.z < this.TragetVec.z) {
            if (this.MyObjectTransform.position.z + temp > this.TragetVec.z) {
                this.MyObjectTransform.position.z = this.TragetVec.z;
            }
        }
        if (this.MyObjectTransform.position.z > this.TragetVec.z) {
            if (this.MyObjectTransform.position.z + temp < this.TragetVec.z) {
                this.MyObjectTransform.position.z = this.TragetVec.z;
            }
        }
    }
    // step * speed
    MoveX(step) {
        var temp = step * this.speed;
        this.MyObjectTransform.position.x += temp;
        if (this.MyObjectTransform.position.x < this.TragetVec.x) {
            if (this.MyObjectTransform.position.x + temp > this.TragetVec.x) {
                this.MyObjectTransform.position.x = this.TragetVec.x;
            }
        }
        if (this.MyObjectTransform.position.x > this.TragetVec.x) {
            if (this.MyObjectTransform.position.x + temp < this.TragetVec.x) {
                this.MyObjectTransform.position.x = this.TragetVec.x;
            }
        }
    }
    // step * speed
    MoveY(step) {
        var temp = step * this.speed;
        this.MyObjectTransform.position.y += temp;
        if (this.MyObjectTransform.position.y < this.TragetVec.y) {
            if (this.MyObjectTransform.position.y + temp > this.TragetVec.y) {
                this.MyObjectTransform.position.y = this.TragetVec.y;
            }
        }
        if (this.MyObjectTransform.position.y > this.TragetVec.y) {
            if (this.MyObjectTransform.position.y + temp < this.TragetVec.y) {
                this.MyObjectTransform.position.y = this.TragetVec.y;
            }
        }
    }
    saveMove(pos, stepSpeed) {
        // if(pos + (stepSpeed*2) <  )
    }
    ////////////////////////////////////////////
    GetSpeed() {
        return this.speed;
    }
    SetSpeed(Speed) {
        this.speed = Speed;
    }
    //////////////////////////////////////////////////////
    GetMyObjectTransform() {
        return this.MyObjectTransform;
    }
    SetMyObjectTransform(newTransform) {
        this.MyObjectTransform = newTransform;
    }
    /////////////////////////////////////////////////////
    GetPosition() {
        return this.MyObjectTransform.position;
    }
    SetPosition(NewVector) {
        this.MyObjectTransform.position = NewVector;
    }
    ////////////////////////////////////
    GetIsRun() {
        return this.isRun;
    }
    SetIsRun(wert) {
        this.isRun = wert;
    }
}
//# sourceMappingURL=MoveBot.js.map