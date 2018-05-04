// newpage/Aready/Aready.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    im:'"https://1-zhao.com/HtmlImgs/envelope_02.jpg',
    imgbg: "https://1-zhao.com/HtmlImgs/envelope_02.jpg",
    bgRed: "https://1-zhao.com/HtmlImgs/RedBg_03.png",
    bgRed: "https://1-zhao.com/HtmlImgs/RedBg_03.png",
    imgbg: "",
    backimg: "",
    modelTwo: true,
    setmine: true,
    xian: common.config.ImgPath + "xian-left_03.png",
    xian2: common.config.ImgPath + "xian-right_06.png",
    huang: common.config.ImgPath + "jiaoQi_03.png",
    mm: {},
    headlist: [],
    price:"",
    myprice:"",
    wanbi:false,
    imgHeight:0,
    dian:"1"
  },
  OpenModelTwo: function () {
    this.setData({
      modelTwo: false,
    })
  },
  CloseModelTwo: function () {
    this.setData({
      modelTwo: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let imgHeight = res.windowHeight;
        that.setData({
          ww: ww,
          imgHeight: imgHeight
        });
      }
    });
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var wanbi=false;
    var hh=45;
    var esid = options.esid;
    var dian=1;
    if (options.dian=="0")
    {
      dian=0;
    }
    wx.request({
      url: common.config.GetRedBannerOfEsid,
      method: 'POST',
      data: { esid: esid },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          var a = false;
          var list = [];
          var model = res.data.model;
          var glist = model.EnvelopeSplits.EnvelopeSplits_Users;
          model.StartTime = common.timeStamp2StringNian2(model.StartTime);
          model.EndTime = common.timeStamp2StringNian2(model.EndTime);
          var pp = glist[0].Price;
          var ppid = glist[0].UsersOpenId
          var myprice = "";
          list.push({ im: glist[0].Users.AvatarUrl, name: glist[0].Users.Name, pric: glist[0].Price, openid: glist[0].UsersOpenId, huang: true})
          for (var i = 0; i < parseInt(glist.length) - 1; i++) {
            var im = { im: glist[i + 1].Users.AvatarUrl, name: glist[i + 1].Users.Name, pric: glist[i + 1].Price, openid: glist[i + 1].UsersOpenId, huang:true};
            if (pp < glist[i + 1].Price)
            {
              pp = glist[i + 1].Price;
              ppid = glist[i + 1].UsersOpenId;
            }
            list.push(im);
          }
          for (var i = 0; i < list.length; i++) 
          {
            if (list[i].openid == wx.getStorageSync("openid"))
            {
              myprice = list[i].pric;
              wanbi=true;
              hh=0;
            }
            if (list[i].openid == ppid)
            {
              list[i].huang=false;
            }
          }
          //var aa = chai == 0 ? false : true;
          that.setData({
            model: a,
            mm: model,
            headlist: list,
            backimg: common.config.RedBackgroundPath + model.BackgroundPath,
            imgbg: glist[0].Users.AvatarUrl,
            price: pp,
            ppid:ppid,
            myprice: myprice,
            wanbi: wanbi,
            imgHeight: that.data.imgHeight + (90 * list.length) + hh,
            dian:dian
          })
        }
      }
    });
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
  
  },
  kecheng:function () {
    wx.redirectTo({
      url: '../redCourse/redCourse',
    })
  },
  zaichai:function(){
    debugger;
    var that = this;
    wx.request({
      url: common.config.InsertEnvelopeSplits,
      data: { rid: that.data.mm.Id, openid: wx.getStorageSync('openid') },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.redirectTo({
          url: '../envelope/envelope?tan='+res.data.tan+'&esid=' + res.data.esid + '&rid=' + that.data.mm.Id
        });
      }
    });
  }
})