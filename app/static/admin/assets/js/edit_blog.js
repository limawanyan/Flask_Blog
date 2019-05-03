window.onload = function () {

    var editor = new Quill('#editor-container', {
        modules: { toolbar: '#toolbar' },
        placeholder: '正文内容不少于20个字符,文明用语~',
        theme: 'snow'
    });


    $("#title,#summary,#tags").on("input  propertychange", function () {
        var val = $.trim($(this).find('input').val());
        if (val == "") {
            $(this).addClass("has-error");
            $(this).find('span').removeClass("hidden");
        }
        else {
            if ($(this).hasClass("has-error")) {
                $(this).removeClass("has-error");
            }
            $(this).addClass("has-success");
            $(this).find('span').addClass("hidden");
        }
    });

    $('#cancal').on('click', function () {
        $("#title,#summary,#tags").find('input').val('');
    })


    // WebUploader
    var uploader;
    //在点击弹出模态框的时候再初始化WebUploader，解决点击上传无反应问题
    $("#logoPhotoModal").on("shown.bs.modal", function () {

            uploader = WebUploader.create({

            // swf文件路径
            swf: './webuploader/Uploader.swf',

            // 文件接收服务端。
            server: 'http://webuploader.duapp.com/server/fileupload.php',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        });

    });

    //关闭模态框销毁WebUploader，解决再次打开模态框时按钮越变越大问题
    $('#logoPhotoModal').on('hide.bs.modal', function () {
        uploader.destroy();
    });
    // WebUploader

}