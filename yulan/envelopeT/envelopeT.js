var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbg:"https://1-zhao.com/HtmlImgs/yhqMobg.jpg",
    bgRed: "https://1-zhao.com/HtmlImgs/LINGQu_03.png",
    xian: common.config.ImgPath + "xian-left_03.png",
    xian2: common.config.ImgPath + "xian-right_06.png",
    backimg:"",
    jiantou: common.config.ImgPath +"JianTou_03.png",
    model:false,
    modelTwo: false,
    setmine:true,
    cid:"",
    csid: "",
    wancheng:false,
    ismycoupons:true,
    sstatus:1,
    yiling:false,
    cname:"",
    ttype:""
  },
  CloseModel:function(){
    this.setData({
      model:false,
    })
  },
  CloseModelTwo: function () {
    this.setData({
      modelTwo: false,
    })
  },
  OpenModel: function () {
    var that=this;
    if (that.data.ttype=="1")
    {
      wx.request({
        url: common.config.LinCouponsSplits,
        method: 'POST',
        data: { csid: that.data.csid },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if(res.data.result)
          {
            that.setData({
              ttype:"2",
              model: true
            });
          }
        }
      });
    }
    else{
      that.setData({
        model: true,
      });
    }
  },
  OpenModelTwo: function () {
    this.setData({
      modelTwo: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    var st = options.st;
    var et = options.et;
    var price= options.price;
    var count= options.count;

    var list = [];

    for (var i = 0; i < parseInt(count); i++) {
      var im = { im: common.config.ImgPath + "HuiHongBao_03.png" };
      list.push(im);
    }

    that.setData({
      st:st,
      et:et,
      price: price,
      sheng: count,
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
  kainew:function(e){
    var that=this;
    wx.request({
      url: common.config.InsertCouponsSplits,
      data: { cid: that.data.cid, openid: wx.getStorageSync('openid') },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.redirectTo({
          url: '../envelopeT/envelopeT?csid=' + res.data.csid + '&cid=' + that.data.cid,
        });
      }
    });
  },
  shiyong:function(e){
    var that=this;
    wx.navigateTo({
      url: '../courses/courses?csid=' + that.data.csid + "&price=" + that.data.mm.Price
    });
  },
  chakan:function(e){
    var that = this;
    wx.navigateTo({
      url: '../courses/courses?csid=0&price=0'
    });
  }
})