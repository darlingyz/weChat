// newpage/redCourse/redCourse.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:[
    // {
    //   img:"../../images/juezhao_10.jpg",
    //   title:"3大绝招帮你“好好说话”，变身沟通专家",
    //   price:"2994.00",
    //   Oprice:"2999.00",
    //   imgbg:"../../images/money_13.png",
    //   money:"5",
    //   MastM:"5"
    // },
    // {
    //   img: "../../images/juezhao_10.jpg",
    //   title: "3大绝招帮你“好好说话”，变身沟通专家",
    //   price: "2994.00",
    //   Oprice: "2999.00",
    //   imgbg: "../../images/money_13.png",
    //   money: "5",
    //   MastM: "5"
    // }
  ],
  imgbg: common.config.ImgPath + "money_13.png",
  jiantou: common.config.ImgPath + "jiantou-red_06.png",
  redbao: common.config.ImgPath + "redBao_03.png",
  redcount:"",
  rid:"0",
  redpp: "0.00",
  ww: "",
  imgHeight: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let imgHeight = ww * 0.5;
        that.setData({
          ww: ww,
          imgHeight: imgHeight
        });
      }
    });
    wx.request({
      url: common.config.GetRedCourseList,
      data: { mchid: common.data.MchId, openid: wx.getStorageSync('openid') },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var list = res.data.list;
        var redcount = res.data.redcount;
        if(list.length>0)
        {
          for(var i=0;i<list.length;i++)
          {
            list[i].PicturePath = common.config.CoursePath + list[i].PicturePath;
            if (redcount >= list[i].RetailPrice)
            {
              list[i].jianprice = list[i].OriginalPrice - list[i].RetailPrice;
              list[i].jian = list[i].RetailPrice;
            }
            else if (redcount < list[i].RetailPrice)
            {
              list[i].jianprice = list[i].OriginalPrice - redcount;
              list[i].jian = redcount;
            }
            list[i].jianprice = list[i].jianprice.toFixed(2);
            list[i].OriginalPrice = list[i].OriginalPrice.toFixed(2);
          }
          that.setData({
            list:list,
            redcount: redcount,
            rid: res.data.rid,
            redpp: redcount.toFixed(2)
          });
        }
        else{
        that.setData({
          redcount: redcount,
          rid: res.data.rid,
          redpp: redcount.toFixed(2)
        });
        }
      }
    })
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
  
  },
  chaibao:function(){
    var that=this;
    var rid = that.data.rid;
    if(rid=="0")
    {
      common.modalTap("商家暂无红包活动！");
      return
    }
    else{
      wx.request({
        url: common.config.InsertEnvelopeSplits,
        data: { rid: rid, openid: wx.getStorageSync('openid') },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.redirectTo({
            url: '../envelope/envelope?tan=' + res.data.tan + '&esid=' + res.data.esid + '&rid=' + rid
          });
        }
      });
    }
  },
  tiaozhuan:function(e){
    var cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '../redcour/redcour?copenid=0&id='+cid
    })
  }
})