// Ouder.js
var common = require('../../Common.js')
var zhidian = "true";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kid: 0,
    img: "",
    title: "",
    gprice: "",
    oprice: "",
    rprice: "",
    types: "",
    wtime: 0,
    ucount: 0,
    op: "",
    gp: "",
    gid: "0",
    co: "",
    sp: "",
    jp: "",
    name: "",
    pphone: "",
    coursetype: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    var kid = options.kid;
    var title = options.title;
    var img = options.img;
    var op = options.op;
    var jp = options.jp;
    var types = options.types;

    wx.request({
      url: common.config.GetNameAndPhoneOfOpenId,
      data: { openid: openid },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          var name = res.data.name;
          var phone = res.data.phone;
          if (phone == "0") {
            phone = "";
          }
        }
        if (title.length > 20) {
          title = title.substr(0, 19) + '...';
        }
        that.setData({
          title: title,
          kid: kid,
          img: common.config.CoursePath + img,
          op: op,
          gp: (op - jp).toFixed(2),
          jp: jp,
          name: name,
          pphone: phone
        })
      }
    });
  },

  formSubmit: function (e) {
    wx.setStorageSync("formId", e.detail.formId);
    var that = this;
    if (zhidian == "false") {
      return;
    }
    if (e.detail.value.Name == "") {
      common.modalTap("请填写姓名");
      return
    }
    if (!(/^1[34578]\d{9}$/.test(e.detail.value.Phone))) {
      common.modalTap("请填写正确的手机号");
      return
    }
    if (e.detail.value.Remark.length > 30) {
      common.modalTap("请输入少于30字的备注");
      return
    } else {
      zhidian = "false";
      var openid = wx.getStorageSync('openid');
      var name = e.detail.value.Name;
      var phone = e.detail.value.Phone;
      var age = e.detail.value.Age;
      var remark = e.detail.value.Remark;
      var guid = "";
      var packageid = "";
      wx.login({
        success: function (res) {
          if (res.code) {
            //开团订单
            wx.request({
              url: common.config.pay,
              data: {
                openid: openid,
                cid: that.data.kid,
                grouptype: "0",
                name: name,
                phone: phone,
                price: that.data.jp,
                age: age,
                remark: remark
              },
              method: 'GET',
              success: function (res) {
                if (res.data.zhuagntai)
                {
                  // 领取成功
                  wx.redirectTo({
                    url: "../Shisuccess/Shisuccess?gid=0&zhi=1"
                  })
                }
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
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
    zhidian = "true";
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  kecheng: function (e) {
    var id = this.data.kid;
    wx.navigateTo({
      url: '../ShiTing/ShiTing?yu=0&id=' + id,
    });
  }
})