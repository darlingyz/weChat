// newpage/MyBao/MyBao.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      // {
      //   img: common.config.ImgPath + "boliang_07.png",
      //   yao: true,
      //   rema: false,
      //   ShiXiao: true,
      // },
      // {
      //   img: common.config.ImgPath +"boliang_07.png",
      //   imgAll: common.config.ImgPath +"yiguoQi_03.png",
      //   huise: "huise",
      //   yao: true,
      //   rema: true,
      //   ShiXiao: false,
      // },
      // {
      //   img: common.config.ImgPath +"boliang_07.png",
      //   imgAll: common.config.ImgPath +"yishiyong_03.png",
      //   huise:"huise",
      //   yao: true,
      //   rema: true,
      //   ShiXiao: false,
      // }
    ],
    yl: common.config.ImgPath + "yilinga_03.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var ll=[];
    wx.request({
      url: common.config.GetMyCoupList,
      method: 'POST',
      data: { openid: wx.getStorageSync("openid")},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var list=res.data.list;
        for (var i = 0; i < list.length; i++)
        {
          var mm={};
          var st = common.timeStamp2StringNian2(list[i].Coupons.StartTime);
          var et = common.timeStamp2StringNian2(list[i].EndTime);
          var coid = list[i].CouponsOrderId;
          var ttype = list[i].Type;
          if (coid == "0" && ttype == "2")//已领取,未使用
          {
            mm = {
              img: common.config.ImgPath + "boliang_07.png",
              price: list[i].Price,
              title: list[i].Coupons.Title,
              csid: list[i].Id,
              status:0,
              st:st,
              et:et,
              yao: true,
              rema: false,
              ShiXiao: true,
            };
          }
          if (coid != "0" && ttype == "2")//已领取,已使用
          {
            mm = {
              img: common.config.ImgPath + "boliang_07.png",
              imgAll: common.config.ImgPath + "yishiyong_03.png",
              huise: "huise",
              price: list[i].Price,
              title: list[i].Coupons.Title,
              csid: list[i].Id,
              status: 1,
              st: st,
              et: et,
              yao: true,
              rema: true,
              ShiXiao: false,
            }
          }
          if(ttype=="3")//已领取,已过期
          {
            mm = {
              img: common.config.ImgPath + "boliang_07.png",
              imgAll: common.config.ImgPath + "yiguoQi_03.png",
              huise: "huise",
              price: list[i].Price,
              title: list[i].Coupons.Title,
              csid: list[i].Id,
              status: 2,
              st: st,
              et: et,
              yao: true,
              rema: true,
              ShiXiao: false,
            }
          }
          ll.push(mm);
        }
        that.setData({
          list:ll
        })
      }
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
    this.onLoad();
    wx.stopPullDownRefresh();
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
  shiyong:function(e){
    var csid = e.currentTarget.dataset.csid;
    var price = e.currentTarget.dataset.price;
    var status = e.currentTarget.dataset.status;
    if (status=="0")
    {
      wx.redirectTo({
        url: '../courses/courses?csid='+csid +"&price="+price
      });
    }
    // else{
    //   wx.redirectTo({
    //     url: '../courses/courses?csid=0&price=0'
    //   });
    // }
  }
})