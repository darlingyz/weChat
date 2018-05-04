// Kecheng/bargaining/bargaining.js
var app = getApp();
var common = require('../../Common.js')
let col1H = 0;
var j = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    yu: "",
    bb: "",
    haibao: "",
    gid: "",
    kid: "",
    kancount: "",
    grouplist: [],
    width: 0,
    topwidth: 0,
    guoqi: 0,
    name: "",
    phone: "",
    xprice: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.cid;
    var yu = options.yu;
    var copenid = options.copenid;
    var numbertime = options.numbertime;
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var openid = "";
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == "") {
      wx.login({
        success: function (res) {
          if (res.code) {
            //获取code
            wx.setStorageSync('Code', res.code);
              wx.getUserInfo({
                success: function (res) {
                  var s = JSON.parse(res.rawData);
                  var nickName = s.nickName;//昵称
                  var avatarUrl = s.avatarUrl;//头像
                  wx.setStorageSync("nickName", s.nickName);//昵称
                  wx.setStorageSync("avatarUrl", s.avatarUrl);//头像
                  wx.request({
                    url: common.config.GetOrSetOpenid,
                    data: {
                      code: wx.getStorageSync('Code'),
                      name: nickName,
                      img: avatarUrl,
                      mchid: common.data.MchId
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    method: 'POST',
                    success: function (res) {
                      if (res.data.result) {
                        wx.setStorageSync('openid', res.data.openid);
                        options = res.data.openid;
                        that.fangfa(nickName, id, copenid,numbertime);
                      }
                    }
                  })
                }
              })
          }
        },
        fail: function (res) { //用户无授权时
          that.setData({
            getUserInfoFail: true
          })
        }
      });
    }
    else{
      openid = wx.getStorageSync('openid');
      var name = wx.getStorageSync('nickName');
      that.fangfa(name, id, copenid, numbertime);
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
    wx.setNavigationBarTitle({ title: common.data.TitleName });
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
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  fangfa: function (name, id, copenid, numbertime){
    wx.request({
      url: common.config.KanGropOfGid,
      data: {
        openid: wx.getStorageSync('openid'),
        name: name,
        cid: id,
        copenid: copenid,
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address')
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result=="false")
        {
          common.modalTap("请重试...");
        }
        if (copenid == wx.getStorageSync('openid')) {
          wx.redirectTo({
            url: '../Twobargaining/Twobargaining?gid=' + res.data.id + "&yu=0"
          });
        }
        else {
          wx.redirectTo({
            url: '../Threebargaining/Threebargaining?gid=' + res.data.id + '&numbertime=' + numbertime + "&yu=0"
          });
        }
      }
    });
  }
})