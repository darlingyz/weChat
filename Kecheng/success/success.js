// success.js
var app = getApp();
var common = require('../../Common.js');
var zou = "true";
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    show: true,
    succe: common.config.ImgPath + "groupsuccess_03.png",
    cheng: common.config.ImgPath + "successgree_03.png",
    ding: common.config.ImgPath + "dingwei_03.png",
    shou: common.config.ImgPath + "shouji.jpg",
    xian: false,
    kid: "",
    goumai: true,
    types: "",
    address: "",
    phone: "",
    zhi: "",
    gid: "",
    status: "",
    glist:[]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var that = this;
    var zhi = "1";
    if (options.zhi == "0") {
      zhi = "0";
    }
    var ctype = "0";
    if (options.ctype != undefined) {
      ctype = options.ctype;
    }
    var cc="0";
    var id = options.gid;
    var goumai = true;
    var openid = wx.getStorageSync('openid');
    if (id == "0" || id == undefined || id=="") {
      wx.request({
        url: common.config.GetGropuBookingOfOpenId,
        data: {
          openid: openid,
          ctype: ctype
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.result) {
            var model = res.data.model;
            var kid = model.CourseId;
            var title = model.Course.Title;
            if (title.length > 20) {
              title = title.substr(0, 18) + '...';
            }
            var types = model.Course.Type;
            var img = common.config.CoursePath + model.Course.PicturePath;
            var sp = model.Course.sPrice;
            sp = sp.toFixed(2);
            var gp = model.Course.GroupPrice;
            gp = gp.toFixed(2);
            var op = model.Course.OriginalPrice;
            op = op.toFixed(2);
            var pp = model.Price;
            pp = pp.toFixed(2);
            var addre = model.Course.Address;
            var phon = model.Course.Phone;
            var glist = [];
            var status="";
            var a = false;
            if (phon == "" && addre == "") {
              a = true;
            }
            ////////////////////////////判断订单来自哪张表
            if (types == 1 || types == 4) {
              status = model.Status;
              glist = res.data.model.GroupBooking_Users;
              for (var i = 0; i < glist.length; i++) {
                if (glist[i].UsersOpenId == model.ColonelOpenId) {
                  if (model.GroupType == 0) {
                    goumai = false;
                    glist[i].zhu = 2;
                  } else {
                    glist[i].zhu = 0;
                  }
                }
                else { glist[i].zhu = 1; }
                glist[i].CreateOn = common.timeStamp2String(glist[i].CreateOn);
              }
              if (model.Course.Type=="4")
              {
                goumai = false;
              }

              if (zhi != "0") {
                //that.tuisong("1",openid,id,types);
              }
              model.StartTime = common.timeStamp2String(model.StartTime);
              model.EndTime = common.timeStamp2String(model.EndTime);
            }
            else if(types == 5 || types == 6)
            {
              goumai = false;
              status = model.Type;
              model.CreateOn = common.timeStamp2String(model.CreateOn);
              model.StartTime = model.CreateOn;
              model.EndTime = model.CreateOn;
            }
            //更新数据
            that.setData({
              title: title,
              img: img,
              gprice: pp,
              oprice: op,
              sprice: sp,
              address: addre,
              phone: phon,
              xian: a,
              kid: kid,
              model: model,
              types: types,
              zhi: zhi,
              gid: id,
              status: status,
              goumai:goumai,
              glist:glist
            });
          }
        }
      });
    }
    else {
      var otype = options.otype;
      wx.request({
        url: common.config.GetGropuBookingOfId,
        data: {
          id: id,
          otype: otype,
          openid: wx.getStorageSync('openid')
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.result) {
            var model = res.data.model;
            otype = model.Course.Type;
            var kid = model.CourseId;
            var glist = [];
            var title = model.Course.Title;
            if (title.length > 20) {
              title = title.substr(0, 18) + '...';
            }
            var types = model.Course.Type;
            var img = common.config.CoursePath + model.Course.PicturePath;
            var sp = model.Course.sPrice;
            if (parseInt(sp) == sp) {
              sp = sp.toFixed(2);
            }
            var gp = model.Course.GroupPrice;
            if (parseInt(gp) == gp) {
              gp = gp.toFixed(2);
            }
            var op = model.Course.OriginalPrice;
            if (parseInt(op) == op) {
              op = op.toFixed(2);
            }
            var addre = model.Course.Address;
            var phon = model.Course.Phone;
            var a = false;
            if (phon == "" && addre == "") {
              a = true;
            }
            var pp = gp;
            var status="";
            ////////////////////////////判断订单来自哪张表
            if (otype == "1" ||  otype =="4") {
              cc = res.data.cc;
              status = model.Status;
              glist = res.data.model.GroupBooking_Users;
              if (types == 4) {
                goumai = false;
                if (model.Shifu != "0") {
                  pp = model.Shifu.toFixed(2);
                }
                else{
                if (model.AttendCount == model.ParticipateCount)
                { pp = gp; }
                else if (model.AttendCount >= model.RetailPriceCount)
                { pp = model.Course.RetailPrice.toFixed(2); }
                else if (model.AttendCount < model.RetailPriceCount)
                { pp = op; }
                }
              }
              else if (otype == "1")
              {
                pp = model.Shifu.toFixed(2);
              }
              for (var i = 0; i < glist.length; i++) {
                if (glist[i].UsersOpenId == model.ColonelOpenId) {
                  if (model.GroupType == 0) {
                    goumai = false;
                    glist[i].zhu = 2;
                  } else {
                    glist[i].zhu = 0;
                  }
                }
                else { glist[i].zhu = 1; }
                glist[i].CreateOn = common.timeStamp2String(glist[i].CreateOn);
              }
              if (model.GroupType == 0) {
                gp = model.Price.toFixed(2);
              }
              model.StartTime = common.timeStamp2String(model.StartTime);
              model.EndTime = common.timeStamp2String(model.EndTime);
            }
            else if (otype == "5" || otype == "6") {
              status = model.Type;
              model.CreateOn = common.timeStamp2String(model.CreateOn);
              model.StartTime = model.CreateOn;
              model.EndTime = model.CreateOn;
            }
            //更新数据
            that.setData({
              title: title,
              img: img,
              gprice: pp,
              oprice: op,
              sprice: sp,
              address: addre,
              phone: phon,
              xian: a,
              kid: kid,
              model: model,
              types: types,
              zhi: zhi,
              gid: id,
              status: model.Type,
              glist:glist,
              goumai: goumai
            });
          }
        }
      });
      if (cc == "1") {
        // wx.request({
        //   url: common.config.TsGroupBooking,
        //   data: {
        //     gid: id
        //   },
        //   method: 'POST',
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: function (res) {
        //     console.log(res);
        //   }
        // });
      }
    }
  },
  shouye: function () {
    wx.reLaunch({
      url: '../Home/Home',
    })
  },
  kecheng: function () {
    zou = "false";
    var that = this;
    if (that.data.types == "4") {
      if (that.data.status == "1") {
        wx.redirectTo({
          url: '../Onebargaining/Onebargaining?yu=0&copenid=0&cid=' + that.data.kid,
        })
      }
      else {
        wx.redirectTo({
          url: '../Twobargaining/Twobargaining?yu=0&gid=' + that.data.gid
        });
      }
    }
    else if (that.data.types == "1") {
      wx.redirectTo({
        url: '../Detail/Detail?yu=0&copenid=0&copenid=0&id=' + that.data.kid,
      })
    }
    else if (that.data.types == "5") {
      wx.redirectTo({
        url: '../YiYuan/YiYuan?id=' + that.data.kid + "&copenid=0&yu=0&oid=0"
      })
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
    zou = "true";
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
    var that = this;
    if (that.data.zhi != "0" && zou == "true") {
      wx.reLaunch({
        url: '../../Kecheng/Home/Home'
      });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
  },
  tuisong: function (types,openid, id, ctypes){
    wx.request({
      url: common.config.SendTempletMessge,
      data: {
        type: types, openid: openid, formid: wx.getStorageSync("formId"), id: id, mchid: common.data.MchId, ctype: ctypes
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
      }
    });
  }
})