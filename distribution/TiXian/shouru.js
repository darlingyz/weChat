// pages/shouru/shouru.js
var common = require('../../Common.js')
var LIST = []
var page = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    hidden:true,
  },
  onReachBottom: function () {

  },
  fanye: function () {
    var that = this;
    that.setData({
      hidden: false,
    })
    var openid = wx.getStorageSync("openid");
    wx.request({
      url: common.config.YongJingMinXi,
      method:'post',
      data:{
        openid: openid
      },
      success:function(res){
        console.log(res)
        var list=res.data.list
        if (list.length>0){
          for (var i = -0; i < list.length; i++) { 
            if (list[i].Remark.length > 25)
            {
              list[i].Remark = list[i].Remark.substr(0, 24) + '...';
            }
            list[i].CreateOn = common.timeStamp2String(list[i].CreateOn)
          }
        }
       
      that.setData({
          list:list
        })
      },
      fail:function(res){
        common.modalTap('网络错误')
      },
      complete:function(){
        that.setData({
          hidden: true,
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fanye()
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
    page = 0;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    page=0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})