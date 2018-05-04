// newpage/answer/answer.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid:"",
    tutu: common.config.ImgPath+"fail_03.jpg",
    currred:"",
    numbertime:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }
    var cid = options.id;
    this.setData({
      cid:cid
    });

    wx.request({
      url: common.config.GetCurrOfMchId,
      data: { mchid: common.data.MchId, type: 6 },
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var nn = common.GetNumberTime();
    return {
      title: common.data.TitleName,
      desc: that.data.title,
      path: '/newpage/customer/customer?id=' + that.data.cid + '&copenid=' + wx.getStorageSync('openid') + '&numbertime=' + nn,
      success: function (res) {
        if (that.data.currred.Id != "0") {
          var aa = "现金";
          if (that.data.currred.RedpocketType == "1") {
            aa = "课程";
          }
          common.modalTap("课程分享成功,好友打开课程后您课获得" + aa + "红包。");
        }
        wx.request({
          url: common.config.InsertColonelOpenIdShare,
          data: {
            openid: wx.getStorageSync('openid'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address'),
            type: 1,
            id: that.data.cid,
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
  fan:function(){
    // wx.reLaunch({
    //   url: '../../Kecheng/Home/Home',
    // })
    wx.navigateBack({
      delta:1
    });
  }
})