// distribution/DetailList/DetailList.js
var common=require('../../Common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true,
    url: common.config.CoursePath,
    list: [
      // {
      //   img: "../../images/juezhao_10.jpg",
      //   title: "零基础直达流利口语中级【8月通关A班】",
      //   ShouJia: "800.00",
      //   YuanJia: "1000.00",
      //   YuiGuang: "400.00"
      // }
    ],
    shouji: common.config.ImgPath +"phone_03.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Content(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
// 渲染数据
Content:function(id){
  var that=this
  that.setData({
    hidden:false,
  })
  wx.request({
    url: common.config.revenuelist,
    method:'post',
    data:{
      oid:id
    },
    success:function(res){
      console.log(res)
      var list=res.data.model
      list.CreateOn = common.timeStamp2String(list.CreateOn)
      list.Price = list.Price.toFixed(2)
      list.Course.OriginalPrice = list.Course.OriginalPrice.toFixed(2)
      list.ZhuanPrice = list.ZhuanPrice.toFixed(2)
      that.setData({
        list: list
      })
    },
    fail:function(res){},
    complete:function(){
      that.setData({
        hidden: true,
      })
    }
  })
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
  
  },
  kecheng:function(){
    var that=this;
    wx.navigateTo({
      url: '../Detail/Detail?openid=' + wx.getStorageSync("openid")+'&id='+that.data.list.CourseId,
    })
  },
  boda:function(){
    var that=this;
    var pp = this.data.list.Phone;
    wx.showModal({
      title: '确认呼叫',
      confirmText: '呼叫',
      content: pp,
      success: function (sm) {
        if (sm.confirm) {
          wx.makePhoneCall({
            phoneNumber: pp
          })
        }
      }
    });
  }
})