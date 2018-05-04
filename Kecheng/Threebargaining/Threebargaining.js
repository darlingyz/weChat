// Kecheng/bargaining/bargaining.js
var app = getApp();
var common = require('../../Common.js');
var WxParse = require('../../wxParse/wxParse.js');
let col1H = 0;
var j = 0;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    imga: common.config.ImgPath + "kanjai_03.jpg",
    imgb: common.config.ImgPath + "time_03.jpg",
    imgc: common.config.ImgPath + "top-img_02.png",
    imgd: common.config.ImgPath + "jiantou-on_03.png",
    jindu: common.config.ImgPath + "jindu_01.jpg",
    jindu01: common.config.ImgPath + "jindu_02.jpg",
    yuandian: common.config.ImgPath + "yuandian.jpg",
    liucheng: common.config.ImgPath + "kanjialiuchn_03.jpg",
    xiala: common.config.ImgPath + "shiliangu价_07.png",
    remai: common.config.ImgPath + "remai_03.png",
    xinpin: common.config.ImgPath + "xinpin_07.png",
    penyouquan: common.config.ImgPath + "penyouquan_03.png",
    erweima: common.config.ImgPath + "mianshiba_03.jpg",
    yu: "",
    bb: "",
    haibao: "",
    gid: "",
    kid: "",
    kancount: "",
    grouplist: [],
    width: 0,
    topwidth:0,
    guoqi: 0,
    name:"",
    like: [],
    addrephone: false,
    tu: { c: common.config.ImgPath + "dingwei.jpg", d: common.config.ImgPath + "shouji.jpg" },
    phone: "",
    xprice:"",
    copenid: "",
    xiajiatu: common.config.ImgPath + "XiaJia_03.png",
    XiaJia: true,
    shiping: "",
    numbertime:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    else{
    var name = wx.getStorageSync('nickName');
    var that = this;
    var id="";
    var yu="";
    var numbertime="";
    if (options == undefined) {
      id = that.data.gid;
      yu = that.data.yu;
      numbertime = that.data.numbertime;
    }else{
      id = options.gid;
      yu = options.yu;
      numbertime = options.numbertime;
      if (yu == "0") {
        yu = "Xiadan";
      }
      if (numbertime == undefined)
      {
        numbertime="0";
      }
    }
    console.log(numbertime);
    var guoqi = 0;
    var xprice="";
    wx.request({
      url: common.config.GetKanGropAndCourse,
      data: {
        openid: wx.getStorageSync('openid'),
        gid: id,
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address'),
        number:numbertime
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result!="") {
          var migs = res.data.imgs;
          var model = res.data.modle;
          var group = res.data.group;
          var gp = model.GroupPrice;
          var like = res.data.youlike;
          var copenid = group.ColonelOpenId;
          var zizhiopenid = model.UsersOpenId;
          if (model.Status != "2") {
            that.setData({
              XiaJia: false
            });
          }
          else{
          if (parseInt(gp) == gp) {
            model.GroupPrice = gp.toFixed(2);
          }
          var rp = model.RetailPrice;
          if (parseInt(rp) == rp) {
            model.RetailPrice = rp.toFixed(2);
          }
          var op = model.OriginalPrice;
          if (parseInt(op) == op) {
            model.OriginalPrice = op.toFixed(2);
          }
          if (group.Status == 2)
          { guoqi = 1; }
          var list = [];
          var bb = "";
          migs = migs.split(",");
          for (var i = 0; i < migs.length; i++) {
            if (i == 0) {
              bb = common.config.CoursePath + migs[i];
            }
            var a = { url: common.config.CoursePath + migs[i] };
            list.push(a);
          }
          for (var i = 0; i < like.length; i++) {
            if (like[i].Title.length > 35) {
              like[i].Title = like[i].Title.substr(0, 35) + '...';
            }
            like[i].PicturePath = common.config.CoursePath + like[i].PicturePath;
            like[i].GroupPrice = like[i].GroupPrice.toFixed(2);
            like[i].OriginalPrice = like[i].OriginalPrice.toFixed(2);
          }
          var lis = [];
          for (var i = 1; i < group.GroupBooking_Users.length; i++) {
            group.GroupBooking_Users[i].CreateOn = common.timeStamp2String(group.GroupBooking_Users[i].CreateOn);
            if(group.GroupBooking_Users[i].Users.Name.length>5)
            {
              group.GroupBooking_Users[i].Users.Name = group.GroupBooking_Users[i].Users.Name.substr(0, 4) + '...';
            }
            lis.push(group.GroupBooking_Users[i]);
          }
          var xprice = model.OriginalPrice;
          if (group.AttendCount == group.ParticipateCount) {
            xprice = model.GroupPrice;
          }
          else if (group.AttendCount >= group.RetailPriceCount) {
            xprice = model.RetailPrice;
          }
          var y = false;
          if (model.Phone == "" && model.Address == "") {
            y = true;
          }
          if (model.Phone == "") {
            wx.request({
              url: common.config.GetCertification,
              data: {
                adminsid: common.data.MchId
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                if (res.data.result) {
                  that.setData({
                    phone: res.data.phone
                  })
                }
              }
            })
          }
          WxParse.wxParse('article', 'html', model.Description, that, 5);
          that.jisuan(model.RetailPriceCount, model.GroupPriceCount, group.AttendCount);
          that.setData({
            movies: list,
            kid: model.Id,
            gid: id,
            title: model.Title,
            jie: model.Introduce,
            // start: common.timeStamp2StringNian(model.StartTime),
            // end: common.timeStamp2StringNian(model.EndTime),
            miao: model.Description,
            gprice: model.GroupPrice,
            gpricecount: model.GroupPriceCount,
            xprice: xprice,
            oprice: model.OriginalPrice,
            rprice: model.RetailPrice,
            rpricecount: model.RetailPriceCount,
            address: model.Address,
            phone: model.Phone,
            ccount: model.ParticipateCount,
            ccountmin: parseInt(model.ParticipateCount) - 1,
            groupcount: res.data.groupcount,
            wtime: model.WaitTime,
            yu: yu,
            bb: bb,
            haibao: common.config.GroupImgFile + group.ImgPath,
            kancount: group.GroupBooking_Users.length - 1,
            grouplist: lis,
            guoqi: guoqi,
            name: group.Users.Name,
            like: like,
            addrephone:y,
            copenid: copenid,
            shiping: model.VideoPath,
            numbertime: numbertime
          });
          }
        }
      }
     });
    }
  },
  jisuan: function (rcount, gcount, acount) {
    var r = parseInt(rcount);
    var g = parseInt(gcount);
    var a = parseInt(acount);
    var width = 0;
    if(a>0)
    {
      if (a < r)
        width = ((236.25 / r) + (236.25 % r)) * a;
      if (a == r)
        width = 236.25;
      if (a > r && a < g)
        width = ((525 / g) + (525 % g)) * a;
      if (a == g)
        width = 482;
      this.setData({
        width: width,
        topwidth: width-3
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  mai:function(){
    var that=this;
    wx.navigateTo({
      url: '../Onebargaining/Onebargaining?cid=' + that.data.kid + "&yu=0"
    });
    // wx.request({
    //   url: common.config.InsertKanGroupBooking,
    //   data: { cid: that.data.kid, openid: wx.getStorageSync('openid') },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.data.result == "one") {
    //       wx.navigateTo({
    //         url: '../Onebargaining/Onebargaining?gid=' + res.data.id + "&yu=0"
    //       })
    //     }
    //     else if (res.data.result == "two") {
    //       wx.navigateTo({
    //         url: '../Twobargaining/Twobargaining?gid=' + res.data.id + "&yu=0"
    //       })
    //     }
    //   }
    // })
  },
  likekan: function (e) {
    var cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '../Onebargaining/Onebargaining?cid=' + cid + "&yu=0"
    });
    // wx.request({
    //   url: common.config.InsertKanGroupBooking,
    //   data: { cid: cid, openid: wx.getStorageSync('openid') },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.data.result == "one") {
    //       wx.navigateTo({
    //         url: '../Onebargaining/Onebargaining?gid=' + res.data.id + "&yu=0"
    //       })
    //     }
    //     else if (res.data.result == "two") {
    //       wx.navigateTo({
    //         url: '../Twobargaining/Twobargaining?gid=' + res.data.id + "&yu=0"
    //       })
    //     }
    //   }
    // });
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  CircleFriends: function () {
    var show = this.data.show;
    this.setData({
      show: !show
    })
  },
  baocun: function () {
    var that = this;
    wx.getImageInfo({
      src: that.data.haibao,
      success: function (res) {
        var path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            common.DoSuccess('图片保存成功');
            var show = that.data.show;
            that.setData({
              show: !show
            })
          }
        })
      }
    });
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: common.data.TitleName,
      desc: '快来帮我砍价吧',
      path: '/Kecheng/ThreeWhite/ThreeWhite?yu=0&cid=' + that.data.kid + '&copenid=' + that.data.copenid
    }
  },
  zixun: function () {
    var pp = this.data.phone;
    wx.showModal({
      title: '电话咨询',
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
  dizhi: function () {
    common.dizhi(this.data.address);
  } 
})