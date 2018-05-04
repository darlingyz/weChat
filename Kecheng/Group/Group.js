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
    gid:"",
    yuan:[],
    kid:""
  },
  onShareAppMessage: function () {
    var that=this;
    return {
      title: '教育吧',
      desc: '快来帮我拼课程',
      path: '/Kecheng/friendspell/friendspell?gid='+that.data.gid
    }
  },
  fan: function () {
    wx.reLaunch({
      url: '../../Kecheng/Home/Home',
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var that = this;
    var openid = wx.getStorageSync('openid');
    var title=options.title;
    var img =options.img;
    var gprice=options.gp;
    var oprice=options.op;
    var wtime=options.wtime;
    var ucount = options.ucount;
    var sp=options.sp;
    var kid = options.kid;
    clearTimeout(pp);
    var gid=0;
    var kid=0;
    var list=[];
    for(var i=0;i<parseInt(ucount)-1;i++)
    {
      var im = { im: common.config.ImgPath + "yuan.jpg"};
      list.push(im);
    }

    wx.request({
      url: common.config.GetGroupIdOfOpenId,
      data: {
        openid: openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result)
        {
          gid=res.data.id;
          kid = res.data.CourseId;
        }
      }
    });
    var gp = "";
    if (parseInt(gprice) == gprice) {
      gp = gprice + ".00";
    }
    var op = "";
    if (parseInt(oprice) == oprice) {
      op = oprice + ".00";
    }
    total_micro_second = parseInt(wtime) * 60 * 60 * 1000;
    count_down(that);
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        title:title,
        img:img,
        gprice:gp,
        oprice:op,
        sprice:sp,
        ucount: parseInt(ucount)-1,
        gid: gid,
        yuan:list,
        kid:kid
      })
    })
  },
  kecheng:function()
  {
    var that=this;
    wx.navigateTo({
      url: '../Detail/Detail?id='+that.data.kid,
    })
  },
  xiang:function()
  {
    wx.navigateTo({
      url: '../rule/rule'
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  } 
});
