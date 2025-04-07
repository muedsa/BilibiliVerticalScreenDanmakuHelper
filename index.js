// ==UserScript==
// @name         BilibiliVerticalScreenDanmakuHelper
// @version      0.0.3
// @namespace    https://github.com/muedsa/BilibiliVerticalScreenDanmakuHelper
// @description  为竖屏适配全屏视频时的弹幕
// @author       MUEDSA
// @license      MIT
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/list/watchlater/*
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://raw.githubusercontent.com/muedsa/BilibiliVerticalScreenDanmakuHelper/main/index.js
// @updateURL https://raw.githubusercontent.com/muedsa/BilibiliVerticalScreenDanmakuHelper/main/index.js
// ==/UserScript==

(function() {
    'use strict';
    const logName = '[BilibiliVerticalScreenDanmakuHelper]';
    const isLivePage = window.location.href.indexOf('https://live.bilibili.com') >= 0;
    const playerContainerClass = 'bpx-player-container';
    const danmakuContainerClass = 'bpx-player-row-dm-wrap';
    const livePlayerContainerClass = 'live-player-mounter';
    const liveDanmakuContainerClass = 'web-player-danmaku';

    function logInfo(...args) {
        console.log(logName, ...args);
    }

    function logWarn(...args) {
        console.warn(logName, ...args);
    }

    function logError(...args) {
        console.error(logName, ...args);
    }

    function isFullscreenElementPlayerElement(element) {
        return element
        && (element.classList.contains(playerContainerClass)
            || element.classList.contains(livePlayerContainerClass));
    }

    function getPlayerEl() {
        if (isLivePage) {
            return document.querySelector(`.${livePlayerContainerClass}`);
        } else {
            return document.querySelector(`.${playerContainerClass}`);
        }
    }

    function fitDanmakuContainer() {
        const fullscreenPlayerEl = document.fullscreenElement;
        if (isFullscreenElementPlayerElement(fullscreenPlayerEl)) {
            let danmakuContainerEl;
            if (isLivePage) {
                danmakuContainerEl = fullscreenPlayerEl.querySelector(`.${liveDanmakuContainerClass}`);
            } else {
                danmakuContainerEl = fullscreenPlayerEl.querySelector(`.${danmakuContainerClass}`);
            }
            if (fullscreenPlayerEl && danmakuContainerEl) {
                const playerWidth = fullscreenPlayerEl.clientWidth;
                const playerHeight = fullscreenPlayerEl.clientHeight;
                const isVertical = playerHeight > playerWidth;
                if (isVertical) {
                    const videoHeight = playerWidth / 16 * 9;
                    const styleTop = ((playerHeight - videoHeight) / 2).toFixed(0);
                    danmakuContainerEl.style.top = `${styleTop}px`;
                    const styleHeight = (playerHeight - styleTop).toFixed(0);
                    danmakuContainerEl.style.height = `${styleHeight}px`;
                    logInfo(`弹幕区域调整 top: ${styleTop}px, height:${styleHeight}px`);
                } else {
                    logInfo('当前视频为横屏，弹幕区域不进行调整');
                }
            }
        }
    }

    function resetDanmakuArea() {
        let danmakuContainerEl;
        if (isLivePage) {
            danmakuContainerEl = document.querySelector(`.${livePlayerContainerClass} .${liveDanmakuContainerClass}`);
        } else {
            danmakuContainerEl = document.querySelector(`.${playerContainerClass} .${danmakuContainerClass}`);
        }
        if(danmakuContainerEl) {
            danmakuContainerEl.style.top = '';
            danmakuContainerEl.style.height = '';
            logInfo('弹幕区域重置');
        }
    }

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fitDanmakuContainer();
        } else {
            resetDanmakuArea();
        }
    });

    logInfo("初始化!");
})();
