// Ouder.js
var common = require('../../Common.js')
var zhidian="true";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kid: 0,
    img: "",
    title: "",
    gprice: "",
    oprice: "",
    rprice: "",
    types: "",
    wtime: 0,
    ucount:0,
    op:"",
    gp:"",
    gid:"0",
    co:"",
    sp:"",
    name:"",
    pphone:"",
    coursetype:""
  },

  formSubmit: function (e) {
    //debugger;
    wx.setStorageSync("formId", e.detail.formId);
    var that = this;
    if(zhidian=="false")
    {
      return;
    }
    if (e.detail.value.Name == "")
    {
      common.modalTap("请填写姓名");
      return
    }
    if (!(/^1[34578]\d{9}$/.test(e.detail.value.Phone))) {
      common.modalTap("请填写正确的手机号");
      return
    }
    if (e.detail.value.Remark.length > 30) {
      common.modalTap("请输入少于30字的备注");
      return
    }else{
    zhidian="false";
    var openid = wx.getStorageSync('openid');
    var name = e.detail.value.Name;
    var phone = e.detail.value.Phone;
    var age = e.detail.value.Age;
    var remark = e.detail.value.Remark;
    var guid="";
    var packageid="";
    wx.login({
      success: function (res) {
        if (res.code) {
          if(that.data.gid!="0")
          {
            //参团订单,砍价付款
            wx.request({
              url: common.config.pinpay,
              data: {
                openid: openid,
                gid: that.data.gid,
                grouptype: that.data.types,
                name: name,
                phone: phone,
                price: that.data.gprice,
                province: wx.getStorageSync('province'),
                city: wx.getStorageSync('city'),
                address: wx.getStorageSync('address'),
                age:age,
                remark:remark
              },
              method: 'GET',
              success: function (res) {
                packageid = res.data.package;
                wx.requestPayment({
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: 'MD5',
                  paySign: res.data.paySign,
                  success: function (res) {
                    // 支付成功
                    if (that.data.co == "1" || that.data.coursetype == "4")
                    {
                      if (that.data.co == "1")
                      {
                        wx.request({
                          url: common.config.TsGroupBooking,
                          data: {
                            gid: that.data.gid
                          },
                          method: 'POST',
                          header: {
                            'content-type': 'application/json'
                          },
                          success: function (res) {
                            console.log(res);
                          }
                        });
                      }
                      wx.redirectTo({
                        url: "../success/success?gid=" + that.data.gid
                      });
                      
                    }else{
                      wx.navigateTo({
                        url: "../OnGroup/OnGroup?gid=" + that.data.gid+"&kid=0"
                      })
                    }
                  },
                  fail: function (res) {
                    that.DeleteGroupOrder(openid);
                    // 失败或取消
                    console.log(res);
                  },
                  complete: function (res) {
                    // 成功或取消都会进入该方法
                  }
                })
              }
            });
          }
          else{
            //开团订单
            wx.request({
              url: common.config.pay,
              data: {
                openid: openid,
                cid: that.data.kid,
                grouptype: that.data.types,
                name: name,
                phone: phone,
                price: that.data.gprice,
                province: wx.getStorageSync('province'),
                city: wx.getStorageSync('city'),
                address: wx.getStorageSync('address'),
                age: age,
                remark: remark
              },
              method: 'GET',
              success: function (res) {
                wx.setStorageSync("packageid", res.data.package);
                packageid = res.data.package;
                wx.requestPayment({
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: 'MD5',
                  paySign: res.data.paySign,
                  success: function (res) {
                    // 支付成功
                    if (that.data.types=="0")
                    {
                      wx.redirectTo({
                        url: "../success/success?gid=0&ctype=" + that.data.coursetype
                      })
                    }
                    else{
                      wx.navigateTo({
                        url: "../OnGroup/OnGroup?gid=0&kid=" + that.data.kid
                      })
                    }
                  },
                  fail: function (res) {
                    that.DeleteGroupOrder(openid);
                    // 失败或取消
                  },
                  complete: function (res) {
                    // 成功或取消都会进入该方法
                    
                  }
                })
              }
            });
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    }
  },
  DeleteGroupOrder(openid)
  {
    zhidian = "true";
    var that=this;
    wx.request({
      url: common.config.DeleteGroupOfgidOrcidAndopenid,
      data: { cid: that.data.kid, gid: that.data.gid, openid: openid },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result) {
          // common.modalTap('您的订单已取消');
          // wx.navigateBack({
          //   delta:1
          // })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
   var gid = "0";
   var openid = wx.getStorageSync('openid');
   if (openid == null || openid == "") {
     common.GetOpenId();
   }
   if (options.gid!=undefined)
   {
     gid = options.gid;
   }
   var co=options.co;
   var id=options.kid;
   var types=options.types;
   wx.request({
     url: common.config.GetUpdateCourse,
     data: {
       id: id
     },
     method: 'POST',
     header: {
       'content-type': 'application/json'
     },
     success: function (res) {
       if (res.data.result) {
         var model = res.data.modle;
         var gp = model.GroupPrice;
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
         var sp = model.sPrice;
         sp = sp.toFixed(2);
         var ggp = model.GroupPrice;
         var rrp = model.RetailPrice;
         if(types=="0")//单独购买
         {
           ggp = model.RetailPrice;
           rrp = model.GroupPrice;
         }
         if (model.Type == 4)
         {
           if (types=="11")
           {
             ggp = model.OriginalPrice;
             rrp = model.OriginalPrice;
             types="0";
           }
           if (types == "22")
             ggp = model.RetailPrice;
             rrp = model.OriginalPrice;
           if (types == "33")
             ggp = model.GroupPrice;
             rrp = model.OriginalPrice;
         }
         var name=null;
         var phone=null;
         wx.request({
           url: common.config.GetNameAndPhoneOfOpenId,
           data:{openid:openid},
           method: 'POST',
           header: {
             'content-type': 'application/json'
           },
           success:function(res){
             if (res.data.result)
             {
               name=res.data.name;
               phone=res.data.phone;
               if(phone=="0")
               {
                 phone="";
               }
             }
             if (model.Title.length > 20) {
               model.Title = model.Title.substr(0, 19) + '...';
             }
             that.setData({
               kid: id,
               img: common.config.CoursePath + model.PicturePath,
               title: model.Title,
               gprice: ggp,
               oprice: model.OriginalPrice,
               rprice: rrp,
               types: types,
               wtime: model.WaitTime,
               ucount: model.ParticipateCount,
               op: op,
               gp: gp,
               gid: gid,
               co: co,
               sp: sp,
               name: name,
               pphone: phone,
               coursetype:model.Type
             });
           }
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
    zhidian = "true";
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  kecheng:function(e){
    var id=this.data.kid;
    var ctype = this.data.coursetype;
    if(ctype=="1") //拼团课程
    {
      wx.navigateTo({
        url: '../Detail/Detail?yu=0&id=' + id,
      });
    }
    else if (ctype == "4")//砍价课程
    {
      wx.navigateTo({
        url: '../Onebargaining/Onebargaining?cid=' + id + "&yu=0"
      });
    }
    else if (ctype == "5") {//一元课程
      wx.navigateTo({
        url: '../YiYuan/YiYuan?id=' + id + "&yu=0&oid=0"
      });
    }
    else if (ctype == "6") {//答题课程
      
    }
  }
})