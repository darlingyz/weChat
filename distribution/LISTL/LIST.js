// distribution/LIST/LIST.js
var common = require('../../Common.js')
Page({
  data: {
    pageIndex: 1,
    pageSize: 15,
    list: []
  },
  // 渲染数据
  Content: function (thisPage) {
    var brList = thisPage.data.list;
    wx.request({
      url: common.config.GetBrowsingRecordListNew,
      method: 'post',
      data: { openId: wx.getStorageSync('openid'), mchId: common.data.MchId, pageIndex: thisPage.data.pageIndex, pageSize: thisPage.data.pageSize },
      success: function (res) {
        var list = res.data.list;
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            list[i].CreateOn = common.timeStamp2String(list[i].CreateOn);
            brList.push(list[i]);
          }
        }
        thisPage.setData({
          list: brList
        })
      },
      fail: function (res) {
        common.modalTap('网络错误')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中...',
    })
    this.Content(this);
    wx.hideLoading();
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
    this.data.pageIndex = 1;
    this.data.list = [];
    this.Content(this);
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageIndex = this.data.pageIndex + 1;
    this.Content(this);
    console.log('下一页');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  kecheng: function (e) {
    var cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '../Detail/Detail?openid=' + wx.getStorageSync("openid") + '&id=' + cid,
    })
  }
})