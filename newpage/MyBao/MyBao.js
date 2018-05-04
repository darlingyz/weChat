// newpage/MyBao/MyBao.js
var common = require('../../Common.js');
Page({
  data: {
    daichai: common.config.ImgPath + "cia_07.png",
    yichai: common.config.ImgPath + "overred_03.png",
    shibai: common.config.ImgPath + "huihong_03.png",
    xiantiao: common.config.ImgPath + "boliang_07.png",
    jiao: common.config.ImgPath + "jiantou-red_06.png",
    shixiao: common.config.ImgPath + "shixiao_14.png",
    redPockets: [],
    redTotal: '0.00',
    pageIndex: 1,
    pageSize: 10
  },
  onLoad: function (options) {
    var openId = wx.getStorageSync('openid');
    if (openId == null || openId == '') {
      common.GetOpenId();
    }
    this.getMyRedPockets(this, openId);
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
    this.data.pageIndex=1;
    this.data.redPockets=[];
    var openid = wx.getStorageSync('openid');
    this.getMyRedPockets(this, openid);
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    this.data.pageIndex = this.data.pageIndex + 1;
    var openid = wx.getStorageSync('openid');
    this.getMyRedPockets(this, openid);
  },
  onShareAppMessage: function () {
  },
  //获取我的红包列表
  getMyRedPockets: function (thisPage, openId) {
    var redPockets = thisPage.data.redPockets;
    wx.request({
      url: common.config.GetMyRedPockets,
      method: 'POST',
      data: { openId: openId, mchId: common.data.MchId, pageIndex: thisPage.data.pageIndex, pageSize: thisPage.data.pageSize },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var list = res.data.list;
        var redcount = res.data.redcount;
        for (var i = 0; i < list.length; i++) {
          var mm = {};
          var cha = parseInt(list[i].ParticipateCount) - parseInt(list[i].AttendCount);
          var name = list[i].ColonelOpenId == openId ? "我" : list[i].Users.Name;
          var shibai = list[i].ColonelOpenId == openId ? "您发起的" : "";
          if (list[i].Type == "1")//进行中
          {
            mm =
              {
                rid: list[i].RedEnvelopeId,
                esid: list[i].Id,
                types: list[i].Type,
                baoimg: common.config.ImgPath + "cia_07.png",
                rem: name + "发起的红包",
                jiren: "还差" + cha + "人即可瓜分红包",
                myprice: list[i].MyPrice,
                copenid: list[i].ColonelOpenId,
                yao: false,
                rema: true,
                ZuiJia: true,
                ShiXiao: true,
              };
          }
          else if (list[i].Type == "2")//拆包成功
          {
            mm =
              {
                rid: list[i].RedEnvelopeId,
                esid: list[i].Id,
                types: list[i].Type,
                baoimg: common.config.ImgPath + "overred_03.png",
                rem: name + "发起的红包",
                jiren: "恭喜您，红包已瓜分",
                myprice: list[i].MyPrice,
                copenid: list[i].ColonelOpenId,
                yao: true,
                rema: false,
                ZuiJia: !list[i].MaxPrice,
                ShiXiao: true,
              }
          }
          else if (list[i].Type == "3")//拆包失败
          {
            mm =
              {
                rid: list[i].RedEnvelopeId,
                esid: list[i].Id,
                types: list[i].Type,
                baoimg: common.config.ImgPath + "huihong_03.png",
                rem: name + "发起的红包",
                jiren: shibai + "拆红包未组满.无红包奖励",
                myprice: list[i].MyPrice,
                copenid: list[i].ColonelOpenId,
                yao: true,
                rema: true,
                ZuiJia: true,
                ShiXiao: false,
              }
          }
          else if (list[i].Type == "4")//课程分享红包
          {
            mm =
              {
                rid: list[i].RedEnvelopeId,
                esid: list[i].Id,
                types: list[i].Type,
                baoimg: common.config.ImgPath + "overred_03.png",
                rem: "课程分享红包",
                jiren: "恭喜您，已获得红包",
                myprice: list[i].MyPrice,
                copenid: list[i].ColonelOpenId,
                yao: true,
                rema: false,
                ZuiJia: true,
                ShiXiao: true,
              }
          }
          redPockets.push(mm);
        }
        thisPage.setData({
          redPockets: redPockets,
          redTotal: redcount.toFixed(2)
        })
      },
      fail: function () {
        console.log('请求数据失败！');
      }
    });
  },

  kecheng: function () {
    wx.navigateTo({
      url: '../redCourse/redCourse',
    })
  },
  xiangxi: function (e) {
    var esid = e.currentTarget.dataset.esid;
    var types = e.currentTarget.dataset.types;
    var copenid = e.currentTarget.dataset.copenid;
    var rid = e.currentTarget.dataset.rid;
    if (types == "1") {
      if (copenid == wx.getStorageSync('openid')) {
        wx.navigateTo({
          url: '../../newpage/envelope/envelope?tan=0&esid=' + esid + '&rid=' + rid,
        });
      }
      else {
        wx.navigateTo({
          url: '../Twoenvelope/Twoenvelope?esid=' + esid + "&chai=0"
        });
      }
    }
    else if (types == "2") {
      wx.navigateTo({
        url: '../Aready/Aready?dian=0&esid=' + esid
      });
    }
    else if (types == "3") {
      wx.navigateTo({
        url: '../Twoenvelope/Twoenvelope?esid=' + esid + "&chai=1"
      });
    }
  }
})