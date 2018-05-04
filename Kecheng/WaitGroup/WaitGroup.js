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
    arry: [],
    text: "",
    pric: 0,
    befor: 0,
    maxurl: "",
    sheng: 0,
    cha: 0,
    lls: [],
    kid:""
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var that = this;
    clearTimeout(pp);
    var id = options.id;
    wx.request({
      url: common.config.GetGropuBookingOfId,
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.result) {
          var list = res.data.model.GroupBooking_Users;
          var model = res.data.model;
          var kid = model.CourseId;
          for (var i = 0; i < list.length; i++) {
            if (i == 0) {
              list[i].show = false;
            }
            else {
              list[i].show = true;
            }
          }
          var c = parseInt(model.ParticipateCount) - parseInt(model.AttendCount);
          var lls=[];
          for(var i=0;i<c;i++)
          {
            var ll = { uu: common.config.ImgPath+"yuan.jpg"};
            lls.push(ll);
          }
          var et = common.timeStamp2String(model.EndTime);
          var d1 = new Date();
          var d2 = new Date(et.replace(/-/g, '/'));
          var wtime = (d2 - d1);
          total_micro_second = wtime;
          count_down(that);

          that.setData({
            arry: list,
            text: model.Course.Title,
            pric: model.Course.GroupPrice,
            befor: model.Course.OriginalPrice,
            maxurl: common.config.CoursePath + model.Course.PicturePath,
            sheng: (model.Course.sPrice).toFixed(2),
            cha: c,
            lls:lls,
            kid: kid
          })
        }
      }
    })
  },
  onUnload: function () {

  },
  kecheng: function () {
    var that = this;
    wx.navigateTo({
      url: '../Detail/Detail?id=' + that.data.kid,
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  } 
});
