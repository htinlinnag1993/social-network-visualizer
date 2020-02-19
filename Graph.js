var Queue = require('./Queue');

class Graph {
    constructor(noOfVertices, adjList = new Map(), dist = [], pred = []) {
        this.noOfVertices = noOfVertices;
        this.AdjList = adjList;
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
    getAdjustListAsObj() {
        var obj = {};
        this.AdjList.forEach(function(value, key) {
            obj[key] = value;
        });
        return obj;
    }
    setAdjustListMap(graphInAdjList) {
        var temp = new Map();
        for (var i=101; i< 101 + this.noOfVertices; i++) {
            temp.set(i, graphInAdjList[i]);
        }
        this.AdjList = temp;
    }
    getSPBtwn2Vs(srcId, destId, startingId) {
        var visited = Array(this.noOfVertices).fill(false);
        var q = new Queue();
        var src = srcId - startingId;
        var dest = destId - startingId;
        visited[src] = true;
        this.dist[src] = 0;
        q.enqueue(srcId);

        // Standard BFS algorithm
        while (q.size() > 0) {
            srcId = q.dequeue();
            src = srcId - startingId;
            var adjVsFromCurrentV = this.AdjList.get(srcId);
            for (var i of adjVsFromCurrentV) {
                var vId = i;
                var v = vId - startingId;
                if (!visited[v]) {
                    visited[v] = true;
                    this.dist[v] = this.dist[src] + 1;
                    this.pred[v] = srcId;
                    q.enqueue(vId);
                    // Stop BFS when we find destId
                    if (vId === destId) return true;
                }
            }
        } 
        return false;
    }
    // utility function to print the shortest distance  
    // between source vertex and destination vertex 
    printShortestDistance(srcId, destId, startingId) { 
        // predecessor[i] array stores predecessor of 
        // i and distance array stores distance of i 
        // from s
        const maxSafeInt = Number.MAX_SAFE_INTEGER;
        this.dist = Array(this.noOfVertices).fill(maxSafeInt);
        this.pred = Array(this.noOfVertices).fill(-1);
        if (this.getSPBtwn2Vs(srcId, destId, startingId) === false) {  
            console.log("Given source and destination are not connected"); 
            return 0; 
        } 
        // path stores the shortest path 
        var path = [];
        var dest = destId - startingId;
        var crawl = dest; 
        var crawlId = destId;
        path.push(crawlId); 
        while (this.pred[crawl] !== -1) { 
            path.push(this.pred[crawl]); 
            crawlId = this.pred[crawl]; 
            crawl = crawlId - startingId;
        } 

        // distance from source is in distance array
        console.log("Shortest path length is : " + this.dist[dest]);
        // printing path from source to destination 
        console.log("Path is: "); 
        for (var i = path.length - 1; i >= 0; i--) 
            console.log( path[i] + " -> ");

        path = path.reverse();
        return {
            shortestDistance: this.dist[dest],
            shortestPath: path
        };
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