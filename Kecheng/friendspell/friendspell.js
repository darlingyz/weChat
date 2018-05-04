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
    jiao: common.config.ImgPath + "jiao.jpg",
    userInfo: {},
    show: true,
    kid:"",
    gid:"",
    ucount:0,
    status:0,
    pcount:"",
    a:false
  },
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync("openid");
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    clearTimeout(pp);
    var gid="";
    if (options == undefined) {
      gid = that.data.gid;
    }else{
      gid = options.gid;
    }
    var wtime = "";
    var list = [];
    var a=false;
    
    wx.request({
      url: common.config.GetAdminmodel,
      method: 'POST',
      data: { mchid: common.data.MchId },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        common.data.TitleName = res.data.model.Name
        wx.setNavigationBarTitle({ title: common.data.TitleName });

        wx.request({
          url: common.config.GetGropuBookingOfId,
          data: {
            id: gid,
            openid: wx.getStorageSync("openid")
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.result) {
              var list=[];
              var model = res.data.model;
              var glist = res.data.model.GroupBooking_Users;
              var kid = model.CourseId;
              var status = model.Status;
              var title = model.Course.Title;
              var img = common.config.CoursePath + model.Course.PicturePath;
              if (model.Status == "1" && model.ColonelOpenId == wx.getStorageSync("openid"))
              {
                wx.navigateTo({
                  url: "../../Kecheng/success/success?zhi=0&gid=" + model.Id + "&otype=" + model.Course.Type
                })
              }
              var sp = model.Course.sPrice;
              sp = sp.toFixed(2);
              var gp = model.Course.GroupPrice;
              gp = gp.toFixed(2);
              var op = model.Course.OriginalPrice;
              op = op.toFixed(2);
              var addre = model.Course.Address;
              var phon = model.Course.Phone;
              var ucount = model.ParticipateCount;
              var maxurl = model.Users.AvatarUrl;
              var st = common.timeStamp2String(model.StartTime);
              var et = common.timeStamp2String(model.EndTime);
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
              for (var j = 0; j < glist.length; j++) {
                if (glist[j].UsersOpenId == openid)
                { a = true }
              }
              var d1 = new Date();
              var d2 = new Date(et.replace(/-/g, '/'));
              wtime = (d2 - d1);
              if (wtime < 1 && status != 1) {
                status = 2;
              }
              // if (model.ColonelOpenId == openid) {
              //   status = 3;
              // }
              total_micro_second = wtime;
              count_down(that);
              //更新数据
              that.setData({
                MaxavatarUrl: maxurl,
                title: title,
                img: img,
                gprice: gp,
                oprice: op,
                sprice: sp,
                ucount: parseInt(ucount) - glist.length,
                pcount: ucount,
                gid: parseInt(gid),
                yuan: list,
                kid: kid,
                status: status,
                a: a
              })
            }
          }
        });
      }
    });
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: common.data.TitleName,
      desc: '快来帮我拼课程',
      path: '/Kecheng/friendspell/friendspell?gid=' + that.data.gid
    }
  },
  cantuan:function()
  {
    var gid = this.data.gid;
    var kid = this.data.kid;
    var co = this.data.ucount;
    wx.navigateTo({
      url: '../Ouder/Ouder?kid=' + kid + '&types=1&gid=' + gid + "&co=" + co
    });
  },
  kaituan:function()
  {
    var kid=this.data.kid;
    wx.redirectTo({
      url: '../Detail/Detail?yu=0&id='+kid
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
    total_micro_second="";
    pp="";
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  shouye:function(){
    wx.redirectTo({
      url: '../Home/Home'
    });
  } 
});
