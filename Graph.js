var Queue = require('./Queue');

class Graph {
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
    }

    addVertex(v) {
        this.AdjList.set(v, []);
    }
    addEdge(src, dest) {
        this.AdjList.get(src).push(dest);
        this.AdjList.get(dest).push(src);
    }
    getCurrentVAdjList(v) {
        return this.AdjList.get(v);
    }
    getNumOfEdgesForEachV() {
        var allVs = this.AdjList.keys();
        for (var i of allVs) {
           console.log("Profile " + i + " has " + this.AdjList.get(i).length + " friends");
        }
    }
    getGraphInAdjustListAsObj() {
        var obj = {};
        this.AdjList.forEach(function(value, key) {
            obj[key] = value;
        });
        return obj;
    }
    spBtwn2Vs(src, dest) {

    }
    bfs(srcId, startingId) {
        var visited = Array(this.noOfVertices).fill(false);
        var q = new Queue(), count = 0;
        var src = srcId - startingId;
        visited[src] = true;
        q.enqueue(srcId);

        while (q.size() > 0) {
            srcId = q.dequeue();
            console.log(count + "->" +srcId + " ");
            count++;
            
            var adjVsFromCurrentV = this.AdjList.get(srcId);
            for (var i of adjVsFromCurrentV) {
                var vId = i;
                var v = vId - startingId;
                if (!visited[v]) {
                    visited[v] = true;
                    q.enqueue(vId);
                }
            }
        } 
    }
    lot(srcId, startingId) {

    }
    

    clearGraph() {
        this.AdjList = new Map();
    }
    printGraph() {
        var allVs = this.AdjList.keys();
        for (var i of allVs) {
            var adjVsFromCurrentV = this.AdjList.get(i);
            var currentListInString = "";
            for (var j of adjVsFromCurrentV)  currentListInString += j + " ";

            console.log(i + " -> " + currentListInString);
        }
    }
};

module.exports = Graph;