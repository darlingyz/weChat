
var data ={
  MchId: "",
  TitleName:""
}
var QQMapWX = require('libs/qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: '4WABZ-V2ARX-NLS45-T5Q7T-CETWK-KMB7C' // 必填
});
var host = "";
var hot ="localhost:5894";
var config = {

  //下面的地址配合云端 Server 工作
  host,
  //资质证明中图片路径
  LogoPath: `https://${host}/LogoFile/`,
  //课程图片路径
  CoursePath: `https://${host}/CourseImg/`,
  //经销商二维码
  
  disQRFile: `https://${host}/disQRFile/` ,
  //图片路径
  ImgPath: `https://${host}/HtmlImgs/`,
  IconImg: `https://${host}/BannerIcons/`,
  //课程二维码图片路径
  CodePath: `https://${host}/QRFile/`,
  //首页banner路径
  BannersImg: `https://${host}/BannersImg/`,
  //砍价课程海报路径
  GroupImgFile: `https://${host}/GroupImgFile/`,
  //答题课程题目路径
  AnswerQuesImg: `https://${host}/AnswerQuesImg/`,
  //课程卡路径
  CourseCard: `https://${host}/CourseCard/`,
  //首页红包banner
  RedBannerPath: `https://${host}/RedBanner/`,
  //红包活动背景
  RedBackgroundPath: `https://${host}/RedBackground/`,



  //获取用户Openid
  GetOrSetOpenid: `https://${host}/Users/GetSaveUserOpenId`,
  //根据用户openid获取用户信息
  GetUserOfId: `https://${host}/Users/GetUserOfId`,
  //获取首页课程列表
  GetHomeCourseList:`https://${host}/Course/CourseList`,
  //分页获取课程列表
  HomeCourseListOfPage: `https://${host}/Course/HomeCourseListOfPage`,
  //上传资质或Logo
  SaveLicenseLogo: `https://${host}/Users/SaveLicenseLogo`,
  //提交资质证明
  SaveCertification: `https://${host}/Users/SaveCertification`,
  //修改资质证明
  UpdateCertification: `https://${host}/Users/UpdateCertification`,
  //查询用户是否已提交资质并且是否审核
  GetUserCertificationType: `https://${host}/Users/GetUserCertificationType`,
  //根据openid获取资质model
  GetCertificationModel: `https://${host}/Users/GetCertificationModel`,
  //用资质的id获取资质
  GetCertificationOfId: `https://${host}/Users/GetCertificationOfId`,
  //根据openid查询资质证明电话
  GetCertification: `https://${host}/Users/GetCertification`,
  //添加课程图片
  SaveCourseImage: `https://${host}/Course/SaveCourseImage`,
  //添加课程详细描述图片
  SaveCourseXiangImage: `https://${host}/Course/SaveCourseXiangImage`,
  //上传课程
  SaveCourse: `https://${host}/Course/SaveCourse`,
  //获取我所发布的课程
  GetMyCourse: `https://${host}/Course/GetMyCourse`,
  //根据ID删除发布的课程
  DeleteCourse: `https://${host}/Course/DeleteCourse`,
  //根据ID获取发布的课程
  GetUpdateCourse: `https://${host}/Course/GetCourse`,
  //根据课程ID获取课程信息以及可拼团的信息
  GetCourseAndGrop: `https://${host}/Course/GetCourseAndGrop`,
  //修改发布的课程
  UpdateCourse: `https://${host}/Course/UpdateCourse`,
  //将课程发布等待审核
  FabuCourse: `https://${host}/Course/UpdateCourseStatus`,
  //生成并返回二维码
  SaveQRImg: `https://${host}/QR/SaveInitQrCode`,
  //根据课程id查询所有拼团
  GetGropuBookingListOfCid: `https://${host}/GroupBooking/GetGropuBookingListOfCid`,
  //根据团购Id获取团购信息
  GetGropuBookingOfId: `https://${host}/GroupBooking/GetGropuBookingOfId`,
  //根据openId获取团购信息
  GetGropuBookingOfOpenId: `https://${host}/GroupBooking/GetGropuBookingOfOpenId`,
  //拼团成功后跳转等待页面获取信息
  GetGropuBookingOfOpenIdAndKid: `https://${host}/GroupBooking/GetGropuBookingOfOpenIdAndKid`,
  //根据openid获取我所报名的所有课程
  GetMyGroupCourse: `https://${host}/GroupBooking/GetMyGroupCourse`,
  GetMyIndexCoursesNew: `https://${host}/GroupBooking/GetMyIndexCourses`,
  //获取“我”中的红包、优惠券、分销员信息 
  GetMyIndexInfo: `https://${host}/GroupBooking/GetMyIndexInfo`,
  //根据openid获取用户最后一个报名的课程Id
  GetGroupIdOfOpenId: `https://${host}/GroupBooking/GetGroupIdOfOpenId`,
  //根据openid获取之前拼团填写的姓名和电话
  GetNameAndPhoneOfOpenId: `https://${host}/GroupBooking/GetNameAndPhoneOfOpenId`,
  //根据openid获取我的收入明细
  GetRevenueList: `https://${host}/TiXian/GetRevenueList`,
  //根据openid获取剩余可提现的金额
  GetOutPrice: `https://${host}/TiXian/GetOutPrice`,
  //添加提现信息
  InsertReven: `https://${host}/TiXian/InsertReven`,
  //查询首页banner图
  GetHomeBanners: `https://${host}/Banners/GetHomeBanners`,

  //下拉刷新砍价
  GetGidOfCidAndOpenId: `https://${host}/GroupBooking/GetGidOfCidAndOpenId`,
  //添加砍价
  InsertKanGroupBooking: `https://${host}/GroupBooking/InsertKanGroupBooking`,
  //根据砍价ID获取详细
  GetKanGropAndCourse: `https://${host}/GroupBooking/GetKanGropAndCourse`,
  //好友点击进入帮忙砍价
  KanGropOfGid: `https://${host}/GroupBooking/KanGropOfGid`,
  //根据课程ID获取详细和猜你喜欢
  GetKanGropOfCourseId: `https://${host}/GroupBooking/GetKanGropOfCourseId`,
  //答题后添加订单
  InsertGroupAnswer: `https://${host}/GroupBooking/InsertGroupAnswer`,
  //答题后领取课程
  LingOrderCard: `https://${host}/GroupBooking/LingOrderCard`,
  //获取小程序商户信息
  GetAdminmodel: `https://${host}/Home/GetAdminmodel`,

  //根据商户号获取首页红包banner活动
  GetRedBanner: `https://${host}/RedEnvelope/GetRedBanner`,
  //根据红包Id获取红包信息
  GetRedBannerOfRid: `https://${host}/RedEnvelope/GetRedBannerOfRid`,
  //添加拆分红包
  InsertEnvelopeSplits: `https://${host}/RedEnvelope/InsertEnvelopeSplits`,
  //好友拆分红包
  InsertEnvelopeSplitsUsers: `https://${host}/RedEnvelope/InsertEnvelopeSplitsUsers`,
  //根据红包拆分Id获取红包及拆分信息
  GetRedBannerOfEsid: `https://${host}/RedEnvelope/GetRedBannerOfEsid`,
  //获取商户的可用红包课程
  GetRedCourseList: `https://${host}/RedEnvelope/GetRedCourseList`,
  //获取我的红包列表
  GetMyRedList: `https://${host}/RedEnvelope/GetMyRedList`,
  GetMyRedPockets: `https://${host}/RedEnvelope/GetMyRedPockets`,

  //添加优惠券助力订单
  InsertCouponsSplits: `https://${host}/Coupons/InsertCouponsSplits`,
  //根据id csid获取优惠券及助力订单信息
  GetCouponsBannerOfCid: `https://${host}/Coupons/GetCouponsBannerOfCid`,
  //好友助力
  InsertCoupSplitsUsers: `https://${host}/Coupons/InsertEnvelopeSplitsUsers`,
  //优惠券列表
  //GetCouponsCourseList: `https://${host}/Coupons/GetCouponsCourseList`,
  //我的优惠券列表
  GetMyCoupList: `https://${host}/Coupons/GetMyRedList`,
  //优惠课程列表
  GetCouponsCourseList: `https://${host}/Coupons/GetCouponsCourseList`,
  //领取优惠券
  LinCouponsSplits: `https://${host}/Coupons/LinCouponsSplits`,

  //微信支付
  pay: `https://${host}/Pay/SavePay`, 
  pinpay: `https://${host}/Pay/SavePingPay`,
  GetTransactionId: `https://${host}/Pay/GetTransactionId`,
  DeleteGroupOfgidOrcidAndopenid: `https://${host}/GroupBooking/DeleteGroupOfgidOrcidAndopenid`,

  //消息推送
  SendTempletMessge: `https://${host}/TS/SendTempletMessge`,
  TsGroupBooking: `https://${host}/GroupBooking/TsGroupBooking`,

  // 添加经销商申请
  ApplyJingXiaoShang: `https://${host}/Distributors/InsertDistributors`,
  //我的分销课程
  Distributionofcourse: `https://${host}/Distributors/GetMyDistributorsCenter`,
  // 申请提交状态
  ApplyStyle: `https://${host}/Distributors/GetDistributorsOfOpenid`,
  //佣金明细
  YongJingMinXi: `https://${host}/Distributors/GetDistributorsRecordList`,
  // 营收金额明细
  YinShouJinE: `https://${host}/Distributors/GetDistributorsOrderList`,
  // 浏览次数商品
  LiuLanCiShu: `https://${host}/Distributors/InsertBrowsingRecord`,
  // 购买人数
  GouMaiRen: `https://${host}/Distributors/GetDistributorsOrderUsersCount`,
  // 浏览人数查看
  LIUChaKan: `https://${host}/Distributors/GetBrowsingRecordList`,
  GetBrowsingRecordListNew: `https://${host}/Distributors/GetBrowsingRecordListNew`,
  // 营收订单详情
  revenuelist: `https://${host}/Distributors/GetDistributorsOrderOfId`,
  //编辑
  editAll: `https://${host}/Distributors/GetDistributorsCourseOfId`,
  // 保存
  editpreservation: `https://${host}/Distributors/UpdateDistributorsCouresPrice`,

    //获取首页Tag
  GetToolModule: `https://${host}/AdminsTools/GetToolModule`,
  GetNewToolModules: `https://${host}/AdminsTools/GetNewToolModules`,
  GetRecomCourseList: `https://${host}/AdminsTools/GetRecomCourseList`,
    //根据首页Tag获取课程
  GetCourseOfTools: `https://${host}/AdminsTools/GetCourseOfTools`,
    //新版Tab获取红包或优惠券活动
  GetHuoDong: `https://${host}/AdminsTools/GetHuoDong`,

  //根据商户号已经课程类型获取课程红包活动
  GetCurrOfMchId: `https://${host}/Course/GetCurrOfMchId`,
  //添加分享人记录或浏览首页记录
  InsertColonelOpenIdShare: `https://${host}/Course/InsertColonelOpenIdShare`
};
function modalTap(data) {  //弹出提示框
  wx.showModal({
    title: "提示信息",
    content: data,
    showCancel: false,
    confirmText: "确定"
  });
}

function loading(data, msg) {
  wx.showToast({
    title: msg,
    icon: "loading",
    duration: data
  })
}

function DoSuccess(data) {
  wx.showToast({
    title: data,
    icon: "success",
    duration: 2000
  })
}

function IsOpenId()
{
  var openid=wx.getStorageSync("openid");
  if(openid==""||openid==null)
  {
    GetOpenId();
  }
}

function GetOpenId(){
  wx.login({
    success: function (res){
      if (res.code) {
        //获取code
        wx.setStorageSync('Code', res.code);
        var openid = wx.getStorageSync('openid');
        if (openid == null || openid == "") {
          wx.getUserInfo({
            success: function (res) {
              var s = JSON.parse(res.rawData);
              var nickName = s.nickName;//昵称
              var avatarUrl = s.avatarUrl;//头像
              wx.setStorageSync("nickName", s.nickName);//昵称
              wx.setStorageSync("avatarUrl", s.avatarUrl);//头像
              //console.log('code=' + wx.getStorageSync('Code') + '; name=' + nickName + '; img=' + avatarUrl + '; mchid=' + data.MchId);
              wx.request({
                url: config.GetOrSetOpenid,
                data: {
                  code: wx.getStorageSync('Code'),
                  name: nickName,
                  img: avatarUrl,
                  mchid: data.MchId
                },
                header: {
                  'content-type': 'application/json'
                },
                method: 'POST',
                success: function (res) {
                  //console.log(res.data)
                  if (res.data.result) {
                    dingwei();
                    wx.setStorageSync('openid', res.data.openid);
                  }
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    },
    fail: function (res) { //用户无授权时
      that.setData({
        getUserInfoFail: true
      })
    }
  });
}

function Getnameandhead()
{
  wx.login({
    success: function (res) {
      if (res.code) {
          wx.getUserInfo({
            success: function (res) {
              var s = JSON.parse(res.rawData);
              wx.setStorageSync("nickName", s.nickName);//昵称
              wx.setStorageSync("avatarUrl", s.avatarUrl);//头像
            }
          })
      }
    }
  });
}

function SelectZiZhi()
{
  wx.request({
    url: config.GetUserCertificationType,
    data: {
      adminsid: data.adminsid
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
      if (res.data.result) {
        wx.setStorageSync('useriscompany', 'true');
      }
      else {
        wx.setStorageSync('useriscompany', 'false');
      }
    }
  })
}

function timeStamp2String(time)
{
  var data = time;
  var datetime = new Date(parseInt(data.replace("/Date(", "").replace(")/", ""), 10));
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
  var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
  var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

function timeStamp2StringNian(time) {
  var data = time;
  var datetime = new Date(parseInt(data.replace("/Date(", "").replace(")/", ""), 10));
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  return year + "年" + month + "月" + date + "日";
}

function timeStamp2StringNian2(time) {
  var data = time;
  var datetime = new Date(parseInt(data.replace("/Date(", "").replace(")/", ""), 10));
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  return year + "-" + month + "-" + date;
}

function dizhi(address) {
  demo.geocoder({
    address: address,
    success: function (res) {
      var d = res.result.location;
      var w = d.lat;
      var j = d.lng;
      wx.openLocation({
        latitude: w,
        longitude: j,
        name:address
      })
    },
    fail: function (res) {
      modalTap(res.message);
    },
    complete: function (res) {
      console.log(res);
    }
  });
}

function dingwei(){
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
      demo.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (addressRes) {
          var sheng = addressRes.result.address_component.province;
          var shi = addressRes.result.address_component.city;
          var address = addressRes.result.address;
          wx.setStorageSync("province", sheng);//省缓存
          wx.setStorageSync("city", shi);//市缓存
          wx.setStorageSync("address", address);//地址缓存
        }
      })
    }
  })
}


function Tui(types, gid, ctype){
  //var payid = wx.getStorageSync("packageid")
  //common.modalTap("packageid:" + payid.substr(10));
  wx.request({
    url: config.SendTempletMessge,
    data: {
      type: types, openid: openid, formid: wx.getStorageSync("formId"), id: gid, mchid: data.MchId, ctype: ctype
    },
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
    }
  });
}

function GetNumberTime(){
  var now = new Date();

  var year = now.getFullYear() + "";       //年  
  var month = now.getMonth() + 1 + "";     //月  
  var day = now.getDate() + "";            //日  

  var hh = now.getHours() + "";            //时  
  var mm = now.getMinutes() + "";          //分  
  var ss = now.getSeconds() + "";           //秒  
  return year + month + day + hh + mm + ss;
}

module.exports.config = config
module.exports.data = data
exports.IsOpenId = IsOpenId
exports.GetOpenId = GetOpenId
exports.modalTap = modalTap
exports.DoSuccess = DoSuccess
exports.timeStamp2String = timeStamp2String
exports.timeStamp2StringNian = timeStamp2StringNian
exports.timeStamp2StringNian2 = timeStamp2StringNian2
exports.Getnameandhead = Getnameandhead
exports.loading = loading
exports.SelectZiZhi = SelectZiZhi
exports.dizhi = dizhi
exports.Tui = Tui
exports.dingwei = dingwei
exports.GetNumberTime = GetNumberTime