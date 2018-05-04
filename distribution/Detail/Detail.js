var app = getApp();
var common = require('../../Common.js');
var WxParse = require('../../wxParse/wxParse.js');
var all;

Page({
  data: {
    url: common.config.CoursePath,
    XiaJia: true,
    JIangXIaoS:true,
    tu: { a: common.config.ImgPath + "tutututu.png", b: common.config.ImgPath + "jiao.jpg", c: common.config.ImgPath + "dingwei.jpg", d: common.config.ImgPath + "shouji.jpg", e: common.config.ImgPath + "de1.jpg", f: common.config.ImgPath + "de2.jpg" },
    didian: common.config.ImgPath +"Didian_03.png",
    shouji: common.config.ImgPath +"phone_03.png",
    xiajiatu: common.config.ImgPath +"XiaJia_03.png",
    hidden: true,
    dopenid: "",
    kid:"",
    imgHeight: "",
    shiping: ""
},
// 页面初次加载
    onLoad:function(res){
        var that=this;
        all = res;
        
    },
  // 首页
  ShouYua:function(){
    wx.switchTab({
      url: '../../Kecheng/Home/Home',
    })
  },
  onShow:function(){
    var that = this
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let imgHeight = ww * 0.5;
        that.setData({
          imgHeight: imgHeight
        });
      }
    });
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }
    console.log(all.openid == undefined)
    if (all.openid == undefined) {
      that.setData({
        JIangXIaoS: true,
      })
      this.Content(all.id, wx.getStorageSync('openid'))
    } else {
      console.log(123)
      that.setData({
        JIangXIaoS: false,
      })
      this.Content(all.id, all.openid)
      this.viewed(all.id, all.openid)
    }
  },
  ErWeiMa:function(){

  },
  // 浏览次数
  viewed: function (cid, openid){
    var that=this
    common.IsOpenId()
    var data = {
      name: wx.getStorageSync('nickName'),
      openid: wx.getStorageSync('openid'),
      dopenid:openid,
      mchid: common.data.MchId,
      cid: cid}
    wx.request({
      url: common.config.LiuLanCiShu,
      method:'post',
      data: data,
      success:function(res){
        console.log(res)
        console.log(data)
      },
    })
  },
  // 二维码
  ErWeiMa:function(res){
    var dix = res.target.dataset.ma;
    wx.navigateTo({
      url: '../EWei/EWei?id=' + dix,
    })
  },
  // 去编辑
  QuBianJi:function(e){
    wx.navigateTo({
      url: '../edit/edit?id=' + all.lid,
    })
  },
  // 分享
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '教育吧',
      path: '/distribution/Detail/Detail?id=' + all.id + '&openid=' + that.data.dopenid,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //加载数据
  Content: function (id, openid){
    var that=this
    that.setData({
      hidden:false
    })
    wx.request({
      url: common.config.GetCourseAndGrop,
      method:'post',
      data:{
        id: id,
        openid: openid,
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address'),
      },
      success:function(res){
        console.log(res)
        if (res.data.modle.Status==2){
          WxParse.wxParse('article', 'html', res.data.modle.Description, that, 5);
          var img = res.data.imgs.split(",")
          console.log(img)
          var list = res.data
          list.modle.OriginalPrice = list.modle.OriginalPrice.toFixed(2)
          list.modle.GroupPrice = list.modle.GroupPrice.toFixed(2)
          that.setData({
            list: list,
            PicturePath: that.data.url + res.data.modle.PicturePath,
            imgUrls: img,
            XiaJia: true,
            dopenid:openid,
            kid: id,
            shiping: list.modle.VideoPath
          })
        } else if (res.data.modle.Status == 0){
          that.setData({
            XiaJia: false,
            dopenid: openid
          })
          console.log(已下架)
        }
       
      },
      fail:function(){
        common.modalTap('网络错误')
      },
      complete:function(){
        that.setData({
          hidden: true
        })
      },
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh();
  },
  goumai:function(){
    var that=this;
    wx.navigateTo({
      url: '../DistOuder/DistOuder?kid=' + that.data.kid + '&title=' + that.data.list.modle.Title + "&img=" + that.data.list.modle.PicturePath + "&op=" + that.data.list.modle.OriginalPrice + "&gp=" + that.data.list.modle.GroupPrice + "&dopenid=" + that.data.dopenid
    });
  },
   zixun: function () {
     var pp = this.data.list.modle.Phone;
    wx.showModal({
      title: '欢迎咨询',
      confirmText: '呼叫',
      content: pp,
      success: function (sm) {
        if (sm.confirm) {
          wx.makePhoneCall({
            phoneNumber: pp
          })
        }
      }
    });
  },
  fanhui: function () {
    wx.reLaunch({
      url: '../../Kecheng/Home/Home'
    })
  }
});
