// newpage/envelope/envelope.js
var common = require('../../Common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbg: wx.getStorageSync('avatarUrl'),
    bgRed: common.config.ImgPath +"RedBg_03.png",
    backimg: "",
    model:false,
    modelTwo: true,
    setmine:true,
    xian: common.config.ImgPath+"xian-left_03.png",
    mm:{},
    sheng:0,
    headlist:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var cid = options.cid;
    var csid= options.csid;
    var copenid =options.copenid;
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
                      openid = res.data.openid;
                      wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                          //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                          demo.reverseGeocoder({
                            location: {
                              latitude: res.latitude,
                              longitude: res.longitude
                            },
                            success: function (addressRes) {
                              var sheng = addressRes.result.address_component.province;
                              var shi = addressRes.result.address_component.city;
                              var address = addressRes.result.address;
                              wx.setStorageSync("province", sheng);//省缓存
                              wx.setStorageSync("city", shi);//市缓存
                              wx.setStorageSync("address", address);//地址缓存
                            }
                          })
                        }
                      })
                      that.fangfa(openid, csid, copenid, cid, numbertime);
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
    else {
      openid = wx.getStorageSync('openid');
      if(openid==copenid)
      {
        wx.redirectTo({
          url: '../envelopeT/envelopeT?csid=' + csid+ '&cid=' + cid,
        });
      }
      else{
        that.fangfa(openid, csid, copenid, cid, numbertime);
      }
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
  fangfa: function (openid, csid, copenid, cid, numbertime) {
    wx.request({
      url: common.config.InsertCoupSplitsUsers,
      data: {
        openid: openid,
        csid: csid,
        copenid: copenid,
        mchid: common.data.MchId,
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address'),
        number: numbertime
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var types = res.data.types;
        wx.redirectTo({
          url: '../envelopeT/envelopeT?csid=' + csid + '&cid=' + cid,
        });
      }
    });
  }
})