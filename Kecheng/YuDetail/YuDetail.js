var app = getApp();
var common = require('../../Common.js')
/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second;

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
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that);
  }, 10)
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
  return "距结束仅剩\n\n" +day + "\n天\n" + hx + "\n时\n" + min + "\n分\n" + sec + "\n秒";
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({
  data: {
    movies: [],
    clock: '',
    phone:"",
    tu: { a: common.config.ImgPath + "tutututu.png", b: common.config.ImgPath + "jiao.jpg", c: common.config.ImgPath + "dingwei.jpg", d: common.config.ImgPath + "shouji.jpg", e: common.config.ImgPath + "de1.jpg", f: common.config.ImgPath + "de2.jpg"}
  },
  onLoad: function (options) {
    var that = this;
    count_down(this);
    var et = options.et;
    var d1 = new Date();
    var d2 = new Date(et.replace(/-/g, '/'));
    var wtime = (d2 - d1);
    total_micro_second = wtime;
    var title = options.title;
    var jie = options.jian;
    var end = options.et;
    var miao = options.miao;
    var gp = options.gp;
    var openid = wx.getStorageSync('openid');
    if (parseInt(gp) == gp) {
      gp = gp + ".00";
    }
    var rp = options.rp;
    if (parseInt(rp) == rp) {
      rp = rp + ".00";
    }
    var op = options.op;
    if (parseInt(op) == op) {
      op = op + ".00";
    }
    var p=false;
    var address=options.ad;
    var phone=options.ph;
    if (address==""&&phone=="")
    {
      p=true;
    }
    if (phone == "") {
      wx.request({
        url: common.config.GetCertification,
        data: {
          openid: openid
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
    var ccount=options.cc;
    var keshi = options.pe;
    var list=[];
    var migs = wx.getStorageSync("migs");
    migs = migs.split(",");
    for(var i=0;i<migs.length;i++)
    {
      var a = { url: common.config.CoursePath + migs[i]};
      list.push(a);
    }
    that.setData({
      movies:list,
      title :title,
      jie: jie,
      end: end,
      miao: miao,
      gprice: gp,
      oprice: op,
      rprice: rp,
      address: address,
      phone: phone,
      ccount: ccount,
      addrephone:p
    })
  },
  detial: function () {
    wx.navigateTo({
      url: '../rule/rule'
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  zixun: function () {
    var pp = this.data.phone;
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
  } 
  // Xiadan: function (e) {
  //   var kid = e.currentTarget.dataset.kid;
  //   wx.redirectTo({
  //     url: '../Group/Group?kid=' + kid
  //   });
  // },
  // detial: function () {
  //   wx.navigateTo({
  //     url: '../rule/rule'
  //   });
  // },
  // jump: function () {
  //   wx.navigateTo({
  //     url: '../Ouder/Ouder',
  //   })
  // },
});
