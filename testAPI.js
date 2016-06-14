//console.log(verticesstr);
var map;
var mapfunc = { 
    init: function(win){
    map = new AMap.Map('container',{
        zoom: 11,
        center: [121.4, 31.2]
    });


    AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
    var toolBar = new AMap.ToolBar();
    var scale = new AMap.Scale();
    map.addControl(toolBar);
    map.addControl(scale);
    });
},

searchPath: function(win){
var start = document.getElementById("start").value;
var end = document.getElementById("end").value;
//设定在container中添加map


function getPosList(stable, vertices, end) {
    var res = [];
    if (stable[end]['last']) {
        res = getPosList(stable, vertices, stable[end]['last'])
        res.push([parseFloat(vertices[end]['x']), parseFloat(vertices[end]['y'])]);
        return res;
    }else {
        return [[parseFloat(vertices[end]['x']),parseFloat(vertices[end]['y'])]];
    }
}

function findPath(vertices, start, end){
    var stable = {};
    var unstable = {};
    stable[start] = {dist:0};
    var point = start;
    var nowdist = 0;
    if (((vertices[start]) && (vertices[end])) == false) {
        return [];
    }
    while (1) {
        var neighbors = vertices[point]['neighbors'];
        for (var i in neighbors) {
            if (stable[i])
                continue;

            var dist = neighbors[i]['dist'] + nowdist;
            if ((! unstable[i]) || (dist < unstable[i]['dist'])) {
                unstable[i] = {dist:dist, 
                               last:point};
                //console.log(unstable[i]);
            }
        }
        var smallest = 10;
        var tobestableobj = {};
        var tobestablename = '';
        for (var i in unstable) {
            if ((unstable[i]) && (unstable[i]['dist'] < smallest)) {
                smallest = unstable[i]['dist'];
                tobestablename = i;
                tobestableobj = unstable[i];
            }
        }

        stable[tobestablename] = tobestableobj;
        unstable[tobestablename] = undefined;

        if (end === tobestablename) {
            return getPosList(stable, vertices, end);
        }
            
        point = tobestablename;
        nowdist = smallest;
    }
}
var lineArr = findPath(verticesstr,start,end);
//lineArr保存的是各个站点的坐标
// var lineArr = [[121.533168, 31.295784],
// [121.534941, 31.288543],
// [121.528401, 31.278814],
// [121.518379, 31.274946],
// [121.509685, 31.273242],
// [121.501488, 31.27488],
// [121.494362, 31.268533],
// [121.488669, 31.259278],
// [121.484208, 31.252035],
// [121.482473, 31.243829],
// [121.483609, 31.237101],
// [121.475719, 31.23277]];

// 比例尺插件增加


//polyline设置要画的折线
var polyline = new AMap.Polyline({
        path: lineArr,          //设置线覆盖物路径
        strokeColor: "#3366FF", //线颜色
        strokeOpacity: 1,       //线透明度
        strokeWeight: 10,        //线宽
        strokeStyle: "solid",   //线样式
        strokeDasharray: [10, 5] //补充线样式
    });

//画线
polyline.setMap(map);
}
};