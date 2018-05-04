// newpage/model/model.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card:"",
    ling:"",
    title:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var card=options.card;
    var ling = options.ling;
    var title = options.title;
    this.setData({
      card: common.config.CourseCard + card,
      ling: ling,
      title: title
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
    return {
      title: common.data.TitleName,
      desc: that.data.title,
      path: '/newpage/customer/customer?id=' + that.data.cid + "&copenid=" + wx.getStorageSync('openid')
    }
  },
  baocun: function () {
    var that = this;
    wx.getImageInfo({
      src: that.data.card,
      success: function (res) {
        var path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            common.DoSuccess('课程卡保存成功');
            if (that.data.ling=="1")
            {
              wx.redirectTo({
                url: '../../Kecheng/Home/Home'
              });
            }
          }
        })
      }
    });
  }
})