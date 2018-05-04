// Kecheng/Home/Home.js
var app = getApp();
var common = require("../../Common.js");

var courTimer; //时钟
var courTC = []; //需要计时的东西
var pin = "true";
//渲染倒计时时钟
function countDown(thisPage) {
  var data = {};
  var currTab = thisPage.data.currentTab;
  clearTimeout(courTimer);//清除不用的时钟
  if (courTC.length > 0) {
    courTimer = setTimeout(function () {
      for (var i = 0; i < courTC.length; i++) {
        if (courTC[i] <= 0) continue;
        var shia = currTab === 0 ? "recomCourList[" + i + "].shi" : "tabCourList[" + i + "].shi";
        var fena = currTab === 0 ? "recomCourList[" + i + "].fen" : "tabCourList[" + i + "].fen";
        var miaoa = currTab === 0 ? "recomCourList[" + i + "].miao" : "tabCourList[" + i + "].miao";
        var totalSecond = date_format(courTC[i]);
        var shi = parseInt(totalSecond.substr(0, 2) * 24) + parseInt(totalSecond.substr(3, 2));
        var fen = totalSecond.substr(6, 2);
        var miao = totalSecond.substr(9, 2);
        data[shia] = shi
        data[fena] = fen
        data[miaoa] = miao
        thisPage.setData(data);
        courTC[i] -= 1;
      }
      countDown(thisPage);
    }, 1000);
  }
}

// 时间格式化输出，如03:25:19 86
function date_format(micro_second) {
  // 秒数
  var second = micro_second;
  // 小时位
  var hr = Math.floor(second / 3600);
  //天
  var day = Math.floor(hr / 24);
  // 小时
  var hx = fill_zero_prefix((Math.floor(second / 3600 % 24)));
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
  return fill_zero_prefix(day) + "," + hx + "," + min + "," + sec;
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
    navWidth: 0,
    navContent: [],
    currentTab: 0,
    courImgWidth: "",//课程图片展示宽度
    courImgHeight: "",//课程图片展示高度
    template: [], //复杂版首页模版
    recomCourList: [], //推荐课程
    tabCourList: [], //栏目课程列表
    KanTui: true,
    noCourMsg: "暂无推荐课程",
    noCour: false,
    tabCurrent: 0,
    imga: common.config.ImgPath + "kanjai_03.jpg",
    imgb: common.config.ImgPath + "time_03.jpg", html: { a: common.config.ImgPath + "tuijia_02.jpg", b: common.config.ImgPath + "home_sou.jpg", c: common.config.ImgPath + "remai_03.png" },
    pingimg: common.config.ImgPath + "pingtuan_03.png",
    kanimg: common.config.ImgPath + "KanJia_03.png",
    yiyuan: common.config.ImgPath + "YiYuan.png",
    dati: common.config.ImgPath + "DaTi.png",
    youhui: common.config.ImgPath + "hui_03.png",
    youimg: common.config.ImgPath + "hui_3_03.png",
    shiting: common.config.ImgPath + "shit_03.png",
    taocan: common.config.ImgPath + "taocan_03.png",
    pageIndex: 1,
    pageSize: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pin = true;
    wx.showLoading({ title: '努力加载中...' });
    var openId = wx.getStorageSync("openid");
    if (openId == "" || openId == null) {
      common.GetOpenId();
    }
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }
    if (common.data.TitleName == "") {
      wx.request({
        url: common.config.GetAdminmodel,
        data: { mchid: common.data.MchId },
        method: "POST",
        header: { 'content-type': 'application/json' },
        success: function (res) {
          common.data.titleName = res.data.model.Name;
          wx.setNavigationBarTitle({ title: common.data.titleName });
        }
      });
    } else {
      wx.setNavigationBarTitle({ title: common.data.titleName })
    }
    if (this.data.currentTab === 0) {
      this.getHomePage();
    } else {
      this.getTabPage();
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
    if (pin != "true") {
      this.onLoad();
    }
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
    wx.showLoading({ title: '努力加载中...' });
    var homePage = this;
    if (homePage.data.currentTab == 0) {
      homePage.setData({
        tabCurrent: 0
      });
      homePage.getHomePage();
    }
    else {
      homePage.setData({ tabCourList: [] });
      homePage.getTabList();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentTab == 0) {
      var index = this.data.pageIndex;
      index++;
      this.data.pageIndex = index;
      this.getRecomCours();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: common.data.TitleName,
      desc: common.data.TitleName,
      path: '/Kecheng/Home/Home'
    }
  },

  //获取推荐内容及导航条
  getHomePage: function () {
    var homePage = this;
    homePage.data.pageIndex = 1;
    homePage.data.recomCourList = [];
    clearTimeout(courTimer);
    courTC = [];
    wx.getSystemInfo({
      success: function (res) {
        homePage.data.courImgWidth = res.screenWidth;
        homePage.data.courImgHeight = res.screenWidth * 0.5;
        homePage.setData({
          courImgWidth: homePage.data.courImgWidth,
          courImgHeight: homePage.data.courImgHeight
        })
      },
    })
    wx.request({
      url: common.config.GetNewToolModules,
      method: "POST",
      data: {
        mchid: common.data.MchId,
        openid: wx.getStorageSync('openid'),
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address')
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {//请求成功
        console.log(res.data);
        var tools = res.data.tool;
        var template = [];//首页模块
        var subArray = [];//5个一块
        var navContent = [{ courTitle: "推荐", courIds: '0' }]; //首页栏目
        homePage.data.navWidth = tools.length <= 3 ? 100 : tools.length * 30;
        for (var i = 0; i < tools.length; i++) {
          var tool = { courTitle: tools[i].ToolsName, courIds: tools[i].CourseListString };
          navContent.push(tool);
        }
        homePage.setData({ navWidth: homePage.data.navWidth, navContent: navContent });
        var modules = res.data.module; //首页模块
        if (modules !== null && modules.length > 0) {
          for (var i = 0; i < modules.length; i++) {
            var moa = { title: modules[i].CourName, url: common.config.IconImg + modules[i].ImgName, types: modules[i].CourType };
            subArray.push(moa);
            if ((i + 1) % 5 === 0 || i === modules.length - 1) {
              var mob = { key: i, value: subArray };
              template.push(mob);
              subArray = [];
            }
          }
        }
        homePage.setData({ template: template });
        homePage.getRecomCours();
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
        })
      },
      fail: function () {
        common.modalTap("亲~网络不给力哦，请稍后重试");
        wx.hideLoading();
      },
    })
  },

  //获取首页推荐课程
  getRecomCours: function () {
    var homePage = this;
    var recomCourList = homePage.data.recomCourList;
    wx.request({
      url: common.config.GetRecomCourseList,
      method: 'POST',
      data: {
        mchid: common.data.MchId,
        openid: wx.getStorageSync('openid'),
        pageIndex: homePage.data.pageIndex,
        pageSize: homePage.data.pageSize
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res.data);
        var courList = res.data.list; //推荐课程列表
        if (courList != null && courList.length > 0) {
          for (var i = 0; i < courList.length; i++) {
            courTC.push(courList[i].IsKanGroupEndTime);
            if (courList[i].Title.length > 35) {
              courList[i].Title = courList[i].Title.substr(0, 35) + '...';
            }
            var gp = courList[i].GroupPrice;
            if (parseInt(gp) == gp) {
              courList[i].GroupPrice = gp.toFixed(2);
            }
            var rp = courList[i].RetailPrice;
            if (parseInt(rp) == rp) {
              courList[i].RetailPrice = rp.toFixed(2);
            }
            var op = courList[i].OriginalPrice;
            if (parseInt(op) == op) {
              courList[i].OriginalPrice = op.toFixed(2);
            }
            courList[i].PicturePath = common.config.CoursePath + courList[i].PicturePath;
            if (courList[i].Type >= 5) {
              courList[i].jindu = jisuan(courList[i].ParticipateCount, courList[i].GropCount);
            }
            recomCourList.push(courList[i]);
          }
        }
        countDown(homePage);
        homePage.setData({
          recomCourList: recomCourList,
          noCourMsg: "暂无推荐课程",
          noCour: recomCourList.length > 0 ? false : true
        })
      },
      fail: function () {
        common.modalTap("亲~网络不给力哦，请稍后重试");
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  //获取tab课程列表
  getTabPage: function () {
    var openid = wx.getStorageSync("openid");
    var homePage = this;
    clearTimeout(courTimer);
    courTC = [];
    var tabCourList = [];
    var KanTui = true;
    var cIds = homePage.data.navContent[homePage.data.currentTab].courIds;
    wx.request({
      url: common.config.GetCourseOfTools,
      method: "POST",
      data: { cids: cIds, openid: openid },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        if (res.data.result) {
          var courList = res.data.list;
          if (courList != null && courList.length > 0) {
            for (var i = 0; i < courList.length; i++) {
              courTC.push(courList[i].IsKanGroupEndTime);
              if (homePage.data.currentTab == 0 && courList[i].Type == 4) {
                KanTui = false;
              }
              if (courList[i].Title.length > 35) {
                courList[i].Title = courList[i].Title.substr(0, 35) + '...';
              }
              var gp = courList[i].GroupPrice;
              if (parseInt(gp) == gp) {
                courList[i].GroupPrice = gp + ".00";
              }
              var rp = courList[i].RetailPrice;
              if (parseInt(rp) == rp) {
                courList[i].RetailPrice = rp + ".00";
              }
              var op = courList[i].OriginalPrice;
              if (parseInt(op) == op) {
                courList[i].OriginalPrice = op + ".00";
              }
              courList[i].PicturePath = common.config.CoursePath + courList[i].PicturePath;
              if (courList[i].Type >= 5) {
                courList[i].jindu = jisuan(courList[i].ParticipateCount, courList[i].GropCount);
              }
              tabCourList.push(courList[i]);
            }
          }
          countDown(homePage);
          homePage.setData({
            tabCourList: tabCourList,
            noCourMsg: "暂无课程",
            noCour: tabCourList.length > 0 ? false : true
          });
        } else {
          homePage.setData({
            tabCourList: tabCourList,
            noCourMsg: "暂无课程",
            noCour: tabCourList.length > 0 ? false : true
          })
        }
      },
      fail: function (e) {
        common.modalTap("亲~网络不给力哦，请稍后重试")
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },

  //获取首页tab列表
  getTabList: function () {
    var homePage = this;
    wx.request({
      url: common.config.GetToolModule,
      method: "POST",
      data: {
        mchid: common.data.MchId,
        openid: wx.getStorageSync('openid'),
        province: wx.getStorageSync('province'),
        city: wx.getStorageSync('city'),
        address: wx.getStorageSync('address')
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {//请求成功
        var tools = res.data.tool;
        var navContent = [{ courTitle: "推荐", courIds: '0' }]; //首页栏目
        homePage.data.navWidth = tools.length <= 3 ? 100 : tools.length * 30;
        for (var i = 0; i < tools.length; i++) {
          var tool = { courTitle: tools[i].ToolsName, courIds: tools[i].CourseListString };
          navContent.push(tool);
        }
        if (homePage.data.currentTab > navContent.length) {
          homePage.data.currentTab = 0;
        }
        homePage.setData({ navContent: navContent, navWidth: homePage.data.navWidth, currentTab: homePage.data.currentTab });
      },
      complete: function () {
        homePage.getTabPage();
      }
    })
  },

  //导航栏选中
  navbarTap: function (e) {
    var homePage = this;
    clearTimeout(courTimer);
    courTC = [];
    var cIds = e.currentTarget.dataset.course;//所包含课程的Id
    var index = e.currentTarget.dataset.index;
    if (homePage.data.currentTab === index) return;//点击当前页不做处理
    wx.showLoading({ title: '努力加载中...' });
    var openid = wx.getStorageSync("openid");
    homePage.data.tabCourList = [];
    homePage.setData({ tabCourList: homePage.data.tabCourList });
    var KanTui = true;
    if (cIds != "07" && cIds != "08") {
      homePage.setData({
        currentTab: index
      });
      var types = 0;
      var cList = [];//tab课程列表
      if (homePage.data.currentTab == 0) {
        homePage.getHomePage();
        return;
      } else {
        cList = homePage.data.tabCourList;
        wx.request({
          url: common.config.GetCourseOfTools,
          method: 'POST',
          data: { cids: cIds, openid: openid },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.result) {
              var kelist = res.data.list;
              if (kelist != null && kelist.length > 0) {
                for (var i = 0; i < kelist.length; i++) {
                  courTC.push(kelist[i].IsKanGroupEndTime);
                  if (homePage.data.currentTab == 0 && kelist[i].Type == 4) {
                    KanTui = false;
                  }
                  if (kelist[i].Title.length > 35) {
                    kelist[i].Title = kelist[i].Title.substr(0, 35) + '...';
                  }
                  var gp = kelist[i].GroupPrice;
                  if (parseInt(gp) == gp) {
                    kelist[i].GroupPrice = gp + ".00";
                  }
                  var rp = kelist[i].RetailPrice;
                  if (parseInt(rp) == rp) {
                    kelist[i].RetailPrice = rp + ".00";
                  }
                  var op = kelist[i].OriginalPrice;
                  if (parseInt(op) == op) {
                    kelist[i].OriginalPrice = op + ".00";
                  }
                  kelist[i].PicturePath = common.config.CoursePath + kelist[i].PicturePath;
                  if (kelist[i].Type >= 5) {
                    kelist[i].jindu = jisuan(kelist[i].ParticipateCount, kelist[i].GropCount);
                  }
                  cList.push(kelist[i]);
                }
                countDown(homePage);
              }
            }
          },
          fail: function (e) {
            common.modalTap("亲~网络不给力哦，请稍后重试")
          },
          complete: function () {
            wx.hideLoading();
            if (homePage.data.currentTab == 0) {
              homePage.setData({
                recomCourList: cList,
                KanTui: KanTui,
                noCourMsg: "暂无推荐课程",
                noCour: cList.length > 0 ? false : true
              });
            } else {
              homePage.setData({
                tabCourList: cList,
                noCourMsg: "暂无课程",
                noCour: cList.length > 0 ? false : true
              });
            }
          }
        });
      }
    }
    else {
      wx.request({
        url: common.config.GetHuoDong,
        method: 'POST',
        data: { mchid: common.data.MchId, openid: wx.getStorageSync('openid'), types: cIds },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var migs = res.data.list;
          wx.hideLoading();
          if (migs.Id != 0) {
            var rid = migs.Id;
            var esid = migs.MyEnvelopeSplitsId;
            var csid = migs.MyCouponsId;
            var status = migs.Status;
            homePage.Red(rid, esid, csid, status)
          }
          else {
            var aa = "抢红包";
            if (cIds == '08')
            { aa = "优惠券助力" }
            common.modalTap("对不起，商家暂无" + aa + "活动！");
            return
          }
        }
      })
    }
  },

  //分类课程查看
  keke: function (e) {
    var homePage = this;
    var types = e.currentTarget.dataset.types;
    if (types == "7" || types == 7 || types == "8" || types == 8) {
      wx.request({
        url: common.config.GetHuoDong,
        method: 'POST',
        data: { mchid: common.data.MchId, openid: wx.getStorageSync('openid'), types: "0" + types },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var migs = res.data.list;
          if (migs.Id != 0) {
            var rid = migs.Id;
            var esid = migs.MyEnvelopeSplitsId;
            var csid = migs.MyCouponsId;
            var status = migs.Status;
            homePage.Red(rid, esid, csid, status)
          }
          else {
            var aa = "抢红包";
            if (types == '8')
            { aa = "优惠券助力" }
            common.modalTap("对不起，商家暂无" + aa + "活动！");
            return
          }
        }
      })
    }
    else if (types == "9" || types == 9) {
      wx.request({
        url: common.config.ApplyStyle,
        method: 'POST',
        data: { openid: wx.getStorageSync('openid') },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.result) {
            var model = res.data.model;
            if (model.Id > 0 && model.Type == 1) {
              wx.navigateTo({
                url: '../../distribution/disCourse/disCourse',
              })
            }
            else {
              wx.navigateTo({
                url: '../../distribution/Apply/Apply',
              })
            }
          }
        }
      })
    }
    else {
      wx.navigateTo({
        url: '../keke/keke?types=' + types,
      });
    }
  },

  //课程详情
  Ping: function (e) {
    pin = "false";
    var Id = e.currentTarget.dataset.pid;
    var gid = e.currentTarget.dataset.gid;
    var types = e.currentTarget.dataset.type;
    var scount = e.currentTarget.dataset.scount;
    var openid = wx.getStorageSync('openid');
    var name = wx.getStorageSync('nickName');
    if (types == "1") //拼团
    {
      wx.navigateTo({
        url: '../Detail/Detail?id=' + Id + "&yu=0&copenid=0"
      });
    }
    if (types == "4") //砍价
    {
      if (scount != "0") {
        if (gid == "0") {
          wx.navigateTo({
            url: '../Onebargaining/Onebargaining?cid=' + Id + "&yu=0&copenid=0"
          });
        }
        else if (gid != "0") {
          wx.navigateTo({
            url: '../Twobargaining/Twobargaining?gid=' + gid + "&yu=0&copenid=0"
          })
        }
      }
    }
    if (types == "5")//一元
    {
      var oid = "0";
      if (e.currentTarget.dataset.oid != undefined) {
        oid = e.currentTarget.dataset.oid;
      }
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        wx.navigateTo({
          url: '../YiYuan/YiYuan?id=' + Id + "&yu=0&copenid=0&oid=" + oid
        });
      }
    }
    if (types == "6")//答题
    {
      var otype = e.currentTarget.dataset.otype;
      var oid = e.currentTarget.dataset.oid;
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        if (otype == "2") {
          var title = e.currentTarget.dataset.title
          wx.navigateTo({
            url: '../../newpage/succeed/succeed?oid=' + oid + "&cid=" + Id + "&copenid=0&title=" + title
          });
        }
        if (otype == "3") {
          wx.navigateTo({
            url: '../../newpage/answer/answer?id=' + Id,
          });
        }
        else if (otype == undefined) {
          wx.navigateTo({
            url: '../../newpage/customer/customer?copenid=0&id=' + Id
          });
        }
      }
    }
    if (types == '10')//优惠
    {
      wx.navigateTo({
        url: '../YouHui/YouHui?id=' + Id + "&yu=0&copenid=0"
      });
    }
    if (types == "11")//试听
    {
      var oid = "0";
      if (e.currentTarget.dataset.oid != undefined) {
        oid = e.currentTarget.dataset.oid;
      }
      var sheng = e.currentTarget.dataset.sheng;
      if (sheng != "0") {
        wx.navigateTo({
          url: '../ShiTing/ShiTing?id=' + Id + "&yu=0&copenid=0&oid=" + oid
        });
      }
    }
    if (types == '12')//套餐
    {
      wx.navigateTo({
        url: '../TaoCan/TaoCan?id=' + Id + "&yu=0&copenid=0"
      });
    }
  },

  //分享得红包
  Red: function (rid, esid, csid, status) {
    if (status == "1") //红包活动
    {
      if (rid != "0" && rid != "" && esid != "0") {//已创建了拆分红包订单
        wx.navigateTo({
          url: '../../newpage/Twoenvelope/Twoenvelope?esid=' + esid + "&chai=1"
        });
      }
      else if (rid != "0" && rid != "" && esid == "0") {//没有创建过拆分红包的订单
        wx.request({
          url: common.config.InsertEnvelopeSplits,
          data: { rid: rid, openid: wx.getStorageSync('openid') },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.navigateTo({
              url: '../../newpage/envelope/envelope?tan=' + res.data.tan + '&esid=' + res.data.esid + '&rid=' + rid,
            });
          }
        });
      }
    }
    else if (status == "2") //优惠券活动
    {
      if (csid == "0") {
        wx.request({
          url: common.config.InsertCouponsSplits,
          data: { cid: rid, openid: wx.getStorageSync('openid') },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.navigateTo({
              url: '../../newpage/envelopeT/envelopeT?csid=' + res.data.csid + '&cid=' + rid,
            });
          }
        });
      }
      else {
        wx.navigateTo({
          url: '../../newpage/envelopeT/envelopeT?csid=' + csid + '&cid=' + rid,
        });
      }
    }
  },
})

function jisuan(sum, count) {
  var ss = parseInt(sum);
  var cList = parseInt(count);
  var uu = ((100 / ss)) * cList;
  return uu;
} 