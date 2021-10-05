(function(){
    var page = 1,
        size = 3;
    var totalAmount = null;
    var obj = {}
    var init = function(){
        initList()//表格数据获取
        initEvent()//事件初始化
    }
    // 1、表格数据获取
    var initList = function(){
        ajax({
            url: "https://api.duyiedu.com/api/student/findByPage",
            type: "get",
            params: {
                appkey: "0124016_1625280309812",
                page: page,
                size: size
            },
            success: function(res){
                res = JSON.parse(res);
                console.log(res);
                totalAmount = res.data.cont;
                renderTable(res.data.findByPage);//渲染表格
                renderPage();//渲染分页
            }
        })
    }
    // 2、渲染表格
    var renderTable = function(dataArr){
        var tableArr = [];
        dataArr.forEach(function(ele){
            tableArr.push(
                `<tr>
                    <td>`+ ele.sNo +`</td>
                    <td>`+ ele.name +`</td>
                    <td>`+ (new Date().getFullYear() - ele.birth) +`</td>
                    <td>`+ (ele.sex == 0? '男':'女') +`</td>
                    <td>`+ ele.phone +`</td>
                    <td>`+ ele.email +`</td>
                    <td>`+ ele.address +`</td>
                    <td> <span uId="`+ ele.sNo +`"class="edit" index="0">编辑</span> <span uId="`+ ele.sNo +`" class="del" index="0">删除</span> </td>
                </tr>`
            )
            obj[ele.sNo] = ele;
        })
        tableContainer.innerHTML = tableArr.join("")
    }
    // 3、渲染分页
    var renderPage = function(){
        var pageAmount = Math.ceil(totalAmount / size)
        var pageArr = []
        for(var i=1;i<=pageAmount;i++){
            pageArr.push('<div class="page-item ">'+ i +'</div>')
        }
        paginationContainer.innerHTML = pageArr.join("")
        addPageActive()//添加当前分页的选中状态
    }
    // 4、添加当前分页的选中状态
    var addPageActive = function(){
        for(var i=0;i<paginationContainer.children.length;i++){
            if(page-1 == i){
                paginationContainer.children[i].classList.add("active")
            }
        }
    }
    // 5、事件初始化
    var initEvent = function(){
        // 分页点击事件
        paginationContainer.addEventListener('click',pageClick)
        // 前后箭头点击事件
        document.querySelectorAll('.icon').forEach(function(ele){
            // querySelectorAll()具有forEach()方法
            ele.addEventListener('click',arrowClick)
        })
        // 表格操作点击事件（编辑删除）
        tableContainer.addEventListener('click', tableClick)
        // 添加数据
        addBtn.addEventListener('click', addData)
        // 导航栏事件
        nav_table()
    }
    //6、分页点击事件
    var pageClick = function(e){
        if(e.target.id == this.id) return;//保证点击到分页外其他地方无效
        if(e.target.innerHTML != page){
            page = e.target.innerHTML;
            initList();
        }
    }
    //7、前后箭头点击事件
    var arrowClick = function(){
        if(this.id=="previous"){
            if(page == 1) return
            --page
            
        }else{
            if(page == paginationContainer.children.length) return
            ++page
        }
        initList()
    }
    //8、表格操作点击事件
    var tableClick = function(e){
        if(e.target.className == "edit"){
            // e.target.addEventListener('click',editTable)//如果这样写就要点击两次
            editTable(e.target)
        }else if(e.target.className == "del"){
            // e.target.addEventListener('click',deleteTable)
            deleteTable(e.target)
        }
    }
    //9、编辑事件
    var editTable = function(dom){
        var uId = dom.getAttribute('uId')
        console.log(obj[uId])
        for(var key in obj[uId]){
            (document.getElementById(key)) && (document.getElementById(key).value = obj[uId][key])
        }
        dialogContainer.style.display = 'block'
        updateBtn.addEventListener('click', updateEdit)
    }
    //10、修改编辑事件
    var updateEdit = function(){
        console.log(name.value,document.getElementById('name').value)//前面为undefined；后面有值
        ajax({
            url: "https://api.duyiedu.com/api/student/updateStudent",
            type: "get",
            params: {
                appkey: "0124016_1625280309812",
                sNo: sNo.value,
                name: document.getElementById('name').value,
                sex: sex.value,
                birth: birth.value,
                phone: phone.value,
                address: address.value,
                email: email.value
            },
            success: function(res){
                res = JSON.parse(res)
                alert(res.msg)
                dialogContainer.style.display = 'none'
                initList()
            }
        })
    }
    //11、删除事件
    var deleteTable = function(dom){
        uId = dom.getAttribute('uId');
        var isConfirm = confirm('确认是否删除')
        if(!isConfirm) return
        ajax({
            url: "https://api.duyiedu.com/api/student/delBySno",
            type: "get",
            params: {
                appkey: "0124016_1625280309812",
                sNo: uId,
            },
            success: function(res){
                res = JSON.parse(res)
                alert(res.msg)
                if((page-1) * size == totalAmount - 1){
                    --page
                }
                initList()
            }
        })
    }
    // 12、导航栏事件
    var nav_table = function(){
        var navs = $('.nav-ul li'),
            tables = $('.table-ul li');
        var len = navs.length;
        for(var i=0;i<len;i++){
            (function(i){
                navs[i].onclick = function(){
                    for(var j=0;j<len;j++){
                        $(navs[j]).removeClass("nav-active");
                        $(tables[j]).removeClass("table-active");
                    }
                    $(this).addClass("nav-active");
                    $(tables[i]).addClass("table-active");
                }
            })(i)
        }
    }
    // 13、添加数据
    var addData = function(){
        ajax({
            url: "https://api.duyiedu.com/api/student/addStudent",
            type: "get",
            params: {
                appkey: "0124016_1625280309812",
                sNo: userSNo.value,
                name: userName.value,
                sex: userSex.value,
                birth: userBirth.value,
                phone: userPhone.value,
                address: userAddress.value,
                email: userEmail.value
            },
            success: function(res){
                res = JSON.parse(res)
                alert(res.msg)
                initList()
            }
        })
    }
    init()
})()