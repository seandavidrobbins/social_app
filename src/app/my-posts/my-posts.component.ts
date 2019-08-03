import { Component, OnInit } from '@angular/core';
import { MyFireService } from '../shared/myfire.service';
import { NotificationService } from '../shared/notification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-my- posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})
export class MyPostsComponent implements OnInit {
  personalPostRef: any;
  postLists: any = [];

  constructor(private myFire: MyFireService, private notifier: NotificationService) { }

  ngOnInit() {

    const uid = firebase.auth().currentUser.uid;
    this.personalPostRef = this.myFire.getUserPostsRef(uid);
    this.personalPostRef.on('child_added', data => {
      this.postLists.push({
        key: data.key,
        data: data.val()
      });
    });

  } 

  onFileSelection(event) {
    const fileList: FileList = event.target.files;
 
    if(fileList.length > 0) {
      const file: File = fileList[0];
      this.myFire.uploadFile(file)
        .then(data => {
          this.notifier.display('success', 'Picture Uploaded Successfully!');
          this.myFire.handleImageUpload(data);
        })
        .catch(err => {
          this.notifier.display('error', err.message);
        });
    }
  }

  ngOnDestroy() {
    this.personalPostRef.off();
  }
}