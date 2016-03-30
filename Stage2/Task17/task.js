/**
 * Created by llissery on 2016/3/24.
 */
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(event) {
    // 确定是否选项发生了变化
    var targetGraTime = event.target.value;

    if (targetGraTime != pageState.nowGraTime) {

        // 设置对应数据
        pageState.nowGraTime = targetGraTime;
        initAqiChartData();

        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(event) {
    // 确定是否选项发生了变化

    var targetCity = event.target.value;

    targetCity = targetCity[0] == "-" ? -1 : targetCity;

    if(targetCity != pageState.nowSelectCity){

        // 设置对应数据
        pageState.nowSelectCity = targetCity;
        initAqiChartData();

        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var graTimes = document.getElementsByName("gra-time");

    for (var i=0; i<graTimes.length; i++) {
        graTimes[i].addEventListener("click",graTimeChange);
    }

}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

    var citySelect = document.getElementById("city-select"),
        options = "<option>--请选择--</option>",
        city;

    for(city in aqiSourceData){
        options += "<option>" + city + "</option>";
    }

    citySelect.innerHTML = options;


    // 给select设置事件，当选项发生变化时调用函数citySelectChange

    citySelect.addEventListener("change",citySelectChange);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中

    var time = pageState.nowGraTime,
        city = pageState.nowSelectCity;

    chartData={};

    if (city == -1) return;


    switch (time) {
        case "day":
            chartData = aqiSourceData[city];
            break;

        case "week":
            (function () {
                "use strict";

                var date,
                    day,
                    dateStr,
                    count = 0,
                    total = 0,
                    weekNumber = 1;

                //前几周
                for(dateStr in aqiSourceData[city]){

                    date = new Date(dateStr);
                    day = date.getDay();


                    total += aqiSourceData[city][dateStr];
                    count++;

                    //每周六
                    if (day == 6) {
                        chartData["第" + weekNumber + "周"] = Math.round(total/count);
                        count = 0;
                        total = 0;
                        weekNumber++;
                    }
                }

                //如果最后一周未满7天，新加一周
                if (!count) {
                    chartData["第" + weekNumber + "周"] = Math.round(total/count);
                }

            })();
            break;

        case "month":
            (function () {
                "use strict";

                var dateStr = aqiSourceData[city][0],
                    date = new Date(dateStr),
                    month = date.getMonth(),
                    monthNumber = 1,
                    count = 0,
                    total = 0;

                //前几个月
                for(dateStr in aqiSourceData[city]){

                    date = new Date(dateStr);

                    total += aqiSourceData[city][dateStr];
                    count++;

                    //每到新月份
                    if (date.getMonth() != month) {
                        month = date.getMonth();

                        chartData["第" + monthNumber + "月"] = Math.round(total/count);

                        count=0;
                        total=0;
                        monthNumber++;
                    }
                }

                //处理最后一个月份
                if (!count) {
                    chartData["第" + monthNumber + "月"] = Math.round(total/count);
                }

            })();
            break;

    }

}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();