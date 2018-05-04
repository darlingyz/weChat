// newpage/redCourse/redCourse.js
var common = require('../../Common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      // {
      //   img: "../../images/juezhao_10.jpg",
      //   title: "3大绝招帮你“好好说话”，变身沟通专家",
      //   price: "2994.00",
      //   Oprice: "2999.00",
      //   imgbg: "../../images/kechengY_03.png",
      //   money: "5",
      //   MastM: "5"
      // },
      // {
      //   img: "../../images/juezhao_10.jpg",
      //   title: "3大绝招帮你“好好说话”，变身沟通专家",
      //   price: "2994.00",
      //   Oprice: "2999.00",
      //   imgbg: "../../images/kechengY_03.png",
      //   money: "5",
      //   MastM: "5"
      // }
    ],
    imgHeight:"",
    ww:"",
    csid:"",
    price:""
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
    var csid ="";
    var price ="";
    if (options != undefined) {
      csid = options.csid;
      price = options.price;
    }
    else {
      csid = that.data.csid;
      price = that.data.price;
    }
    wx.request({
      url: common.config.GetCouponsCourseList,
      method: 'POST',
      data: { mchid: common.data.MchId, openid: wx.getStorageSync('openid'), csid:csid },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var list = res.data.list;
        var ll=[];
        for (var i = 0; i < list.length; i++)
        {
          var mm = {
            Id: list[i].Id,
            img: common.config.CoursePath + list[i].PicturePath,
            title: list[i].Title,
            price: (list[i].OriginalPrice - price).toFixed(2),
            Oprice: list[i].OriginalPrice.toFixed(2),
            imgbg: common.config.ImgPath + "kechengY_03.png",
            money: price
          };
          ll.push(mm);
        }
        that.setData({
          list:ll,
          csid:csid,
          price:price
        })
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

  },
  xiangxi:function(e){
    var that=this;
    var cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: '../Coupcour/Coupcour?id=' + cid + '&yu=0&copenid=0&csid='+that.data.csid+'&price='+that.data.price
    });
  }
})