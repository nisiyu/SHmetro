# coding: utf-8
import os
import sys
import math

def calcdist(st1, st2):
    # 计算两个点之间的距离
    deltax = float(st1['x']) - float(st2['x'])
    deltay = float(st1['y']) - float(st2['y'])
    return math.sqrt(deltax * deltax + deltay * deltay)

def printVertexInfo(vertex):
    # 打印vertex中的信息
    print 'x:', vertex['x']
    print 'y:', vertex['y']
    print 'neighbors'
    for key, value in vertex['neighbors'].items():
        print key.decode('utf-8'), 'dist:', value['dist'], 'line:', value['linename'].decode('utf-8)')

    
def getMetroLines():
    # 读取地图按照地铁线路导出
    f = open("lbs.amap.com-1465659721504", 'r')
    nowline = ''
    metrolines = {}
    for line in f.readlines():

        if not ' ' in line:
            # 没有空格说明是地铁线路 nowline记录一下目前是哪条线路
            nowline = line[:-1]
            metrolines[nowline] = []

        else:
            # 有空格说明是地铁站的坐标
            station = line[:-1]
            name, x, y = station.split(' ')
            metrolines[nowline].append({'name':name, 'x':x, 'y':y})
    return metrolines


def generateMap():
    metrolines = getMetroLines()
    # 使用vertices记录所有点及其邻接边
    vertices = {}
    for linename, stations in metrolines.items():
        for i in range(len(stations)):
            st = stations[i]
            # 记录点 java里面可能可以用hashmap之类的结构，我不太确定
            if not vertices.has_key(st['name']):
                vertices[st['name']] = {'x':st['x'], 'y':st['y'], 'neighbors':{}}

            # 记录邻接的边
            if i != 0:
                # 只记录之前出现过的点的边
                lastst = stations[i-1]
                distance = calcdist(st, lastst)
                # 分别在st 和 lastst的邻居节点中增加
                vertices[st['name']]['neighbors'][lastst['name']] \
                    = {'dist':distance, 'vertex':lastst, 'linename':linename}
                vertices[lastst['name']]['neighbors'][st['name']] \
                    = {'dist':distance, 'vertex':st, 'linename':linename}
    return vertices

def getPathList(stable, end):
    # 递归获取路径
    res = []
    if stable[end].has_key('last'):
        res = getPathList(stable, stable[end]['last'])
        res.append(end)
        return res
    else:
        return [end]

def getPosList(stable, vertices, end):
    # 递归获取位置
    res = []
    if stable[end].has_key('last'):
        res = getPosList(stable, vertices, stable[end]['last'])
        res.append([vertices[end]['x'],vertices[end]['y']])
        return res
    else:
        return [[vertices[end]['x'],vertices[end]['y']]]

def findPath(vertices, start, end, pos=False):
    # 维护两个点集 stable中为已经确定最短路径的点集 unstable中为未确定最短路径的点集 
    stable = {}
    unstable = {}
    stable[start] = {'dist':0}
    point = start
    nowdist = 0
    if not (vertices.has_key(start) and vertices.has_key(end)):
        return []
    while True:
        for neighborname, neighborobj in vertices[point]['neighbors'].items():
            dist = neighborobj['dist'] + nowdist
            if stable.has_key(neighborname):
            # 已经在稳定的点里了 直接放弃
                continue
            
            if (not unstable.has_key(neighborname)) or \
                dist < unstable[neighborname]['dist']:
                # 不稳定点里没有这个点，直接增加这个点
                # 不稳定点里已经有这个点，看看新距离是否更小
                unstable[neighborname] = {'dist':dist, 'last':point}

        # 挑选出现在距离最小的那个点 加入stable中，刷新point和nowdist
        smallest = 10
        tobestableobj = {}
        tobestablename = ''
        for neighborname, neighborobj in unstable.items():
            if neighborobj['dist'] < smallest:
                smallest = neighborobj['dist']
                tobestablename = neighborname
                tobestableobj = neighborobj

        # 删除unstable中的点，移动到stable中
        # printVertexInfo(vertices[tobestablename])
        stable[tobestablename] = tobestableobj
        unstable.pop(tobestablename)

        # 已经得到最后的终点
        if end == tobestablename:
            if pos:
                return getPosList(stable, vertices, end)
            else:
                return getPathList(stable, end)
            
        point = tobestablename
        nowdist = smallest


def main():
    # 主函数
    start = raw_input('起点：')
    end = raw_input('终点：')
    vertices = generateMap()
    result = findPath(vertices, start, end)
    print '->'.join(result).decode('utf-8')
    pos = findPath(vertices, start, end, True)
    for x,y in pos:
        print '['+x+', '+y+'],'

main()



        

