# Carousel
一个兼容移动端、PC端的React轮播组件

![](./carousel.gif)

## 使用

1.项目使用了style-component,tween-function,raf故需要安装这3个依赖
```sh
npm install styled-components tween-functions requestAnimationFrame raf --save-dev
```
2.直接下载[carousel.js](./pages/carousel.js)于自己的项目中,通过组件方式引用，示例代码如下：
```js
<Carousel>{children}<Carousel/>
```
children就是您需要轮播的图片素材

## API

支持传入属性方式来调整轮播速度，添加上一页/下一页功能

```js
<Carousel speed={300} pagination={true}>{children}<Carousel/>
```
