class Queue {
    constructor() {
        this.items = [];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    enqueue(element) {
        this.items.push(element);
    }
    dequeue() {
        if (this.isEmpty()) return "Underflow";
        return this.items.shift();
    }
    front() {
        if (this.isEmpty()) return "No elements in Queue";
        return this.items[0];
    }
    printQueue() {
        var str = "";
        for (var i=0; i<this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }
}

module.exports = Queue;