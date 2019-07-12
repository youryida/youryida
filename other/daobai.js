// http://app.7children.cn:8090/voaBack/wap/bm/index.jsp
// ios10.1.1-weixin  375 600
// Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X; en-us) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 MicroMessenger/5.2.3 BuildCode/95

var ftoken = location.href.match(/app\/bm\/(.+?)\//)[1];
var fschoolId = location.href.match(/schoolId=(\d+)/)[1];
var fparentPhone = 13619598908;
fparentPhone = 18611019389;
function code() {
  var url = `/voaBack/app/bm/sendSmsCode?childName=&childIdCard=&childNation=&childHkAddress=&childHomeAddress=&districtPoliceStation=&parentName=&parentRelation=&parentPhone=${fparentPhone}&parentName2=&parentRelation2=&parentPhone2=&parentWorkAddress=&lyry=&isjdlkh=&isdbh=&schoolId=${fschoolId}&pic=&classType=&smsCode=&token=${ftoken}`;
  console.log("get code", url);
  $.get(url);
}
function go(code) {
  $.post(`/voaBack/app/bm/childBm`, {
    childName: "梁成亦",
    childIdCard: "640106201607229447",
    childNation: "汉族",
    childHkAddress: "宁夏 银川市 金凤区",
    childHomeAddress: "阅海万家F1区13楼1单元1002室",
    districtPoliceStation: "上海西路派出所",
    parentName: "梁道柏",
    parentRelation: "爸爸",
    parentPhone: fparentPhone,
    parentName2: "",
    parentRelation2: "",
    parentPhone2: "15008675418",
    parentWorkAddress: "",
    lyry: "",
    isjdlkh: "否",
    isdbh: "否",
    schoolId: fschoolId,
    pic: "",
    classType: "小班",
    smsCode: code,
    token: ftoken
  });
}
function res() {
  $.get(`/voaBack/app/bm/getBmInfoByIdCard?idcard=640106201607229447`);
}

// 拉验证码
code();
