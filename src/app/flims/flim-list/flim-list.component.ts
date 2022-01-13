import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { FlimsService } from 'src/app/service/flims.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlimViewComponent } from './flim-view/flim-view.component';
 
@Component({
  selector: 'app-flim-list',
  templateUrl: './flim-list.component.html',
  styleUrls: ['./flim-list.component.css']
})
export class FlimListComponent implements OnInit {
  items = [];
  
  @ViewChild(FlimViewComponent,{static:false}) view: FlimViewComponent;
  length:any
  flimdetails=[]
  @Input('rating') private rating: number = 3;
  @Input('starCount') private starCount: number = 5;
  @Input('color') private color: string = 'accent';
  @Output() private ratingUpdated = new EventEmitter();

  private snackBarDuration: number = 2000;
  private ratingArr = [];
  pageOfItems: Array<any>;
  filename: any;
  constructor(private flimservice:FlimsService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);

    }
    console.log('name',this.rating,this.ratingArr)
    this.getflimlist()
    
  }
  
getflimlist()
{
  this.flimservice.movielist().subscribe(val=>
    {
      
      this.items=val['data']
      this.length=this.items.length
       
    })
}
onClick(rating:number) {
  console.log(rating)
 
  this.ratingUpdated.emit(rating);
  return false;
}
viewClick(filename)
{
  this.filename=filename
  console.log(filename)
this.view.getflimdetails(filename).then(data=>
  {

    this.router.navigate(['movie_details/'+filename]);
  })
  
}
showIcon(index:number) {
  if (this.rating >= index + 1) {
    return 'star';
  } else {
    return 'star_border';
  }
}

onChangePage(pageOfItems: Array<any>) {
  // update current page of items
  this.pageOfItems = pageOfItems;
}
}
