/**
 * Created by lnk on 2016/4/23.
 */

/**
 * 是否是我们自己服务器上支持缩略图的头像图片
 * 如 http://m2img.s3.amazonaws.com/8f9f0b03faa12faff6d580bce5bf54f4.jpg
 * @param {string} url
 * @returns {boolean}
 */
exports.isOurServerImageUrl = (url) => {
    return url && (url.includes('//img.hellobyebye.com/'));
};

/**
 * 获取图片缩略图地址
 * @param {string} url
 * @param {int}    thumbSize
 * @returns {string}
 */
exports.getThumbUrl = (url, thumbSize) => {
    if (!url || thumbSize <= 0 || !exports.isOurServerImageUrl(url)) {
        return url;
    }
    // 找到后缀名
    let suffixPos = url.lastIndexOf('.');
    if (suffixPos < 0) {
        return url;
    }

    // 已经是缩略图了
    if (/.+_\d*\.(jpg|png)$/.test(url)) {
        suffixPos = url.lastIndexOf('_');
    }
    return `${url.substring(0, suffixPos)}_${thumbSize}.jpg`;
};

/**
 * 获取图片原图地址
 * @param {string} url
 * @returns {string}
 */
exports.getOrigUrl = (url) => {
    return url && url.replace(/_\d*\.(jpg|png)/, '.$1');
};

exports.get160ThumbUrl = (url) => {
    return exports.getThumbUrl(url, 160);
};

exports.get300ThumbUrl = (url) => {
    return exports.getThumbUrl(url, 300);
};

exports.get640ThumbUrl = (url) => {
    return exports.getThumbUrl(url, 640);
};
