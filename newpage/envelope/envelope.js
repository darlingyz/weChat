// newpage/envelope/envelope.js
var common = require('../../Common.js');
/**
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second;
var pp;
clearTimeout(pp);

/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    // timeout则跳出递归
    return;
  }
  pp = setTimeout(function () {
    // 放在最后--
    total_micro_second -= 1000;
    count_down(that);
  }, 1000)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  var hx = fill_zero_prefix(Math.floor(second / 3600 % 24))
  //天
  var day = fill_zero_prefix(Math.floor(hr / 24));
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  //   var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return  hx + ":" + min + ":" + sec + "后结束";
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbg: wx.getStorageSync('avatarUrl'),
    bgRed: common.config.ImgPath +"RedBg_03.png",
    backimg: "",
    model:true,
    modelTwo: true,
    setmine:true,
    xian: common.config.ImgPath+"xian-left_03.png",
    xian2: common.config.ImgPath +"xian-right_06.png",
    mm:{},
    sheng:0,
    headlist:[],
    esid:0,
    rid:0,
    tan:0,
    copenid:"",
    currred:""
  },
  CloseModel:function(){
    this.setData({
      model:true,
    })
  },
  CloseModelTwo: function () {
    this.setData({
      modelTwo: true,
    })
  },
  OpenModel: function () {
    this.setData({
      model: true,
    })
  },
  OpenModelTwo: function () {
    this.setData({
      modelTwo: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    clearTimeout(pp);
    var that=this;
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var rid=0;
    var esid=0;
    var tan=0;
    if (options != undefined)
    {
      rid = options.rid;
      esid = options.esid;
      tan = options.tan;
    }
    else{
      rid = that.data.rid;
      esid = that.data.esid;
      tan = that.data.tan;
    }
    wx.request({
      url: common.config.GetRedBannerOfRid,
      method: 'POST',
      data: { rid: rid, esid: esid },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.result)
        {
          var a=false;
          var sheng=0;
          var list=[];
          var model = res.data.model;
          var glist = model.EnvelopeSplits.EnvelopeSplits_Users;
          model.StartTime = common.timeStamp2StringNian2(model.StartTime);
          model.EndTime = common.timeStamp2StringNian2(model.EndTime);
          sheng = parseInt(model.SplitsCount)-1;
          if (model.EnvelopeSplits.Id>0)
          {
            if (model.EnvelopeSplits.Type == "2") {
              wx.redirectTo({
                url: '../Aready/Aready?esid=' + model.EnvelopeSplits.Id
              });
            }

            a = tan == "0" ? true : false;
            sheng = parseInt(model.SplitsCount) - parseInt(model.EnvelopeSplits.AttendCount);

            var et = common.timeStamp2String(model.EnvelopeSplits.EndTime);
            var d1 = new Date();
            var d2 = new Date(et.replace(/-/g, '/'));
            var wtime = (d2 - d1);
            total_micro_second = wtime;
            count_down(that);
          }

          for (var i = 0; i < parseInt(model.SplitsCount) - 1; i++) {
            var im = {};
            if (glist!=null && i + 1 < glist.length) {
              im = { im: glist[i + 1].Users.AvatarUrl };
            }
            else {
              im = { im: common.config.ImgPath + "HuiHongBao_03.png" };
            }
            list.push(im);
          }
          that.setData({
            rid:rid,
            model:a,
            mm:model,
            sheng: sheng,
            headlist:list,
            backimg: common.config.RedBackgroundPath + model.BackgroundPath,
            esid: esid,
            tan:tan,
            copenid: model.EnvelopeSplits.ColonelOpenId
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
    clearTimeout(pp);
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
    var that = this;
    var nn = common.GetNumberTime();
    return {
      title: common.data.TitleName,
      desc: '快来瓜分红包',
      path: '/newpage/Whiteenvelope/Whiteenvelope?esid=' + that.data.esid + "&copenid=" + that.data.copenid + '&numbertime=' + nn,
      success:function(res){
        if (that.data.currred.Id != "0") {
          var aa = "现金";
          if (that.data.currred.RedpocketType == "1") {
            aa = "课程";
          }
          common.modalTap("红包分享成功,好友打开活动后您可获得" + aa + "红包。");
        }
        wx.request({
          url: common.config.InsertColonelOpenIdShare,
          data: {
            openid: wx.getStorageSync('openid'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address'),
            type: 3,
            id: that.data.esid,
            mchid: common.data.MchId,
            number: nn
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) { }
        });
        wx.redirectTo({
          url: '../Twoenvelope/Twoenvelope?esid=' + that.data.esid + "&chai=1"
        });
      }
    }
  },
  kecheng: function () {
    wx.navigateTo({
      url: '../redCourse/redCourse',
    })
  }
})