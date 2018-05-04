var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbg:"https://1-zhao.com/HtmlImgs/yhqMobg.jpg",
    bgRed: "https://1-zhao.com/HtmlImgs/LINGQu_03.png",
    xian: common.config.ImgPath + "xian-left_03.png",
    xian2: common.config.ImgPath + "xian-right_06.png",
    backimg:"",
    jiantou: common.config.ImgPath +"JianTou_03.png",
    model:false,
    modelTwo: false,
    setmine:true,
    cid:"",
    csid: "",
    wancheng:false,
    ismycoupons:true,
    sstatus:1,
    yiling:false,
    cname:"",
    ttype:"",
    currred:""
  },
  CloseModel:function(){
    this.setData({
      model:false,
    })
  },
  CloseModelTwo: function () {
    this.setData({
      modelTwo: false,
    })
  },
  OpenModel: function () {
    var that=this;
    if (that.data.ttype=="1")
    {
      wx.request({
        url: common.config.LinCouponsSplits,
        method: 'POST',
        data: { csid: that.data.csid },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if(res.data.result)
          {
            that.setData({
              ttype:"2",
              model: true
            });
          }
        }
      });
    }
    else{
      that.setData({
        model: true,
      });
    }
  },
  OpenModelTwo: function () {
    this.setData({
      modelTwo: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var cid = "";
    var csid = "";
    var wancheng=false;
    var ismycoupons = false;
    var sstatus = 1;
    var yiling=false;
    if (options != undefined) {
      cid = options.cid;
      csid = options.csid;
    }
    else {
      cid = that.data.cid;
      csid = that.data.csid;
    }
    wx.request({
      url: common.config.GetCouponsBannerOfCid,
      method: 'POST',
      data: { cid: cid, csid: csid },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          var a = false;
          var sheng = 0;
          var list = [];
          var model = res.data.model;
          var glist = model.CouponsSplits.CouponsSplits_Users;
          var cname = model.CouponsSplits.Users.Name;
          model.StartTime = common.timeStamp2StringNian2(model.StartTime);
          model.EndTime = common.timeStamp2StringNian2(model.EndTime);
          sheng = parseInt(model.SplitsCount);
          
          if (model.CouponsSplits.Type == "1" && model.CouponsSplits.CouponsSplits_Users.length > 0)
          {
            if (model.CouponsSplits.AttendCount < model.SplitsCount)
            {
              sstatus = 2;
            }
            else if (model.CouponsSplits.AttendCount == model.SplitsCount){
              sstatus = 3;
            }
          }
          if (model.CouponsSplits.Type == "2" || model.CouponsSplits.Type == "3")
          {
            if (model.CouponsSplits.ColonelOpenId == wx.getStorageSync('openid'))
            {
              wx.redirectTo({
                url: '../../newpage/coupons/coupons'
              });
            }
            else {
              sstatus = 3;
            }
          }
          if (model.CouponsSplits.Id > 0) {
            if (model.CouponsSplits.Type == "1" && model.SplitsCount == model.CouponsSplits.AttendCount)
            {
              wancheng = true;
            }
            if (model.CouponsSplits.Type == "2") {
              yiling = true;
              wancheng = false;
            }
            sheng = parseInt(model.SplitsCount) - parseInt(model.CouponsSplits.AttendCount);
          }

          for (var i = 0; i < parseInt(model.SplitsCount); i++) {
            var im = {};
            if (glist != null && i < glist.length) {
              im = { im: glist[i].Users.AvatarUrl };
              if (glist[i].UsersOpenId == wx.getStorageSync('openid'))
              {
                if (model.CouponsSplits.AttendCount == model.SplitsCount)
                { sstatus = 4; }
                else if (model.CouponsSplits.AttendCount < model.SplitsCount)
                { sstatus = 2; }
              }
            }
            else {
              im = { im: common.config.ImgPath + "HuiHongBao_03.png" };
            }
            list.push(im);
          }
          that.setData({
            cid: cid,
            mm: model,
            sheng: sheng,
            headlist: list,
            backimg: common.config.RedBackgroundPath + model.BackgroundPath,
            csid: csid,
            copenid: model.CouponsSplits.ColonelOpenId,
            wancheng: wancheng,
            ismycoupons: model.CouponsSplits.ColonelOpenId == wx.getStorageSync('openid')?true:false,
            sstatus: sstatus,
            yiling: yiling,
            cname: cname,
            ttype: model.CouponsSplits.Type
          });

          wx.request({
            url: common.config.GetCurrOfMchId,
            data: { mchid: common.data.MchId, type: 8 },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var currred = res.data.currred;
              that.setData({
                currred: currred
              });
            }
          });

          var province = wx.getStorageSync("province");
          if (province == null || province == "") {
            common.dingwei();
          }
          wx.request({
            url: common.config.InsertColonelOpenIdShare,
            data: {
              openid: wx.getStorageSync('openid'),
              province: wx.getStorageSync('province'),
              city: wx.getStorageSync('city'),
              address: wx.getStorageSync('address'),
              type: 0,
              id: 0,
              mchid: common.data.MchId
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) { }
          });

        }
      }
    });
  },
  TextShow:function(){
    var that = this;
    that.setData({
      setmine: false,
    })
    setTimeout(function(){
      that.setData({
        setmine: true,
      })
    },2000)
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
    this.onLoad();
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
    var that=this;
    var nn = common.GetNumberTime();
    return {
      title: common.data.TitleName,
      desc: '快来帮我助力优惠券',
      path: '/newpage/WhiteenvelopeT/WhiteenvelopeT?csid=' + that.data.csid + "&copenid=" + that.data.copenid + "&cid=" + that.data.cid + '&numbertime=' + nn,
      success: function (res) {
        if (that.data.currred.Id != "0") {
          var aa = "现金";
          if (that.data.currred.RedpocketType == "1") {
            aa = "课程";
          }
          if (that.data.copenid == wx.getStorageSync('openid'))
          {
            common.modalTap("优惠券分享成功,好友打开活动后您可获得" + aa + "红包。");
          }
        }
        wx.request({
          url: common.config.InsertColonelOpenIdShare,
          data: {
            openid: wx.getStorageSync('openid'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address'),
            type: 4,
            id: that.data.csid,
            mchid: common.data.MchId,
            number: nn
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) { }
        });
      }
    }
  },
  kainew:function(e){
    var that=this;
    wx.request({
      url: common.config.InsertCouponsSplits,
      data: { cid: that.data.cid, openid: wx.getStorageSync('openid') },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.redirectTo({
          url: '../envelopeT/envelopeT?csid=' + res.data.csid + '&cid=' + that.data.cid,
        });
      }
    });
  },
  shiyong:function(e){
    var that=this;
    wx.navigateTo({
      url: '../courses/courses?csid=' + that.data.csid + "&price=" + that.data.mm.Price
    });
  },
  chakan:function(e){
    var that = this;
    wx.navigateTo({
      url: '../courses/courses?csid=0&price=0'
    });
  }
})