// Kecheng/bargaining/bargaining.js
var app = getApp();
var common = require('../../Common.js');
var WxParse = require('../../wxParse/wxParse.js');
let col1H = 0;
var j = 0;
var pingdian = "true";

var total_micro_second = null;
var pp;
clearTimeout(pp);
/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  if (total_micro_second != null) {
    var aa = date_format(total_micro_second);
    if (aa != "" && total_micro_second != undefined) {
      var tian = aa.substr(0, 2) * 24;
      var shi = parseInt(tian) + parseInt(aa.substr(2, 2));
      var fen = aa.substr(4, 2);
      var miao = aa.substr(6, 2);
    }

    that.setData({
      shi: shi,
      fen: fen,
      miao: miao,
      tian: tian,
    });

    if (total_micro_second <= 0) {
      that.setData({
        clock: "已经截止"
      });
      // timeout则跳出递归
      return;
    }
    pp = setTimeout(function () {
      // 放在最后--
      total_micro_second -= 1;
      count_down(that);
    }, 1000)
  }
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = micro_second;
  // 小时位
  var hr = Math.floor(second / 3600);
  //天
  var day = Math.floor(hr / 24);
  // 小时
  var hx = fill_zero_prefix((Math.floor(second / 3600 % 24)));
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  //   var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return fill_zero_prefix(day) + hx + min + sec
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
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
    gid: 0,
    kid: "",
    kancount: "",
    grouplist: [],
    width: 0,
    guoqi: 0,
    like: [],
    addrephone: false,
    tu: { c: common.config.ImgPath + "dingwei.jpg", d: common.config.ImgPath + "shouji.jpg" },
    phone: "",
    xprice: "",
    xiajiatu: common.config.ImgPath + "XiaJia_03.png",
    XiaJia: true,
    shiping: "",
    currred:""
  },
  CircleFriends: function () {
    var show = this.data.show;
    this.setData({
      show: !show
    })
  },
  close: function () {
    this.setData({
      show: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var that = this;
    var id = "";
    var yu = "";
    var numbertime = "";
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }
    if (options != undefined) {
      id = options.gid;
      yu = options.yu;
      // numbertime = options.numbertime;
      // if (numbertime == undefined)
      // {
      //   numbertime="0";
      // }
      if (yu == "0") {
        yu = "Xiadan";
      }
    }
    else {
      id = that.data.gid;
      yu = that.data.yu;
    }
    var guoqi = 0;
    wx.request({
      url: common.config.GetKanGropAndCourse,
      data: {
        gid: id,
        openid: wx.getStorageSync('openid')
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          if (res.data.group.Status == "1") {
            wx.reLaunch({
              url: '../Onebargaining/Onebargaining?cid=' + res.data.modle.Id,
            })
          }
          var currred = res.data.currred;
          var migs = res.data.imgs;
          var model = res.data.modle;
          var group = res.data.group;
          var gp = model.GroupPrice;
          var like = res.data.youlike;
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
            if (group.GroupBooking_Users[i].Users.Name.length > 5) {
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
            xprice: xprice,
            gprice: model.GroupPrice,
            gpricecount: model.GroupPriceCount,
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
            like: like,
            addrephone: y,
            shiping: model.VideoPath,
            currred: currred
          });

          total_micro_second = res.data.etime;
          clearTimeout(pp);
          count_down(that);
          }
        }
      }
    });
  },
  jisuan: function (rcount, gcount, acount) {
    var r = parseInt(rcount);
    var g = parseInt(gcount);
    var a = parseInt(acount);
    var width = 0;
    if (a < r)
      width = ((45 / r) + (45 % r)) * a;
    if (a == r)
      width = 45;
    if (a > r && a < g)
      width = ((100 / g) + (100 % g)) * a;
    if (a == g)
      width = 92;
    this.setData({
      width: width
    })
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
    pingdian = "true";
    clearTimeout(pp);
    count_down(this);
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
  Xiadan: function (e) {
    var that = this;
    var kid = this.data.kid;
    var gid = e.currentTarget.dataset.gid;
    var types = 11;
    if (that.data.guoqi == 0) {
      if (that.data.kancount == that.data.gpricecount) {
        types = 33;
      }
      else if (that.data.kancount >= that.data.rpricecount) {
        types = 22;
      }
      if (pingdian == "false") {
        return;
      } else {
        pingdian = "false";
        //types  11.原价 22.折扣价 33.底价
        wx.navigateTo({
          url: '../Ouder/Ouder?kid=' + kid + '&gid=' + gid + '&types=' + types + '&co=1'
        });
      }
    }
    else {
      common.modalTap('你的砍价已过期');
    }
  },
  onShareAppMessage: function () {
    var that = this;
    var nn = common.GetNumberTime();
    return {
      title: common.data.TitleName,
      desc: '快来帮我砍价吧',
      path: '/Kecheng/ThreeWhite/ThreeWhite?yu=0&cid=' + that.data.kid + '&copenid=' + wx.getStorageSync('openid') + '&numbertime=' + nn,
      success: function (res) {
        if (that.data.currred.Id != "0") {
          var aa = "现金";
          if (that.data.currred.RedpocketType == "1") {
            aa = "课程";
          }
          common.modalTap("课程分享成功,好友打开课程后您可获得" + aa + "红包。");
        }
        wx.request({
          url: common.config.InsertColonelOpenIdShare,
          data: {
            openid: wx.getStorageSync('openid'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address'),
            type: 1,
            id: that.data.kid,
            mchid: common.data.MchId,
            number: nn
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) { }
        });
        
      }
    }
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
    clearTimeout(pp);
    col1H = 0;
    j = 0;
    pingdian = "true";
    total_micro_second = "";
    pp = "";
    this.onLoad();
    wx.stopPullDownRefresh()
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