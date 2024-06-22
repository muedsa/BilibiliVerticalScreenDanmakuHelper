// ==UserScript==
// @name         BilibiliVerticalScreenDanmakuHelper
// @version      0.0.1
// @namespace    https://www.muedsa.com
// @description  为竖屏适配全屏视频时的弹幕
// @author       MUEDSA
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://raw.githubusercontent.com/muedsa/BilibiliVerticalScreenDanmakuHelper/main/index.js
// @updateURL https://raw.githubusercontent.com/muedsa/BilibiliVerticalScreenDanmakuHelper/main/index.js
// ==/UserScript==

(function() {
    'use strict';
    const logName = '[BilibiliVerticalScreenDanmakuHelper]';
    const isLivePage = window.location.href.indexOf('https://live.bilibili.com') >= 0;
    function logInfo(...args) {
        console.log(logName, ...args);
    }
    function logWarn(...args) {
        console.warn(logName, ...args);
    }
    function logError(...args) {
        console.error(logName, ...args);
    }

    function fitDanmakuArea() {
        let dmWrapEl;
        logInfo('isLivePage', isLivePage);
        if (isLivePage) {
            dmWrapEl = document.querySelector('.web-player-danmaku');
        } else {
            dmWrapEl = document.querySelector('.bpx-player-row-dm-wrap');
        }
        if(dmWrapEl) {
            const areaWidth = dmWrapEl.clientWidth;
            const areaHeight = dmWrapEl.clientHeight;
            const isVertical = areaHeight > areaWidth;
            const videoAspectRatio = (window?.__INITIAL_STATE__?.videoData?.dimension?.width || 16) / (window?.__INITIAL_STATE__?.videoData?.dimension?.height || 9);
            if (isVertical) {
                logInfo('fullscreen player is vertical');
                const danmakuAreaHeight = areaWidth / videoAspectRatio;
                if(danmakuAreaHeight < areaHeight) {
                    dmWrapEl.style.top = ((areaHeight - danmakuAreaHeight) / 2).toFixed(0) + 'px';
                    dmWrapEl.style.height = danmakuAreaHeight.toFixed(0) + 'px';
                }
            }
        } else {
            logWarn('not found danmaku warp element');
        }

    }

    function resetDanmakuArea() {
        let dmWrapEl;
        if (isLivePage) {
            dmWrapEl = document.querySelector('.web-player-danmaku');
        } else {
            dmWrapEl = document.querySelector('.bpx-player-row-dm-wrap');
        }
        if(dmWrapEl) {
            dmWrapEl.style.top = '';
            dmWrapEl.style.height = '';
        }
    }

    document.addEventListener('fullscreenchange', (event) => {
        const targetEl = event.target
        if(document.fullscreenElement && document.fullscreenElement === targetEl) {
            console.log('fullscreenElement', targetEl);
            if(targetEl.classList.contains('bpx-player-container') || targetEl.id === 'live-player') {
                fitDanmakuArea();
            } else {
                resetDanmakuArea();
            }
        }
    });
})();
