import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ImagePicker, Transfer } from 'ionic-native';
import { Headers, Http } from '@angular/http';
import { UserService } from '../service/User.service';

@Component({
  selector: 'page-sendchart',
  templateUrl: 'sendchart.html'
})
export class sendchartPage {

  text: string = "";
  hideWhen: any = false;
  images:any[] = [];
  upimages:any[] = [];
  url = "http://www.devonhello.com/cfdk/upload";
  loading = null;

  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, public userService: UserService, public alertCtrl: AlertController) {
    
    this.loading = this.loadingCtrl.create({
      content: '请稍后...'
    });

  }

  //调价图片
  addImg(){

    var _that = this;
    
    ImagePicker.getPictures({
    maximumImagesCount: 3 - _that.images.length,
    quality: 90,
    width: 880,
    height: 880
  }).then((results) => {
      
      for (var i = 0; i < results.length; i++) {
          //alert('Image URI: ' + results[i]);
          _that.images.push( results[i] );
      }
      if( _that.images.length == 3 ){
        _that.hideWhen = true;
      }
    }, (err) => { });
  }

  //发布心情
  send() {

    this.loading.present();

    if(this.text.length != 0 && this.images.length!=0){
      //alert(this.images[0]);
      this.upload(this.images[0]);
    }else{
      this.loading.dismiss();
      let alert = this.alertCtrl.create({
              title: '提示!',
              subTitle: '请输入完整，至少上传一张图片',
              buttons: ['确定']
            });
            alert.present();
    }
    
  }

  //图片上传处理
  upload(dataurl){

    const fileTransfer = new Transfer();

    fileTransfer.upload(dataurl, this.url, {}).then((data) => {
      //alert(data["response"]);
      this.upimages.push("http://7xp2ia.com1.z0.glb.clouddn.com/"+data["response"]);
      if(this.upimages.length != this.images.length){
        this.upload( this.images[this.upimages.length] );
      }else{
        
        alert(this.upimages);
        this.tohttp();
      }
        }, (err) => {
          this.loading.dismiss();
          alert("出错啦");
        });

  }

  //提交心情到服务器
  tohttp(){
    let url = "http://www.devonhello.com/cfdk/post_chart";

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post(url, "uid="+this.userService._user._id+"&uhead="+"https://avatars0.githubusercontent.com/u/11835988?v=3&s=460"+"&uname="+this.userService._user.uname+"&utext="+this.text+"&uimg="+this.upimages, {
        headers: headers
      })
        .subscribe((res) => {
          
          //alert(JSON.stringify(res.json()));
           if(res.json()["ops"][0]["_id"]){
             this.navCtrl.pop();
           }
          this.loading.dismiss();
        });
  }

}