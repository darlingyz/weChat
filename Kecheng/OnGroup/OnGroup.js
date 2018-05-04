var app = getApp();
var common = require('../../Common.js');
var now = new Date();
var nian = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
var shi = (now.getHours() < 10 ? "0" : "") + now.getHours() + ":" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
/**
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second;
var pp;
clearTimeout(pp)

/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
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
    total_micro_second -= 1000;
    count_down(that);
  }, 1000)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  var hx = fill_zero_prefix(Math.floor(second / 3600 % 24))
  //天
  var day = fill_zero_prefix(Math.floor(hr / 24));
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  //   var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return "剩余\n" + hx + "\n:\n" + min + "\n:\n" + sec + "\n\n结束";
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({
  data: {
    clock: '',
    userInfo: {},
    show: true,
    jiao: common.config.ImgPath + "jiao.jpg",
    gid: "",
    yuan: [],
    kid:"",
    shenhidden:true,
    currred:""
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: common.data.TitleName,
      desc: '快来帮我拼课程',
      path: '/Kecheng/friendspell/friendspell?gid=' + that.data.gid,
      success: function (res) {
        if (that.data.currred.Id != "0") {
          var aa = "现金";
          if (that.data.currred.RedpocketType == "1") {
            aa = "课程";
          }
          common.modalTap("拼团分享成功,好友打开拼团后您可获得" + aa + "红包。");
        }
        wx.request({
          url: common.config.InsertColonelOpenIdShare,
          data: {
            openid: wx.getStorageSync('openid'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address'),
            type: 2,
            id: that.data.gid,
            mchid: common.data.MchId
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
  fan: function () {
    wx.reLaunch({
      url: '../../Kecheng/Home/Home',
    })
  },
  lala:function()
  {
    var that = this;
    wx.reLaunch({
      url: '../friendspell/friendspell?gid=' + that.data.gid
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var that = this;
    clearTimeout(pp);
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }
    var openid = wx.getStorageSync('openid');
    var gid = "";
    var kid = "";
    if (options == undefined)
    {
      gid = that.data.gid;
      kid = that.data.kid;
    }
    else{
     gid = options.gid;
     kid = options.kid;
    // var gid ="6";
    // var kid="1";
    }
    var wtime="";
    var title="";
    var img="";
    var gp="";
    var op = "";
    var sp = "";
    var ucount = "";
    var maxurl="";
    var st="";
    var et="";
    var list = [];
    var glist = [];
    if(gid=="0")
    {
      // console.log("开团订单："+wx.getStorageSync("packageid"));
      wx.request({
        url: common.config.GetGropuBookingOfOpenIdAndKid,
        data: {
          openid: openid,
          kid:kid
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.result) {
            var model = res.data.model;
            glist = res.data.model.GroupBooking_Users;
            title = model.Course.Title;
            img = common.config.CoursePath + model.Course.PicturePath;
            var sp = model.Course.sPrice;
            sp = sp.toFixed(2);
            var gp = model.Course.GroupPrice;
            if (parseInt(gp) == gp) {
              gp = gp + ".00";
            }
            var op = model.Course.OriginalPrice;
            if (parseInt(op) == op) {
              op = op + ".00";
            }
            ucount = model.ParticipateCount;
            maxurl = model.Users.AvatarUrl;
            st = common.timeStamp2String(model.StartTime);
            et = common.timeStamp2String(model.EndTime);
            for (var i = 0; i < parseInt(ucount) - 1; i++) {
              var im = {};
              if (i + 1 < glist.length) {
                im = { im: glist[i + 1].Users.AvatarUrl };
              }
              else {
                im = { im: common.config.ImgPath + "yuan.jpg" };
              }
              list.push(im);
            }
            var d1 = new Date();
            var d2 = new Date(et.replace(/-/g, '/'));
            wtime = (d2 - d1);
            kid = model.CourseId;
            gid=model.Id;
            //更新数据
            that.setData({
              MaxavatarUrl: maxurl,
              title: title,
              img: img,
              gprice: gp,
              oprice: op,
              sprice: sp,
              ucount: parseInt(ucount) - glist.length,
              gid: gid,
              yuan: list,
              kid: kid,
              shenhidden:true
            });

            wx.request({
              url: common.config.GetCurrOfMchId,
              data: { mchid: common.data.MchId, type: 1 },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                var currred = res.data.currred;
                that.setData({
                  currred: currred
                });
              }
            });
          }
          total_micro_second = wtime;
          count_down(that);

          //var payid = wx.getStorageSync("packageid")
          // common.modalTap("packageid:" + payid.substr(10));
          wx.request({
            url: common.config.SendTempletMessge,
            data: {
              type: "2", openid: openid, formid: wx.getStorageSync("formId"), id: gid, mchid: common.data.MchId, ctype: "1"
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
             }
          });
        }
      });
    }
    else{
    wx.request({
      url: common.config.GetGropuBookingOfId,
      data: {
        id: gid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          var model=res.data.model;
          glist = res.data.model.GroupBooking_Users;
          title = model.Course.Title;
          img = common.config.CoursePath + model.Course.PicturePath;
          var sp = model.Course.sPrice;
          sp = sp.toFixed(2);
          var gp = model.Course.GroupPrice;
          if (parseInt(gp) == gp) {
            gp = gp + ".00";
          }
          var op = model.Course.OriginalPrice;
          if (parseInt(op) == op) {
            op = op + ".00";
          }
          ucount = model.ParticipateCount;
          maxurl = model.Users.AvatarUrl;
          st = common.timeStamp2String(model.StartTime);
          et = common.timeStamp2String(model.EndTime);
          for (var i = 0; i < parseInt(ucount) - 1; i++) {
            var im = {};
            if (i + 1 < glist.length) {
              im = { im: glist[i + 1].Users.AvatarUrl };
            }
            else {
              im = { im: common.config.ImgPath + "yuan.jpg" };
            }
            list.push(im);
          }
          var d1 = new Date();
          var d2 = new Date(et.replace(/-/g, '/'));
          wtime = (d2 - d1);
          kid = model.CourseId;
          //更新数据
          that.setData({
            MaxavatarUrl: maxurl,
            title: title,
            img: img,
            gprice: gp,
            oprice: op,
            sprice: sp,
            ucount: parseInt(ucount) - glist.length,
            gid: gid,
            yuan: list,
            kid: kid,
            shenhidden: false
          })
        }
        total_micro_second = wtime;
        count_down(that);

        // wx.request({
        //   url: common.config.SendTempletMessge,
        //   data: {
        //     type: "1", openid: openid, formid: wx.getStorageSync("formId"), id: gid, mchid: common.data.MchId, ctype: "1"
        //   },
        //   method: 'GET',
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: function (res) {
        //   }
        // });
      }
    });
    }
  },
  kecheng: function () {
    var that = this;
    wx.navigateTo({
      url: '../Detail/Detail?id=' + that.data.kid + "&yu=0",
    })
  },
  xiang: function () {
    wx.navigateTo({
      url: '../rule/rule'
    });
  },
  onPullDownRefresh: function () {
    clearTimeout(pp);
    now = new Date();
    total_micro_second = "";
    pp = "";
    this.onLoad();
    wx.stopPullDownRefresh()
  }
});
