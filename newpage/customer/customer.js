// newpage/customer/customer.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:[],
  cid:"",
  AnswerImg:"",
  ConfirmAnswer:"",
  sel:"A",
  title:"",
  model: "",
  xiajiatu: common.config.ImgPath + "XiaJia_03.png",
  XiaJia: true,
  copenid:"",
  currred:"",
  numbertime:""
  },
  chose:function(e){
    var that=this;
    let idx = e.currentTarget.dataset.index;
    var list=this.data.list;
    for (var i = 0; i < list.length;i++){
      if(i==idx){
        list[i].Choose = "Choose"
        that.setData({
          sel: list[i].letter
        });
      }else{
        list[i].Choose = ""
      }
    }
    this.setData({
      list:list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cid = options.id;
    var copenid = options.copenid;
    var numbertime = options.numbertime;
    if (copenid == undefined) {
      copenid = "0";
    }
    if (numbertime == undefined) {
      numbertime = "0";
    }
    var that = this;
    wx.setNavigationBarTitle({ title: common.data.TitleName });
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      common.GetOpenId();
    }
    var province = wx.getStorageSync("province");
    if (province == null || province == "") {
      common.dingwei();
    }

    wx.request({
      url: common.config.GetCourseAndGrop,
      data: {
        id: cid,
        openid: wx.getStorageSync('openid'),
        copenid:copenid,
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
          var currred = res.data.currred;
          var model = res.data.modle;
          var answer = model.Course_Answer;
          var order = model.GroupOrders;
          var oid=0;
          var yu="";
          if (model.Status != "2") {
            that.setData({
              XiaJia: false
            });
          }
          else{
          if (order.Id != "0") {
            oid = order.Id;
            if (order.Type=="1")
            {
              wx.redirectTo({
                url: '../model/model?ling=0&card=' + order.OrderCard + '&title=' + model.Title,
              });
            }
            else if (order.Type == "2")
            {
              wx.redirectTo({
                url: '../succeed/succeed?oid=' + order.Id + '&cid='+cid+'&title=' + model.Title,
              });
            }
            else if(order.Type == "3")
            {
              wx.redirectTo({
                url: '../answer/answer?id=' + cid,
              })
            }
          }
          if (model.Status == "2") {
            yu = "Xiadan";
          }
          var list=[];
          list.push({ letter: "A", title: answer.AnswerA,Choose: "Choose"});
          list.push({ letter: "B", title: answer.AnswerB, Choose: "" });
          list.push({ letter: "C", title: answer.AnswerC, Choose: "" });
          list.push({ letter: "D", title: answer.AnswerD, Choose: "" });
          that.setData({
            cid: cid,
            title: answer.Title,
            AnswerImg: common.config.AnswerQuesImg + answer.AnswerImg,
            ConfirmAnswer: answer.ConfirmAnswer,
            list:list,
            title: model.Course_Answer.Title,
            oid: oid,
            model: model,
            copenid: copenid,
            currred: currred,
            numbertime: numbertime
          });
          }
        }
      }
    });

  },
  tijiao:function()
  {
    var that=this;
    var cid=this.data.cid;
    var answer=this.data.list;
    var zhen = this.data.ConfirmAnswer;
    var sel = this.data.sel;
    if (sel == zhen) {//回答正确
      wx.request({
        url: common.config.InsertGroupAnswer,
        data: {
          openid: wx.getStorageSync('openid'),
          cid: cid,
          type: 2,
          selans: sel
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.result) {
            wx.redirectTo({
              url: '../succeed/succeed?oid=' + res.data.oid + "&cid=" + cid + "&title=" + that.data.model.Title,
            });
          }
        }
      });
    }
    else {//回答错误
      wx.request({
        url: common.config.InsertGroupAnswer,
        data: {
          openid: wx.getStorageSync('openid'),
          cid: cid,
          type: 3,
          selans:sel
          },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) { 
          if(res.data.result)
          {
            wx.redirectTo({
              url: '../answer/answer?id='+cid,
            })
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
      desc: that.data.title,
      path: '/newpage/customer/customer?id=' + that.data.cid + '&copenid=' + wx.getStorageSync('openid') + '&numbertime=' + nn,
      success: function (res) {
        if (that.data.currred.Id != "0") {
          var aa = "现金";
          if (that.data.currred.RedpocketType == "1") {
            aa = "课程";
          }
          common.modalTap("课程分享成功,好友打开课程后您课获得" + aa + "红包。");
        }
        wx.request({
          url: common.config.InsertColonelOpenIdShare,
          data: {
            openid: wx.getStorageSync('openid'),
            province: wx.getStorageSync('province'),
            city: wx.getStorageSync('city'),
            address: wx.getStorageSync('address'),
            type: 1,
            id: that.data.cid,
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
  }
})