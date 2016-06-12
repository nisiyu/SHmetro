# SHmetro
some works with shanghai metro

1. 获取地铁站的坐标 使用`高德地图API`
2. 前往[高德地图API网站DEMO页面](http://lbs.amap.com/fn/jsdemo_loader/?url=http://webapi.amap.com/demos/transfer/lineSearch.html)，复制output.html中的内容到左边框中
3. 打开浏览器调试工具，保存console中的内容，目前本库中已有上海地铁站坐标信息


## processAlg.py
该程序实现了Dijkstra算法，距离以两点直线距离计算，目前有bug，没有考虑到换乘可能造成的损耗。
