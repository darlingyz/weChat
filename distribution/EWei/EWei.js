// distribution/EWei/EWei.js
var common=require('../../Common.js')
var all;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: common.config.disQRFile,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    all = options
    var that=this
  this.setData({
    img: that.data.url+options.id
  })
  },
 FangDa:function(){
   var that=this
   wx.previewImage({
     current: that.data.url + all.id, // 当前显示图片的http链接
     urls: [that.data.url + all.id] // 需要预览的图片http链接列表
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