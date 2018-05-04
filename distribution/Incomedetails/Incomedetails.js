// distribution/Incomedetails/Incomedetails.js
var common=require('../../Common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: common.config.CoursePath,
    hidden:true,
    list: [
      // {
      //   img: "../../images/juezhao_10.jpg",
      //   title: "零基础直达流利口语中级【8月通关A班】",
      //   ShouJia: "800.00",
      //   YuanJia: "1000.00",
      //   YuiGuang: "400.00"
      // },
      // {
      //   img: "../../images/juezhao_10.jpg",
      //   title: "零基础直达流利口语中级【8月通关A班】",
      //   ShouJia: "800.00",
      //   YuanJia: "1000.00",
      //   YuiGuang: "400.00"
      // }
    ],
    tutu: common.config.ImgPath +"topimg_03.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this
    that.Content()
  },
  //渲染数据
  Content:function(){
    var that=this
    that.setData({
      hidden:false
    })
    wx.request({
      url: common.config.YinShouJinE,
      method:'post',
      data:{
        openid: wx.getStorageSync("openid")
      },
      success:function(res){
        console.log(res)
        var list=res.data
        if (list.list.length>0){
          for (var i = 0; i < list.list.length; i++) {
            list.list[i].CreateOn = common.timeStamp2String(list.list[i].CreateOn)
            list.list[i].Course.RetailPrice = list.list[i].Course.RetailPrice.toFixed(2)
            list.list[i].Course.sPrice = list.list[i].Course.sPrice.toFixed(2)
            list.list[i].ZhuanPrice = list.list[i].ZhuanPrice.toFixed(2)
          }
          list.countprice = list.countprice.toFixed(2)
        }
        console.log(list)
        that.setData({
          list:list,
          Zong:list.list.length
        })
      },
      fail:function(res){
        common.modalTap('网络错误')
      },
      complete:function(){
        that.setData({
          hidden: true
        })
      }
    })
  },
  // 
  QuKanMin:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: '../DetailList/DetailList?id='+id,
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
  
  }
})