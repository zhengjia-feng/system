(function(){
    var init = function(){
        event_bind()
    }
    var event_bind = function(){
        loginForm.addEventListener('submit', form_submit)
    }
    var form_submit = function(e){
        e.preventDefault()
        if(!userAccount.value.trim() || !userPassword.value.trim()){// trim()为去除两侧的空格
            alert("输入的账号或者密码不能为空")
            return;
        }
        ajax({
            url:"https://api.duyiedu.com/api/student/stuLogin",
            type:"post",
            params:{
                appkey : "0124016_1625280309812",
                account : userAccount.value,
                password : userPassword.value
            },
            success : function(data){
                data = JSON.parse(data)
                console.log(data);
                alert(data.msg)
                if(data.status == "success"){
                    location.assign("../../pages/main/main.html?name=" + userAccount.value)
                }
            }
        })
    }
    init()
})()