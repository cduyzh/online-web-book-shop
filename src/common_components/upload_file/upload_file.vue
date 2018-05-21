<template>
    <Upload class="upload-root"
            type="drag"
            :action="qiniuUploadUrl"
            name="file"
            accept="image/*"
            :show-upload-list="false"
            :data="payload"
            :max-size="maxSize"
            :on-progress="onProgress"
            :on-success="onSuccess"
            :on-error="onError"
            :before-upload="beforeUpload">
        <div class="upload-content">
            <Spin v-if="isUploading" fix></Spin>
            <slot v-else></slot>
        </div>
    </Upload>
</template>

<script>
    /**
     * upload-start     -> void
     * upload-preview   -> canvas: DOM
     * upload-progress  -> progress: float
     * upload-success   -> url: string
     * upload-fail      -> errStr: string
     * 七牛文档 https://developer.qiniu.com/kodo/manual/1272/form-upload
     */
    import httpRequestor from 'common_libs/http_requestor'
    import md5 from 'blueimp-md5'

    export default {
        name: 'upload-file',
        data() {
            return {
                isUploading: false,
                // 上传时要一起发到后台的参数
                payload: {},
                qiniuUploadUrl: window.location.protocol === 'http:' ? 'http://upload-na0.qiniu.com' : 'https://upload-na0.qiniu.com',
                tokenServerPath: `${gBaseUrl}/api/msg/gettoken`,
                // 上传完成后文件的下载域名
                domain: '',
            }
        },
        props: {
            openId: {
                type: String,
                default: '.jpg',
            },
            // 上传的图片最大尺寸，单位B
            limit: {
                type: Number,
                default: 2 * 1024 * 1024,
            },
            // 上传的图片最大宽高
            maxSize: {
                type: Number,
                default: 1024,
            },
            // 上传时的文件名后缀名，如'.jpg'。默认无后缀名
            fileExt: {
                type: String,
                default: '',
            },
        },
        methods: {
            initToken() {
                return httpRequestor.post(this.tokenServerPath,{
                    openid: this.openId,
                    bucketname: 'lovechatimg',
                    filekey: this.payload.key
                })
                .then(({domain, uptoken}) => {
                    console.log(111,{domain, uptoken})
                    this.domain = domain
                    this.payload.token = uptoken
                })
            },
            onProgress(evt) {
                console.log(`progress: ${evt.percent}`);
                this.$emit('upload-progress', evt.percent);
            },
            onSuccess(response) {
                const imgLink = `${this.domain}/${response.key}`
                console.log(`get url ${imgLink}`);
                this.isUploading = false;
                this.$emit('upload-success', imgLink)
            },
            onError(err) {
                console.error(err);
                this.isUploading = false;
                this.$emit('upload-fail', err.message);
            },
            beforeUpload(file) {
                // if (file.type !== 'image/jpeg') {
                //     this.$message.error('只能上传 JPG 格式的图片!');
                //     return false
                // }

                this.isUploading = true
                this.$emit('upload-start')
                return this.makePriviewCanvas(file)
                    .then(() => this.initToken())
                    .then(previewCanvas => this.$emit('upload-preview', previewCanvas))
                // TODO 拼装数据，发送缩放后的图片，以免上传了过大的文件
                // .then(canvasToFile)
            },
            makePriviewCanvas(file) {
                return new Promise((resolve) => {
                    const canvas = document.createElement('canvas');

                    const image = new Image();
                    image.onload = () => {
                        const {width, height} = getNewImageSize(image, this.maxSize)
                        canvas.width = width;
                        canvas.height = height;
                        const context = canvas.getContext('2d');
                        // 将图像绘制到canvas上
                        // TODO 需要带image吗？
                        context.drawImage(image, 0, 0, image.width, image.height);

                        resolve(canvas)
                    };

                    const reader = new FileReader();
                    // 加载图片
                    reader.onload = (e) => {
                        image.src = e.target.result
                            this.payload.key = md5(e.target.result) + this.fileExt
                    }
                    // 读取图片文件
                    reader.readAsDataURL(file);
                })
            },
        },
    }

    function getNewImageSize(image, maxSize) {
        if (maxSize > 0) {
            if (image.height > image.width) {
                // 如果高度超标
                if (image.height > maxSize) {
                    return {width: image.width * maxSize / image.height, height: maxSize}
                }
            } else if (image.width > maxSize) {
                return {width: maxSize, height: image.height * maxSize / image.width}
            }
        }
        return {width: image.width, height: image.height}
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../common_assets/basic_const";

    .upload-root {
        width: auto;
        .ivu-upload, .ivu-upload-drag {
            background: transparent;
            border: none;
            border-radius: 0;
            text-align: center;
            cursor: pointer;
        }
        &.disable-upload {
            pointer-events: none;
        }
    }
</style>
