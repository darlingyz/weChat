// distribution/LIST/LIST.js
var common=require('../../Common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
  },
// 渲染数据
Content:function(){
  var that=this
  that.setData({
    hidden: false,
  })
  wx.request({
    url: common.config.GouMaiRen,
    method:'post',
    data:{
      openid: wx.getStorageSync('openid')
    },
    success:function(res){
      console.log(res)
      that.setData({
        list:res.data.list
      })
    },
    fail:function(res){
      common.modalTap('网络错误')
    },
    complete(){
      that.setData({
        hidden: true,
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Content()
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
    wx.stopPullDownRefresh()
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
  
  }
})