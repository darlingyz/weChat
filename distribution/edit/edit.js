// distribution/edit/edit.js
var common=require('../../Common.js')
var all;
Page({

  /**
   * 页面的初始数据
   */
  data: {
        hidden:true,
        url: common.config.CoursePath,
        img: "../../images/juezhao_10.jpg",
        title: "零基础直达流利口语中级【8月通关A班】",
        DaiLi: "600.00",
        YuanJia: "1000.00",
        JianYi: "1000.00",
        ShouJia:'1000.00',
        YongJin:'400.00'
  },
  changeTwoDecimal_f:function (x) {
    var f_x = parseFloat(x);
    if(isNaN(f_x)) {

      return false;
    }
  var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if(pos_decimal < 0) {
      pos_decimal = s_x.length;
      s_x += '.';
    }
  while (s_x.length <= pos_decimal + 2) {
      s_x += '0';
    }
  return s_x;
  },
  // 获取输入值 输入时触发
  ShuRu: function (e) {
    console.log(e)
    var value = e.detail.value
      var that=this
      that.setData({
        ShouJia: value,
        SHouJIa: that.changeTwoDecimal_f(value - that.data.DaiLi),
      })
  },
  //渲染数据
  Content:function(id){
    var that=this
    that.setData({
      hidden: false,
    })
    wx.request({
      url: common.config.editAll,
      method:'post',
      data:{
        id:id
      },
      success:function(res){
        console.log(res)
        var list=res.data
        list.model.Course.OriginalPrice = that.changeTwoDecimal_f(list.model.Course.OriginalPrice)
        list.model.Course.RetailPrice = that.changeTwoDecimal_f(Number(list.model.Course.RetailPrice))
        that.setData({
          list: list,
          count: res.data.count,
          ShouJia: Number(that.changeTwoDecimal_f(list.model.Price)),
          DaiLi: Number(that.changeTwoDecimal_f((list.model.Course.OriginalPrice * list.model.zhekou))),
          SHouJIa: that.changeTwoDecimal_f(Number(that.changeTwoDecimal_f(list.model.Price)) - Number(that.changeTwoDecimal_f((list.model.Course.OriginalPrice * list.model.zhekou))))
        })
        console.log(that.changeTwoDecimal_f(that.data.SHouJIa))
      },
      fail:function(res){},
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
    
    all = options
  },
// 保存
  BaoCun:function(){
    var that=this
    if ((that.data.ShouJia - that.data.DaiLi)<0){
      common.modalTap('售价不能小于代理价')
    }else{
      that.setData({
        hidden: false
      })
      wx.request({
        url: common.config.editpreservation,
        method: "post",
        data: {
          id: all.id,
          price: that.data.ShouJia
        },
        success: function (res) { 
          console.log(res)
          if(res.data.result){
            common.DoSuccess(res.data.msg);
            wx.navigateBack({
              delta:1
            });
          }else{
            common.modalTap(res.data.msg)
          }
        },
        fail: function (res) { 
          common.modalTap('网络错误')
        },
        complete: function () {
          that.setData({
            hidden: true
          })
        },
      })
    }
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
    this.Content(all.id)
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