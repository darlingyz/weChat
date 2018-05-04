// distribution/disCourse/disCourse.js
var common=require('../../Common.js')
var ID;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:common.config.CoursePath,
    mony:100.00,
    
    lines:15200.00,
    num:1,
    sum:100,
    hidden: true,
    list:[
      
    ]
  },
// 渲染数据
Content:function(){
  var that=this
  that.setData({
    hidden: false,
  })
  wx.request({
    url: common.config.Distributionofcourse,
    method:'post',
    data:{
      openid: wx.getStorageSync("openid"),
    },
    success:function(res){
      console.log(res)
      var list = res.data.model
      if (list.length>0){
        for(var i=0;i<list.length;i++){
          list[i].zhuanPrice = list[i].zhuanPrice.toFixed(2)
          list[i].Price = list[i].Price.toFixed(2)
          list[i].RetailPrice = list[i].RetailPrice.toFixed(2)
          list[i].Course.OriginalPrice = list[i].Course.OriginalPrice.toFixed(2)
        }
      }
      that.setData({
        mony: res.data.yongjin.toFixed(2),
        lines: res.data.zonge.toFixed(2),
        num: res.data.goumai, 
        sum: res.data.liulan,
        list: list
      })
    },
    fail:function(res){
      common.modalTap('网络错误')
    },
    complete:function(){
      that.setData({
        hidden: true,
      })
    }
  })
},
//分享

  onShareAppMessage: function (res) {
    var dix = res.target.dataset.id;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: "教育吧",
      path: '/distribution/Detail/Detail?openid=' + wx.getStorageSync("openid") + '&id=' + dix,
      success: function (res) {
        // 转发成功
        console.log(ID)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 佣金明细
  YongJing:function(){
    wx.navigateTo({
      url: '../TiXian/shouru',
    })
  },
  // 看详情
  XIangQing:function(e){
    var dix = e.currentTarget.dataset.id;
    var id = e.currentTarget.dataset.lid;
   wx.navigateTo({
     url: '../Detail/Detail?id=' + dix + '&lid=' + id,
   })
  },
  // 营业而详情
  YinYeE:function(){
    var that=this
   wx.navigateTo({
     url: '../Incomedetails/Incomedetails',
   })
  },
  // 购买人数
  GouRenR:function(){
    var that = this
    wx.navigateTo({
      url: '../LIST/LIST',
    })
  },
  // 浏览人数
  LiuLan: function () {
    var that = this
    wx.navigateTo({
      url: '../LISTL/LIST',
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
    this.Content();
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
    this.Content();
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

})