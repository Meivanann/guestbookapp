import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FlimsService } from 'src/app/service/flims.service';
@Component({
  selector: 'app-movie-register',
  templateUrl: './movie-register.component.html',
  styleUrls: ['./movie-register.component.css']
})
export class MovieRegisterComponent implements OnInit {
flimform:FormGroup
submitted=false
@Input() requiredFileType:string;
@ViewChild('fileInput',{static:false}) fileInput!: ElementRef;

    fileList=[];
    listOfFiles=[]
    uploadProgress:number;
    uploadSub: Subscription;
  constructor(private flimservice:FlimsService) { }

  ngOnInit() {
    this.flimform=new FormGroup({
      flimname: new FormControl('',[Validators.required]),
      descripation: new FormControl('',[Validators.required]),
      relase_date: new FormControl('',[Validators.required]),
      rating: new FormControl('',[Validators.required,Validators.min(1),Validators.max(5)]),
      ticket_price: new FormControl('',[Validators.required]),
      country: new FormControl('',[Validators.required]),
      gener: new FormControl('',[Validators.required]),
      image: new FormControl('',[Validators.required]),
    });
  }
get w()
{
   return this.flimform.controls
}
onFileSelected(event) {
  for (var i = 0; i <= event.target.files.length - 1; i++) {
    var selectedFile = event.target.files[i];
    this.fileList.push(selectedFile);
    this.listOfFiles.push(selectedFile.name)
}

 
}

removeSelectedFile(index) {
  // Delete the item from fileNames list
  this.listOfFiles.splice(index, 1);
  // delete file from FileList
  this.fileList.splice(index, 1);
  console.log(this.w.image.value)

  this.fileInput.nativeElement.value=''
 }
 
submit()
{
  if(this.flimform.invalid)
  {
    return false
  }
  else
  {
    let data={}
    data['flim-name']=this.w.flimname.value
    data['description']=this.w.descripation.value
    data['relase_date']=this.w.relase_date.value
    data['rating']=this.w.rating.value
    data['ticket_price']=this.w.ticket_price.value
    data['country']=this.w.country.value
    data['gener']=this.w.gener.value
   data['flimname']=this.fileList
    this.flimservice.moviecreate(data).subscribe(val=>
      {
        console.log(val)
      })
    
  }
}
}
