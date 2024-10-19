'use strict';
$(document).ready(function() {
    setTimeout(function() {
        

        let derivedTLR = calculateDerivedTLR();
        
        // Check for the element and set its content
        const tlrElement = document.getElementById("tlr-value");
        if (tlrElement) {
            tlrElement.textContent = parseFloat(derivedTLR.value).toFixed(2); // Assuming 'tlr_value' is returned
        } else {
            console.error("TLR element not found");
        }

        let derivedGO = calculateDerivedGO();
        
        // Check for the element and set its content
        const goElement = document.getElementById("go-value");
        if (goElement) {
            goElement.textContent = parseFloat(derivedGO.value).toFixed(2); // Assuming 'tlr_value' is returned
        } else {
            console.error("GO element not found");
        }

        let derivedOI = calculateDerivedOI();
        
        // Check for the element and set its content
        const oiElement = document.getElementById("oi-value");
        if (oiElement) {
            oiElement.textContent = parseFloat(derivedOI.value).toFixed(2); // Assuming 'tlr_value' is returned
        } else {
            console.error("OI element not found");
        }

        let derivedPP = calculateDerivedPP();
        
        // Check for the element and set its content
        const ppElement = document.getElementById("pp-value");
        if (ppElement) {
            ppElement.textContent = parseFloat(derivedPP.value).toFixed(2); // Assuming 'tlr_value' is returned
        } else {
            console.error("PP element not found");
        }

        let derivedRPP = calculateDerivedRPP();
        
        // Check for the element and set its content
        const rppElement = document.getElementById("rpp-value");
        if (rppElement) {
            rppElement.textContent = parseFloat(derivedRPP.value).toFixed(2); // Assuming 'tlr_value' is returned
        } else {
            console.error("RPP element not found");
        }

        // Generate suggestions based on calculated values
        let suggestions = calculateSuggestions();

        // Find the suggestion list element in the HTML
        const suggestionList = document.getElementById("suggestions-list");

        // Check if the suggestionList element exists
        if (suggestionList) {
            // Clear any existing suggestions before adding new ones
            suggestionList.innerHTML = "";

            // Add each suggestion as a list item to the <ol>
            suggestions.forEach(suggestion => {
                if (suggestion) {  // Ensure it's not an empty suggestion
                    let li = document.createElement("li");
                    li.textContent = suggestion;
                    suggestionList.appendChild(li);
                }
            });
        } else {
            console.error("Suggestion list element not found.");
        }


        // [ basic-bar-chart ] Start
        var dom = document.getElementById("chart-Bar-besic-bar");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        option = {
            title: {
                text: 'NIRF Parameters',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            
            color: ["#055160", "#FF425C"],
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'value',
                boundaryGap: [0, 0.01]
            }],
            yAxis: [{
                type: 'category',
                data: ['TLR', 'RPP', 'GO', 'OI','PP']
            }],
            series: [{
                    name: 'parameters',
                    type: 'bar',
                    data: [derivedTLR.value, derivedRPP.value, derivedGO.value, derivedOI.value,derivedPP.value]
                }
            ]
        };
        myChart.setOption(option, true);
        // [ basic-bar-chart ] end


        // [ basic-pie-chart ] start
        var dom = document.getElementById("chart-pie-basic");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        option = {
            title: {
                text: 'Teaching, Learning & Resources',
                subtext: 'Percent wise contribution',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['Student Strength', 'Faculty Student Ratio', 'Combined metric with Faculty with PhD & Experience', 'Financial Resources & Utilisation']
            },
            color: ['#13bd8a', '#FF425C', '#FF9764', '#463699', '#19BCBF'],
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: true,
            series: [{
                name: 'TLR',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [{
                        value: calculateDerivedValuestlr().student_strength,
                        name: 'Student Strength'
                    },
                    {
                        value: calculateDerivedValuestlr().faculty_student_ratio,
                        name: 'Faculty Student Ratio'
                    },
                    {
                        value: calculateDerivedValuestlr().fq + calculateDerivedValuestlr().fe,
                        name: 'Combined metric with Faculty with PhD & Experience'
                    },
                    {
                        value: calculateDerivedValuestlr().this_year_fru,
                        name: 'Financial Resources & Utilisation'
                    }
                ]
            }]
        };
        myChart.setOption(option, true);
        // [ basic-pie-chart ] end

        // [ Doughnut -pie-chart ] start
        var dom = document.getElementById("chart-pie-doughnut");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        option = {
            title: {
                text: 'NIRF Parameter Disctribution ',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['TLR', 'RPP', 'GO', 'OI','PP']
            },
            color: ['#13bd8a', '#FF425C', '#FF9764', '#463699', '#19BCBF'],
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: true,
            series: [{
                name: 'NIRF',
                type: 'pie',
                radius: ['50%', '70%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'bold'
                            }
                        }
                    }
                },
                data: [{
                    value: derivedTLR.value,
                    name: 'TLR'
                },
                {
                    value: derivedRPP.value,
                    name: 'RPP'
                },
                {
                    value: derivedGO.value,
                    name: 'GO'
                },
                {
                    value: derivedOI.value,
                    name: 'OI'
                },
                {
                    value: derivedPP.value,
                    name: 'PP'
                }
                ]
            }]
        };
        myChart.setOption(option, true);
        // [ Doughnut -pie-chart ] end

       

//[tlr bar-chart]start

var chartDom = document.getElementById('tlr-bar-chart');
var myChart = echarts.init(chartDom);
var option;

// prettier-ignore
let dataAxis =  ['Student Strength', 'FSR', 'FQE', 'FRU'];
// prettier-ignore
let data = [calculateDerivedValuestlr().student_strength, calculateDerivedValuestlr().faculty_student_ratio, calculateDerivedValuestlr().fq + calculateDerivedValuestlr().fe, calculateDerivedValuestlr().this_year_fru];
let yMax = 500;
let dataShadow = [];
for (let i = 0; i < data.length; i++) {
  dataShadow.push(yMax);
}
option = {
  title: {
    text: 'Teaching, Learning & Resources',
    subtext: ''
  },
  xAxis: {
    data: dataAxis,
    axisLabel: {
      inside: true,
      color: '#fff'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  tooltip: {
    trigger: 'item',
    formatter: "{b} : {c}"
},
  series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        barBorderRadius: [10, 10, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#e06666' },
            { offset: 0.7, color: '#e06666' },
            { offset: 1, color: '#f39b9b' }
          ])
        }
      },
      data: data
    }
  ]
};
// Enable data zoom when user click bar.
const zoomSize = 6;
myChart.on('click', function (params) {
  console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
  myChart.dispatchAction({
    type: 'dataZoom',
    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
    endValue:
      dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
  });
});

option && myChart.setOption(option);

// [tlr bar-chart end]



//[rpp bar-chart]start

var chartDom = document.getElementById('rpp-bar-chart');
var myChart = echarts.init(chartDom);
var option;

// prettier-ignore
let dataAxis1 = ['Combined metric for Publications (PU)', 'Combined metric for Quality of Publications (QP)'];
// prettier-ignore
let data1 = [calculateDerivedPublications().combined_metric_pu,calculateDerivedPublications().combined_metric_qp];
let yMax1 = 500;
let dataShadow1 = [];
for (let i = 0; i < data1.length; i++) {
  dataShadow1.push(yMax1);
}
option = {
  title: {
    text: 'Research & Professional Practice',
    subtext: ''
  },
  xAxis: {
    data: dataAxis1,
    axisLabel: {
      inside: true,
      color: '#fff'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        barBorderRadius: [10, 10, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#e06666' },
            { offset: 0.7, color: '#e06666' },
            { offset: 1, color: '#f39b9b' }
          ])
        }
      },
      data: data1
    }
  ]
};
// Enable data zoom when user click bar.
const zoomSize1 = 6;
myChart.on('click', function (params) {
  console.log(dataAxis1[Math.max(params.dataIndex - zoomSize1 / 2, 0)]);
  myChart.dispatchAction({
    type: 'dataZoom',
    startValue: dataAxis1[Math.max(params.dataIndex - zoomSize1 / 2, 0)],
    endValue:
      dataAxis1[Math.min(params.dataIndex + zoomSize1 / 2, data1.length - 1)]
  });
});

option && myChart.setOption(option);

// [rpp bar-chart end]

        // [ Gauge-chart ] start
        var dom = document.getElementById("chart-Gauge");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [{
                name: 'gauge Chart',
                type: 'gauge',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [0.4, '#FF425C'],
                            [0.8, '#13bd8a'],
                            [1, '#19BCBF']
                        ],
                        width: 10
                    }
                },
                detail: {
                    formatter: '{value}'
                },
                data: [{
                    value: parseFloat(calculateNIRF().value).toFixed(2),
                    name: ''
                }]
            }]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        // [ Gauge-chart ] end


              // [ Doughnut -pie-chart ] start
        var dom = document.getElementById("chart-pie-doughnut");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        option = {
            title: {
                text: 'NIRF Parameter Disctribution ',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['TLR', 'RPP', 'GO', 'OI','PP']
            },
            color: ['#13bd8a', '#FF425C', '#FF9764', '#463699', '#19BCBF'],
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            calculable: true,
            series: [{
                name: 'NIRF',
                type: 'pie',
                radius: ['50%', '70%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'bold'
                            }
                        }
                    }
                },
                data: [{
                    value: derivedTLR.value,
                    name: 'TLR'
                },
                {
                    value: derivedRPP.value,
                    name: 'RPP'
                },
                {
                    value: derivedGO.value,
                    name: 'GO'
                },
                {
                    value: derivedOI.value,
                    name: 'OI'
                },
                {
                    value: derivedPP.value,
                    name: 'PP'
                }
                ]
            }]
        };
        myChart.setOption(option, true);
        // [ Doughnut -pie-chart ] end


// [ basic-pie-chart ] start
var dom = document.getElementById("rpp-chart-pie-basic");
var myChart = echarts.init(dom);
var app = {};
option = null;
option = {
    title: {
        text: 'Research & Professional Practice',
        subtext: 'Percent wise contribution',
        x: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data: ['Metric for Publications (PU)', 'Metric for Quality of Publications (QP)']
    },
    color: ['#FF9764', '#463699', '#19BCBF'],
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    series: [{
        name: 'TLR',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [{
                value: calculateDerivedPublications().combined_metric_pu,
                name: 'Metric for Publications (PU)'
            },
            {
                value: calculateDerivedPublications().combined_metric_qp,
                name: 'Metric for Quality of Publications (QP)'
            }
        ]
    }]
};
myChart.setOption(option, true);
// [ basic-pie-chart ] end


// [ basic-pie-chart ] start
var dom = document.getElementById("go-chart-pie-basic");
var myChart = echarts.init(dom);
var app = {};
option = null;
option = {
    title: {
        text: 'Graduation Outcome',
        subtext: 'Percent wise contribution',
        x: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data: ['Placement and Higher Studies(GPH)', 'Metric for University Examinations(GUE)','Median Salary(GMS)']
    },
    color: ['#13bd8a', '#FF425C', '#FF9764', '#19BCBF'],
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    series: [{
        name: 'TLR',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [{
                value: calculateDerivedPlacementAndHigherStudies().combined_metric_gph,
                name: 'Placement and Higher Studies(GPH)'
            },
            {
                value: calculateDerivedPlacementAndHigherStudies().metric_gue,
                name: 'Metric for University Examinations(GUE)'
            },
            {
                value: calculateDerivedPlacementAndHigherStudies().median_salary_gms,
                name: 'Median Salary(GMS)'
            }
            
        ]
    }]
};
myChart.setOption(option, true);
// [ basic-pie-chart ] end

//[go bar-chart]start

var chartDom = document.getElementById('go-bar-chart');
var myChart = echarts.init(chartDom);
var option;

// prettier-ignore
let dataAxis2 = ['Placement and Higher Studies(GPH)', 'University Examinations(GUE)','Median Salary(GMS)'];
// prettier-ignore
let data2 = [calculateDerivedPlacementAndHigherStudies().combined_metric_gph,calculateDerivedPlacementAndHigherStudies().metric_gue,calculateDerivedPlacementAndHigherStudies().median_salary_gms];
let yMax2 = 500;
let dataShadow2 = [];
for (let i = 0; i < data2.length; i++) {
  dataShadow1.push(yMax2);
}
option = {
  title: {
    text: 'Graduation Outcome',
    subtext: ''
  },
  xAxis: {
    data: dataAxis2,
    axisLabel: {
      inside: true,
      color: '#fff'
    },
    axisTick: {
      show: true
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        barBorderRadius: [10, 10, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#e06666' },
            { offset: 0.7, color: '#e06666' },
            { offset: 1, color: '#f39b9b' }
          ])
        }
      },
      data: data2
    }
  ]
};
// Enable data zoom when user click bar.
const zoomSize2 = 6;
myChart.on('click', function (params) {
  console.log(dataAxis2[Math.max(params.dataIndex - zoomSize2 / 2, 0)]);
  myChart.dispatchAction({
    type: 'dataZoom',
    startValue: dataAxis2[Math.max(params.dataIndex - zoomSize2 / 2, 0)],
    endValue:
      dataAxis2[Math.min(params.dataIndex + zoomSize2 / 2, data2.length - 1)]
  });
});

option && myChart.setOption(option);

// [rpp bar-chart end]

//[oi bar-chart]start

var chartDom = document.getElementById('oi-bar-chart');
var myChart = echarts.init(chartDom);
var option;

// prettier-ignore
let dataAxis3 = ['Region Diversity RD', 'Women Diversity WD','ESCS','Facilities for PCS'];
// prettier-ignore
let data3 = [calculateDerivedDiversityAndSupportMetrics().region_diversity_rd,calculateDerivedDiversityAndSupportMetrics().women_diversity_wd,calculateDerivedDiversityAndSupportMetrics().escs,calculateDerivedDiversityAndSupportMetrics().pcs];
let yMax3 = 500;
let dataShadow3 = [];
for (let i = 0; i < data3.length; i++) {
  dataShadow1.push(yMax3);
}
option = {
  title: {
    text: 'OutReach & Inclusivity',
    subtext: ''
  },
  xAxis: {
    data: dataAxis3,
    axisLabel: {
      inside: true,
      color: '#fff'
    },
    axisTick: {
      show: true
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        barBorderRadius: [10, 10, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#e06666' },
            { offset: 0.7, color: '#e06666' },
            { offset: 1, color: '#f39b9b' }
          ])
        }
      },
      data: data3
    }
  ]
};
// Enable data zoom when user click bar.
const zoomSize3 = 6;
myChart.on('click', function (params) {
  console.log(dataAxis3[Math.max(params.dataIndex - zoomSize3 / 2, 0)]);
  myChart.dispatchAction({
    type: 'dataZoom',
    startValue: dataAxis3[Math.max(params.dataIndex - zoomSize3 / 2, 0)],
    endValue:
      dataAxis3[Math.min(params.dataIndex + zoomSize3 / 2, data3.length - 1)]
  });
});

option && myChart.setOption(option);

// [rpp bar-chart end]

// [ basic-pie-chart ] start
var dom = document.getElementById("oi-chart-pie-basic");
var myChart = echarts.init(dom);
var app = {};
option = null;
option = {
    title: {
        text: 'OutReach & Inclusivity',
        subtext: 'Percent wise contribution',
        x: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data: ['Region Diversity RD', 'Women Diversity WD','ESCS','Facilities for PCS']
    },
    color: ['#13bd8a', '#FF425C', '#FF9764', '#19BCBF'],
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    series: [{
        name: 'TLR',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [{
                value: calculateDerivedDiversityAndSupportMetrics().region_diversity_rd,
                name: 'Region Diversity RD'
            },
            {
                value: calculateDerivedDiversityAndSupportMetrics().women_diversity_wd,
                name:  'Women Diversity WD'
            },
            {
                value: calculateDerivedDiversityAndSupportMetrics().escs,
                name: 'ESCS'
            },
            {
                value: calculateDerivedDiversityAndSupportMetrics().pcs,
                name: 'Facilities for PCS'
            }
            
        ]
    }]
};
myChart.setOption(option, true);
// [ basic-pie-chart ] end


    }, 700);
});
