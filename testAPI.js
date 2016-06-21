//console.log(verticesstr);
var map;
//三条线的颜色, 可以修改
var colors = ["#3366FF", "#ff5330", "#ed32ff"];
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
    //初始化时设定3个路线的颜色
    $(".input>span").each(function(index, element) {
        $(element).css("color", colors[index]);
    });
},

searchPath: function(win){


    function getPosList(stable, vertices, end) {
        var res = [];
        var resstr = "";
        if (stable[end]['last']) {
            var robj = getPosList(stable, vertices, stable[end]['last'])
            res = robj['pos'];
            resstr = robj['str']
            res.push([parseFloat(vertices[end]['x']), parseFloat(vertices[end]['y'])]);
            resstr += '->' + end
            return {
                str: resstr,
                pos: res};
        }else {
            return {
                str: end,
                pos: [[parseFloat(vertices[end]['x']),parseFloat(vertices[end]['y'])]]
            };
        }
    }

    function findPath(vertices, start, end){
        var stable = {};
        var unstable = {};
        stable[start] = {dist:0};
        var point = start;
        var nowdist = 0;
        if (((vertices[start]!== undefined) && (vertices[end]!==undefined)) === false) {
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
    var start = [];
    var end = [];
    $(".input>.start").each(function(){
        start.push($(this).val());
    });
    $(".input>.end").each(function(){
        end.push($(this).val());
    });
    for (var i=0; i<3; i++) {
        var pathObj = findPath(verticesstr,start[i],end[i]);
        var lineArr = pathObj['pos'];
        var linestr = pathObj['str'];
        $(".input:nth-child("+(i+2).toString()+")>p").text(linestr);

        //polyline设置要画的折线
        var polyline = new AMap.Polyline({
                path: lineArr,          //设置线覆盖物路径
                strokeColor: colors[i], //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 10,        //线宽
                strokeStyle: "solid",   //线样式
                strokeDasharray: [10, 5] //补充线样式
            });

        //画线
        polyline.setMap(map);
    }

}
};