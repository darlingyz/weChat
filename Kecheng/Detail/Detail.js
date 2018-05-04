var app = getApp();
var common = require('../../Common.js');
var WxParse = require('../../wxParse/wxParse.js');
var now = new Date();
var nian = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
var shi = (now.getHours() < 10 ? "0" : "") + now.getHours() + ":" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();

var candian = "true";
var pingdian = "true";

/** 
 * 需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
 * 1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
 * 2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
 * 3.剩余的秒次为零时，return，给出tips提示说，已经截止
 */

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second;
var pp;
clearTimeout(pp)

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
    total_micro_second -= 1;
    count_down(that);
  }, 1000)
}


/* 毫秒级倒计时 */
var pplist = [];
/* 毫秒级倒计时 */
function count_downlist(that) {
  // 渲染倒计时时钟
  var param = {};
  setTimeout(function () {
    for (var i = 0; i < pplist.length; i++) {
      var string = "group[" + i + "].d3";
      param[string] = date_formatList(pplist[i]);
      that.setData(param);
      pplist[i] -= 1000;
    }
    count_down(that);
  }, 1000)
}



// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = micro_second;
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
  return "距结束仅剩\n\n" + day + "\n天\n" + hx + "\n时\n" + min + "\n分\n" + sec + "\n秒";
}


// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_formatList(micro_second) {
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
  var a = hx + ":" + min + ":" + sec;
  return a;
}



// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({
  data: {
    movies: [],
    clock: '',
    kid: '',
    title: '',
    kecheng: { title: "零基础直达流利口语中级【8月通关A班】" },
    tu: { a: common.config.ImgPath + "tutututu.png", b: common.config.ImgPath + "jiao.jpg", c: common.config.ImgPath + "dingwei.jpg", d: common.config.ImgPath + "shouji.jpg", e: common.config.ImgPath + "de1.jpg", f: common.config.ImgPath + "de2.jpg" },
    group: [],
    addrephone: false,
    phone: "",
    id: 0,
    groupcount: "0",
    wtime: 0,
    yu: "",
    dlise: [],
    imgHeight: "",
    xiajiatu: common.config.ImgPath + "XiaJia_03.png",
    XiaJia: true,
    shiping: "",
    copenid: "",
    currred: "",
    numbertime: ""
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let imgHeight = ww * 0.5;
        that.setData({
          imgHeight: imgHeight
        });
      }
    });

    candian = "true";
    pingdian = "true";
    var glist = [];
    var zizhiopenid = "";
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }
    clearTimeout(pp);
    var id = "";
    var yu = "";
    var copenid = "";
    var numbertime = "";
    if (options == undefined) {
      id = that.data.kid;
      yu = that.data.yu;
      copenid = that.data.copenid;
      numbertime = that.data.numbertime;
    }
    else {
      id = options.id;
      yu = options.yu;
      copenid = options.copenid;
      numbertime = options.numbertime;
      if (yu == "0") {
        yu = "Xiadan";
      }
      if (copenid == undefined) {
        copenid = "0";
      }
      if (numbertime == undefined) {
        numbertime = "0";
      }
    }
    wx.request({
      url: common.config.GetCourseAndGrop,
      data: {
        id: id,
        openid: wx.getStorageSync('openid'),
        copenid: copenid,
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
        if (res.data.result) {
          var migs = res.data.imgs;//课程图片集合
          var model = res.data.modle;
          var group = res.data.group;
          var gp = model.GroupPrice;
          var currred = res.data.currred
          if (model.Status != "2") {
            that.setData({
              XiaJia: false
            });
          }
          else {
            var dlise = [];
            var dlise = model.Course_Description;
            zizhiopenid = model.UsersOpenId;
            if (model.Status == "2") {
              yu = "Xiadan";
            }
            if (parseInt(gp) == gp) {
              model.GroupPrice = gp.toFixed(2);
            }
            var rp = model.RetailPrice;
            if (parseInt(rp) == rp) {
              model.RetailPrice = rp.toFixed(2);
            }
            var op = model.OriginalPrice;
            if (parseInt(op) == op) {
              model.OriginalPrice = op.toFixed(2);
            }
            var list = [];
            migs = migs.split(",");
            for (var i = 0; i < migs.length; i++) {
              var a = { url: common.config.CoursePath + migs[i] };
              list.push(a);
            }
            for (var i = 0; i < dlise.length; i++) {
              dlise[i].PicturePath = common.config.CoursePath + dlise[i].PicturePath;
            }
            for (var i = 0; i < group.length; i++) {
              var tt = common.timeStamp2String(group[i].EndTime);
              var cc = parseInt(group[i].ParticipateCount) - parseInt(group[i].AttendCount);
              var zhu = false;//开团者
              if (group[i].ColonelOpenId == openid)
              { zhu = true; }
              var name = group[i].Users.Name
              if (name.length > 5) {
                name = name.substr(0, 4) + "...";
              }
              var b = { id: group[i].Id, im: group[i].Users.AvatarUrl, name: name, co: cc, zhu: zhu, et: tt }
              var d1 = new Date(nian + " " + shi);
              var d2 = new Date(tt);
              var wtime = (d2 - d1);
              pplist.push(wtime);
              glist.push(b);
            }
            var y = false;
            if (model.Phone == "" && model.Address == "") {
              y = true;
            }
            if (model.Phone == "") {
              wx.request({
                url: common.config.GetCertification,
                data: {
                  adminsid: common.data.MchId
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  if (res.data.result) {
                    that.setData({
                      phone: res.data.phone
                    })
                  }
                }
              })
            }
            WxParse.wxParse('article', 'html', model.Description, that, 5);
            that.setData({
              movies: list,
              kid: id,
              group: glist,
              title: model.Title,
              jie: model.Introduce,
              end: "",
              miao: model.Description,
              gprice: model.GroupPrice,
              oprice: model.OriginalPrice,
              rprice: model.RetailPrice,
              address: model.Address,
              phone: model.Phone,
              ccount: model.ParticipateCount,
              ccountmin: parseInt(model.ParticipateCount) - 1,
              groupcount: res.data.groupcount,
              addrephone: y,
              wtime: model.WaitTime,
              yu: yu,
              dlise: dlise,
              shiping: model.VideoPath,
              copenid: copenid,
              currred: currred,
              numbertime: numbertime
            });
          }
        }
      }
    });
    var p = that.data.phone;
  },
  onShareAppMessage: function () {
    var that = this;
    var nn = common.GetNumberTime();

    return {
      title: common.data.TitleName,
      desc: that.data.title,
      path: '/Kecheng/Detail/Detail?id=' + that.data.kid + '&copenid=' + wx.getStorageSync('openid') + '&numbertime=' + nn,
      success: function (res) {
        if (that.data.currred.Id != "0") {
          var aa = "现金";
          if (that.data.currred.RedpocketType == "1") {
            aa = "课程";
          }
          common.modalTap("课程分享成功,好友打开课程后您可获得" + aa + "红包。");
        }

        // var now = new Date();
        // var year = now.getFullYear() + "";       //年  
        // var month = now.getMonth() + 1 + "";     //月  
        // var day = now.getDate() + "";            //日  
        // var hh = now.getHours() + "";            //时  
        // var mm = now.getMinutes() + "";          //分  
        // var ss = now.getSeconds() + "";           //秒  

        wx.request({
          url: common.config.InsertColonelOpenIdShare,
          data: {
            openid: wx.getStorageSync('openid'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address'),
            type: 1,
            id: that.data.kid,
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
  Xiadan: function (e) {
    var kid = e.currentTarget.dataset.kid;
    var types = e.currentTarget.dataset.types;
    if (pingdian == "false") {
      return;
    } else {
      pingdian = "false";
      wx.navigateTo({
        url: '../Ouder/Ouder?kid=' + kid + '&types=' + types
      });
    }
  },
  cantuan: function (e) {
    var kid = this.data.kid;
    var gid = e.currentTarget.dataset.id;
    var co = e.currentTarget.dataset.co;
    if (candian == "false") {
      return;
    } else {
      candian = "false";
      wx.navigateTo({
        url: '../Ouder/Ouder?kid=' + kid + '&types=1&gid=' + gid + "&co=" + co
      });
    }
  },
  detial: function () {
    var time = this.data.wtime;
    wx.navigateTo({
      url: '../rule/rule?time=' + time
    });
  },
  zixun: function () {
    var pp = this.data.phone;
    wx.showModal({
      title: '欢迎咨询',
      confirmText: '呼叫',
      content: pp,
      success: function (sm) {
        if (sm.confirm) {
          wx.makePhoneCall({
            phoneNumber: pp
          })
        }
      }
    });
  },
  fanhui: function () {
    wx.reLaunch({
      url: '../Home/Home'
    })
  },
  onPullDownRefresh: function () {
    now = new Date();
    candian = "true";
    pingdian = "true";
    total_micro_second = "";
    pp = "";
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  onShow: function () {
    candian = "true";
    pingdian = "true";
  },
  dizhi: function () {
    common.dizhi(this.data.address);
  }
});
