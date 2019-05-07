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
                            } else {
                                //取得上传后返回所在的路径
                                var imgUrl = result.data.img;
                                //取得图片应该所在的位置
                                var currentPosition = editor.getSelection();
                                //插入编辑框
                                editor.insertEmbed(currentPosition, 'image', '/static/upload/blog/' + imgUrl);
                                //显示成功提示
                                Swal.fire({
                                    title: '上传成功',
                                    text: '图片' +
                                        '' +
                                        '上传成功!',
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
    });

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

    // 预览按钮点击事件
    $('#previewbtn').on('click', function () {
        if (norm_checking()) {
            let title = $('#editor-title').val().trim();
            let tags = $('#editor-tags').val();
            let content = editor.container.firstChild.innerHTML;
            let tags_list = tags.split(';');
            $('#preview-title').text(title);
            $('#preview-actype').text($('#articleclass option:selected').text());
            $('#preview-time').text('发布日期:' + new Date().Format("yyyy-MM-dd"));
            $('#preview-uptime').text('博文最后更新时间:' + new Date().Format("yyyy年MM月dd日 HH时mm分ss秒"));
            $('.blog-content').html(content);
            $("#previewModal").modal('show');
            $('.items').find('a').remove();

            for (i in tags_list) {
                if (tags_list[i] != '') {
                    $('.items').append('<a href="#">' + tags_list[i] + '</a>');
                }
                ;
            }

            $('.blog-content').find('img').addClass('img-responsive');

            tags_color_range();

        } else {

            Swal.fire({
                title: 'Error!',
                text: '请填写规范后预览!',
                type: 'error',
                confirmButtonText: 'OK'
            });

        }
    });

    // 填写规范验证
    function norm_checking() {
        let title = $('#editor-title').val().trim();
        let summary = $('#editor-summary').val().trim();
        let tags = $('#editor-tags').val();
        let content = editor.container.firstChild.innerHTML;
        if (title == '' || summary == '' || tags == '' || content == '' || summary.length < 20 || content.length < 20) {
            return false;
        }

        return true;
    }

    function tags_color_range() {
        // 标签颜色随机
        len = $(".blog_ui_tags .items a").length - 1;
        $(".blog_ui_tags .items a").each(function (i) {
            var let = new Array('27ea80', '3366FF', 'ff5473', 'df27ea', '31ac76', 'ea4563', '31a6a0', '8e7daa', '4fad7b', 'f99f13', 'f85200', '666666');
            var random1 = Math.floor(Math.random() * 12) + 0;
            var num = Math.floor(Math.random() * 5 + 12);
            $(this).attr('style', 'background:#' + let[random1] + '; opacity: 0.9;' + '');
            if ($(this).next().length > 0) {
                last = $(this).next().position().left
            }
        });
    };

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    // 发布或保存为草稿
    $('#saverelease,#savedraft').on('click', function () {
        if (norm_checking()) {
            let title = $('#editor-title').val().trim();
            let summary = $('#editor-summary').val().trim();
            let tags = $('#editor-tags').val();
            let content = editor.container.firstChild.innerHTML;
            let flag = $(this).data("type");
            let acid = $('#articleclass option:selected').val();
            let logo = $('#selectlogo').attr('src');
            $.ajax({
                type: "post",
                url: "/admin/api/saveBlog",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    'title': title,
                    'summary': summary,
                    'tags': tags,
                    'content': content,
                    'flag': flag,
                    'acid': acid,
                    'logo': logo
                }),
                dataType: "json",
                async: true,
                success: function (data) {
                    if (data.code = "200") {
                        if (flag == "1") {
                            Swal.fire({
                                title: '博文发布成功!',
                                text: '博文已发布成功,可前往前台首页查看O(∩_∩)O~~',
                                type: 'success',
                                confirmButtonText: 'OK'
                            });
                            $("#previewModal").modal('hide');
                        } else {
                            Swal.fire({
                                title: '已保存为草稿!',
                                text: '博文已存入草稿箱,可前往草稿箱查看O(∩_∩)O~~',
                                type: 'success',
                                confirmButtonText: 'OK'
                            });
                        }
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: '博文已存入草稿箱,可前往草稿箱查看O(∩_∩)O~~',
                            type: data.message,
                            confirmButtonText: 'OK'
                        });
                    }

                },
                error: function (data) {
                    Swal.fire({
                        title: 'Error!',
                        text: '请求出现错误!',
                        type: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });

        } else {
            Swal.fire({
                title: 'Error!',
                text: '请填写规范后预览!',
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


