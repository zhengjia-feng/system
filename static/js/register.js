(function(){
    var check_status;
    /* 程序入口 */
    var init = function(){
        console.log(666);
        event_bind()
    }
    /* 事件入口函数 */
    var event_bind = function(){
        userName.addEventListener('focus', input_focus)
        userName.addEventListener('blur', input_blur)
        registerForm.addEventListener('submit', form_submit)
    }
    /* 表单提交*/
    var form_submit = function(e){
        e.preventDefault()
        if(check_status){
            alert(check_status)
            return;
        }
        // console.log(userName.value, userAccount.value, userPassword.value, confirmPassword.value);
        ajax({
            url : "https://api.duyiedu.com/api/student/stuRegister",
            type : "post",
            params : {
                appkey : "0124016_1625280309812",
                account : userAccount.value,
                username : userName.value,
                password : userPassword.value,
                rePassword : confirmPassword.value
            },
            success : function(data){
                data = JSON.parse(data);
                console.log(data);
                alert(data.msg);
                if(data.status == "success"){
                    location.href = "../../pages/login/login.html"
                }
            }
        })
    }
    /* 用户名获得焦点事件函数 */
    var input_focus = function(){
        this.className = ""
        tipTxt.style.display = "block"
        errorTxt.style.display = "none"
    }
    /* 用户名失去焦点事件函数 */
    var input_blur = function(){
        this.value = this.value.replace(/\s/g,'')//s表示空白字符
        tipTxt.style.display = "none"
        /* 做验证
            不能为纯数字
            不能超过14位数
            一个汉字可以看作是2个字符
        */
        /* 用户名的检测 */
        check_status = check_username(this.value)
        if(check_status){
            this.className = "red-border"
            errorTxt.style.display = "block"
            errorTxt.innerHTML = check_status
        }
    }
    /* 检测用户名的规则函数 */
    var check_username = function(str){
        var ruleReg = /[a-zA-Z0-9_\u4e00-\u9fa5]/
        var chinese_ruleReg = /[\u4e00-\u9fa5]/ //加g就失效
        var total = 0
        for(var i=0;i<str.length;i++){
            if(!ruleReg.test(str[i])) return "输入字符不合法，请输入数字字母以及汉字"
            chinese_ruleReg.test(str[i])?total+=2:total+=1;
        }
        switch(true){
            case total > 14:
                return "用户名超出14个英文字符或7个汉字";
            case !!Number(str) || Number(str)==0:
                return "不能是纯数字";
        }
    }
    init()
})()