window.onload = function () {

    // 初始化富文本编辑器
    var editor = new Quill('#editor-container', {
        modules: {toolbar: '#toolbar'},
        placeholder: '正文内容不少于20个字符,文明用语~',
        theme: 'snow'
    });

    //重写图片上传功能
    var toolbar = editor.getModule('toolbar');
    toolbar.addHandler('image', imageUpload);

    function imageUpload(value) {
        //点击图片，则value值为true
        if (value) {
            //创建隐藏的文件上传input
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();
            input.onchange = function () {
                const file = input.files[0];
                //判断文件是否为图片
                if (!/image\/\w+/.test(file.type)) {
                     Swal.fire({
                title: 'Error!',
                text: '只能上传图片格式文件!',
                type: 'error',
                confirmButtonText: 'OK'
            });
                    return false;
                } else {
                    //使用FormData创建键值对数据
                    var fd = new FormData();
                    fd.append('file', file);
                    fd.append('save_type', 'blog');
                    $.ajax({
                        type: 'post',
                        url: '/admin/uploader',
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        data: fd,
                        success: function (result) {
                            //上传成功，准备将图片插入编辑框中
                            if (result.code != "200") {
                                Swal.fire({
                                title: '上传失败!',
                                text: '上传参数出现问题!',
                                type: 'error',
                                confirmButtonText: 'OK'
                            });
                            }
                            else {
                                //取得上传后返回所在的路径
                                var imgUrl = result.data.img;
                                //取得图片应该所在的位置
                                var currentPosition = editor.getSelection();
                                //插入编辑框
                                editor.insertEmbed(currentPosition, 'image', '/static/upload/blog/'+imgUrl);
                                //显示成功提示
                                  Swal.fire({
                                    title: '上传成功',
                                    text: '图片上传成功!',
                                    type: 'success',
                                    confirmButtonText: 'OK'
                                });

                            }
                        },
                        error: function (jqXHR) {
                             Swal.fire({
                                title: '上传失败!',
                                text: '上传参数出现问题!',
                                type: 'error',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
                }
            }
        }
    }


    // 监听输入
    $("#title,#summary,#tags").on("input  propertychange", function () {
        var val = $.trim($(this).find('input').val());
        if (val == "") {
            $(this).addClass("has-error");
            $(this).find('span').removeClass("hidden");
        } else {
            if ($(this).hasClass("has-error")) {
                $(this).removeClass("has-error");
            }
            $(this).addClass("has-success");
            $(this).find('span').addClass("hidden");
        }
    });

    // 清空按钮
    $('#cancal').on('click', function () {
        $("#title,#summary,#tags").find('input').val('');
    })

    // ajax获取所有封面图
    $.ajax({
        type: "post",
        url: "/admin/api/getLogo",
        contentType: "application/json; charset=utf-8",
        data: '',
        dataType: "json",
        async: true,
        success: function (msg) {
            if (msg.data.filename == "") {
                $('#logobox').prepend('<h4 class="text-center">还没有上传封面图哦~</h4>');
            } else {
                $('#selectlogo').attr('src', '/static/upload/logo/' + msg.data.filename[0]);
                for (i in msg.data.filename) {
                    var image = "<img title=\"点击更换封面图\" onclick=\"selectImgPath(this)\" src=\"/static/upload/logo/" + msg.data.filename[i] + " \">";
                    $('#logobox').prepend(image);
                }
                ;
            }
            ;
        },
        error: function (msg) {
            Swal.fire({
                title: 'Error!',
                text: '封面请求出现错误!',
                type: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    // ajax获取所有类别
    $.ajax({
        type: "post",
        url: "/admin/api/getClass",
        contentType: "application/json; charset=utf-8",
        data: '',
        dataType: "json",
        async: true,
        success: function (msg) {
            for (i in msg.data.class) {
                $('#articleclass').append("<option value='" + JSON.parse(msg.data.class[i]).id + "'>" + JSON.parse(msg.data.class[i]).name + "</option>");
            }
            ;

        },
        error: function (msg) {
            Swal.fire({
                title: 'Error!',
                text: '类别请求出现错误!',
                type: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

};

// 选择封面图
function selectImgPath(img) {
    var path = img.src;
    $('#selectlogo').attr('src', path);
    $("#logoPhotoModal").modal('hide');
};