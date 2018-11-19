(<HTMLElement>document.getElementById("colorPicker")).addEventListener("change",function(){
   (<HTMLElement>document.getElementById("helpColorPicker")).style.background =   (<any>this).value;
});