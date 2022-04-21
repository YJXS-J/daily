// 获取腾讯时间
function tencentTime() {
    $.ajax({
        // 获取时间(腾讯)
        type: 'GET',
        url: 'https://vv.video.qq.com/checktime?otype=json',
        dataType: 'jsonp',
        success: function (data) {
            getTime(data.t);
        },
    });
}

// 时间戳处理
function getTime(time) {
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var date = new Date(time * 1000);
    var Y = date.getFullYear();
    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var D = date.getDate();
    var h = ('0' + date.getHours()).slice(-2);
    var m = ('0' + date.getMinutes()).slice(-2);
    var s = ('0' + date.getSeconds()).slice(-2);
    var w = date.getDay();
    // 显示时间
    $('.year_box').text(Y);
    $('.month_box').text(M);
    $('.day_box').text(D);
    $('.hour_box').html(h);
    $('.minute_box').html(m);
    $('.seconds_box').html(s);
    $('.week_box').html(
        w == 1
            ? '一'
            : w == 2
            ? '二'
            : w == 3
            ? '三'
            : w == 4
            ? '四'
            : w == 5
            ? '五'
            : w == 6
            ? '六'
            : '日'
    );
    var someTime =
        h >= 23 || h < 1
            ? '子时'
            : h >= 1 && h < 3
            ? '丑时'
            : h >= 3 && h < 5
            ? '寅时'
            : h >= 5 && h < 7
            ? '卯时'
            : h >= 7 && h < 9
            ? '辰时'
            : h >= 9 && h < 11
            ? '巳时'
            : h >= 11 && h < 13
            ? '午时'
            : h >= 13 && h < 15
            ? '未时'
            : h >= 15 && h < 17
            ? '申时'
            : h >= 17 && h < 19
            ? '酉时'
            : h >= 19 && h < 21
            ? '戌时'
            : '亥时';
    $('.someTime').html(someTime);

    var period_box =
        h >= 0 && h < 3
            ? '拂晓'
            : h >= 3 && h < 6
            ? '黎明'
            : h >= 6 && h < 9
            ? '早晨'
            : h >= 9 && h < 12
            ? '上午'
            : h >= 12 && h < 15
            ? '中午'
            : h >= 15 && h < 18
            ? '下午'
            : h >= 18 && h < 21
            ? '晚上'
            : '夜晚';
    $('.period_box').html(period_box);
    if (h < 9 || h > 21) {
        $('.period_box').css('background', 'red');
    } else {
        $('.period_box').css('background', '#00A5FF');
    }
}

// 时间每秒加载一次
setInterval(function () {
    tencentTime();
}, 1000);

// 汇率接口
function exchangeRate(fromCode, toCode) {
    $.ajax({
        type: 'GET',
        url:
            'https://api.it120.cc/gooking/forex/rate?fromCode=' +
            fromCode +
            '&toCode=' +
            toCode +
            '',
        dataType: 'json',
        success: function (data) {
            if (data.data) {
                // 实时汇率
                if (fromCode == 'USD') {
                    $('.usd').html(data.data.rate);
                } else if (fromCode == 'HKD') {
                    $('.hkd').html(data.data.rate);
                } else {
                    $('.jpy').html(data.data.rate);
                }
            }
        },
    });
}

// 初始化汇率值
var fromCode = ['USD', 'HKD', 'JPY'];
var toCode = 'CNY';
for (let i = 0; i < fromCode.length; i++) {
    exchangeRate(fromCode[i], toCode);
}

// 5秒钟请求一次实时汇率
setInterval(function () {
    var fromCode = ['USD', 'HKD', 'JPY'];
    var toCode = 'CNY';
    for (let i = 0; i < fromCode.length; i++) {
        exchangeRate(fromCode[i], toCode);
    }
}, 5000);

// 默认汇率转换值接口
function defaultCurrencyConversion() {
    // 获取输入框的值
    var currency_value = $('#currency_value').val();
    // 获取下拉框的值
    var currency_sel_1 = $('#currency_sel_1').val();
    var currency_sel_2 = $('#currency_sel_2').val();
    exchangeRate2(currency_sel_2, currency_sel_1, currency_value);
}

// 点击转换货币
function currency_convert() {
    defaultCurrencyConversion();
}

// 汇率接口
function exchangeRate2(fromCode, toCode, value) {
    $.ajax({
        type: 'GET',
        url:
            'https://api.it120.cc/gooking/forex/rate?fromCode=' +
            fromCode.slice(-3) +
            '&toCode=' +
            toCode.slice(-3) +
            '',
        dataType: 'json',
        success: function (data) {
            if (data.data) {
                // 汇率计算
                $('.currencyValue2').html(toCode.slice(0, -3));
                $('.currencyValue4').html(fromCode.slice(0, -3));
                $('.currencyValue1').html(value);
                $('.currencyValue3').html(data.data.rate * Number($('#currency_value').val()));

                $('.currencyValue8').html(toCode.slice(0, -3));
                $('.currencyValue6').html(fromCode.slice(0, -3));
                $('.currencyValue5').html(value);
                $('.currencyValue7').html(
                    (
                        (data.data.fromCode / data.data.toCode) *
                        Number($('#currency_value').val())
                    ).toFixed(4)
                );
                console.log(data.data);
            } else {
                // console.log('当前访问用户较多，请稍后再试');
            }
        },
    });
}

// 初始化时间
tencentTime();

// 初始化货币转换
defaultCurrencyConversion();

// 初始化汇率Echarts
var currency_echarts_value1 = 'JPY';
var currency_echarts_value2 = '日元';
currency_echarts(currency_echarts_value1, currency_echarts_value2);

// 初始化默认汇率
var setDef = setInterval(function () {
    defaultCurrencyConversion();
    if ($('.currencyValue1').html() != '0') {
        clearInterval(setDef);
    }
}, 1000);

// 汇率Echarts
function currency_echarts(fromCode, seriesName) {
    // 基于准备好的dom，初始化echarts实例
    var currency_echarts = document.getElementById('currency_echarts');
    // 在容器中初始化图表实例
    var currencyChart = echarts.init(currency_echarts);
    // 设置图表配置和数据
    currencyChart.setOption({
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            },
            confine: true,
        },
        grid: {
            top: '8%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: [],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [],
                name: seriesName,
                type: 'line',
                areaStyle: {},
                // symbol: 'none',
                // sampling: 'lttb',
                // itemStyle: {
                //     color: 'rgb(180, 211, 246)',
                // },
                // areaStyle: {
                //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //         {
                //             offset: 0,
                //             color: 'rgb(113, 161, 255)',
                //         },
                //         {
                //             offset: 1,
                //             color: 'rgb(56, 238, 255)',
                //         },
                //     ]),
                // },
                // 修改颜色
                itemStyle: {
                    color: 'rgb(65, 207, 255)',
                },
            },
        ],
        dataZoom: [
            {
                type: 'inside', // 支持内部鼠标滚动平移
                start: 20,
                end: 80,
                zoomOnMouseWheel: false, // 关闭滚轮缩放
                moveOnMouseWheel: true, // 开启滚轮平移
                moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
            },
        ],
    });
    // 计时器动态更新;
    var xAxisData = [];
    var seriesData = [];
    function currency_echarts_now() {
        $.ajax({
            // 获取时间(腾讯)
            type: 'GET',
            url: 'http://vv.video.qq.com/checktime?otype=json',
            dataType: 'jsonp',
            success: function (data) {
                var date = new Date(data.t * 1000);
                var h = ('0' + date.getHours()).slice(-2);
                var m = ('0' + date.getMinutes()).slice(-2);
                xAxisData.push(h + ':' + m);
                currencyChart.setOption({
                    xAxis: [
                        {
                            data: xAxisData,
                        },
                    ],
                });
            },
        });
        $.ajax({
            type: 'GET',
            url:
                'https://api.it120.cc/gooking/forex/rate?fromCode=' + fromCode + '&toCode=CNY' + '',
            dataType: 'json',
            success: function (data) {
                if (data.data) {
                    // 汇率计算
                    seriesData.push(data.data.rate);
                    currencyChart.setOption({
                        series: [
                            {
                                data: seriesData,
                            },
                        ],
                    });
                } else {
                    seriesData.push(0);
                    currencyChart.setOption({
                        series: [
                            {
                                data: seriesData,
                            },
                        ],
                    });
                }
            },
        });
    }
    currency_echarts_now();
    setInterval(() => {
        currency_echarts_now();
    }, 60000);
}

// echarts目标汇率转换
$('#currency_sel_3').change(function () {
    currency_echarts_value1 = $(this).children('option:selected').val().slice(-3);
    currency_echarts_value2 = $(this).children('option:selected').val().slice(0, -3);
    currency_echarts(currency_echarts_value1, currency_echarts_value2);
});
