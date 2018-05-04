// newpage/envelope/envelope.js
var common = require('../../Common.js');
/**
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second;
var pp;
clearTimeout(pp);

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
  return  hx + ":" + min + ":" + sec + "后结束";
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
    imgbg: common.config.ImgPath + "HuiHongBao_03.png",
    bgRed: common.config.ImgPath +"RedBg_03.png",
    backimg: "",
    model:false,
    modelTwo: true,
    setmine:true,
    xian: common.config.ImgPath+"xian-left_03.png",
    xian2: common.config.ImgPath +"xian-right_06.png",
    mm:{},
    sheng:0,
    headlist:[],
    esid:0,
    rid:0,
    tan:0,
    copenid:""
  },
  CloseModel:function(){
    this.setData({
      model:true,
    })
  },
  CloseModelTwo: function () {
    this.setData({
      modelTwo: true,
    })
  },
  OpenModel: function () {
    this.setData({
      model: true,
    })
  },
  OpenModelTwo: function () {
    this.setData({
      modelTwo: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    clearTimeout(pp);
    var that=this;
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var st= options.st;
    var et = options.et;
    var count = options.count;
    var wt = options.wt;
    var price = options.price;
    var bcolor = options.bcolor;
    var backimg = options.backimg;
    var list = [];

    for (var i = 0; i < parseInt(count) - 1; i++) {
      var im = { im: common.config.ImgPath + "HuiHongBao_03.png" };
      list.push(im);
    }


    total_micro_second = parseInt(wt) * 60 * 60 * 1000;
    count_down(that);

    that.setData({
      st:st,
      et:et,
      wt:wt,
      sheng:parseInt(count)-1,
      price:price,
      bcolor: bcolor,
      backimg: common.config.RedBackgroundPath + backimg,
      headlist: list
    });
  },
  TextShow:function(){
    var that = this;
    that.setData({
      setmine: false,
    })
    setTimeout(function(){
      that.setData({
        setmine: true,
      })
    },2000)
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  kecheng: function () {
    wx.navigateTo({
      url: '../redCourse/redCourse',
    })
  }
})