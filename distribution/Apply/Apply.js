// distribution/Apply/Apply.js
var dianji="true";
var common=require('../../Common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fenxiao: common.config.ImgPath +"fenxiao_02.jpg",
    yuanfen: common.config.ImgPath +"yuanfen_05.jpg",
    kafen: common.config.ImgPath +"kafen_08.jpg",
    hidden:true,
    ISshen:true,//是否是申请中
    nn:"",
    pp:"",
    neng:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ApplyStyle()
  },
  // 表单提交
  formSubmit: function (e) {
    var that=this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var reg = /^1[3|5|7|8][0-9]{9}$/; //验证规则
    if (dianji=="false") {
      return;
    }
    if (!reg.test(e.detail.value.phone)) {
      common.modalTap('请输入正确的联系方式');
      return false;
    }
    if (e.detail.value.name==""){
      common.modalTap('请填写姓名');
      return false;
    }
    if (e.detail.value.name != "" && reg.test(e.detail.value.phone)){
      console.log('success')
      dianji="false";
      var name = e.detail.value.name;
      var phone = e.detail.value.phone
      that.Sumbit(name, phone)
    }
  },
  // 申请提交状态
  ApplyStyle:function(){
    var that=this
    wx.request({
      url: common.config.ApplyStyle,
      method: 'post',
      data:{
        openid: wx.getStorageSync("openid"),
      },
      success:function(res){
        console.log(res)
        if (res.data.model.Type==0){
          that.setData({
            ISshen:true
          })
        }
        else if (res.data.model.Type == 2) {
          that.setData({
            ISshen: false,
            nn: res.data.model.Name,
            pp: res.data.model.Phone,
            neng:true
          })
        }
      },
    })
  },
  // 提交申请
  Sumbit:function(name,phone){
    var that=this
    that.setData({
      hidden: false,
    })
    var data = {
      openid: wx.getStorageSync("openid"),
      name: name,
      phone: phone,
      mchid: common.data.MchId
    }
    console.log(data)
    wx.request({
      url: common.config.ApplyJingXiaoShang,
      method:'post',
      data: data,
      success:function(res){
        console.log(res)
        if(res.data.result){
          common.DoSuccess(res.data.msg)
          that.setData({
            ISshen: false,
            neng:true,
          })
        }
        else{
          dianji = "true";
        }
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