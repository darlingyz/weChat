// falied.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  kid:"",
  model:[],
  ctype:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var that = this;
    var gid=options.gid;
    wx.request({
      url: common.config.GetGropuBookingOfId,
      data: {
        id: gid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          var model = res.data.model;
          var kid = model.CourseId;
          var title = model.Course.Title;
          var ctype = model.Course.Type;
          var img = common.config.CoursePath + model.Course.PicturePath;
          var sp = model.Course.sPrice;
          if (parseInt(sp) == sp) {
            sp = sp + ".00";
          }
          var gp = model.Course.GroupPrice;
          if (parseInt(gp) == gp) {
            gp = gp + ".00";
          }
          var op = model.Course.OriginalPrice;
          if (parseInt(op) == op) {
            op = op + ".00";
          }
          //更新数据
          that.setData({
            title: title,
            img: img,
            gprice: gp,
            oprice: op,
            sprice: sp,
            kid:kid,
            model:model,
            ctype: ctype
          })
        }
      }
    });
  },
  kecheng: function () {
    var that = this;
    var ctype = that.data.ctype;
    if(ctype=="1")
    {
      wx.navigateTo({
        url: '../Detail/Detail?copenid=0&id=' + that.data.kid,
      })
    }
    if (ctype == "4") {
      wx.navigateTo({
        url: '../Onebargaining/Onebargaining?yu=0&copenid=0&cid=' + that.data.kid,
      })
    }
    if (ctype == "5") {
      wx.navigateTo({
        url: '../YiYuan/YiYuan?id=' + that.data.kid + "&yu=0&copenid=0&oid=0"
      })
    }
  },
  shouye:function(){
    wx.reLaunch({
      url: '../Home/Home',
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
    wx.stopPullDownRefresh()
  } ,

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