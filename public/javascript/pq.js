class MinPriorityQueue {
    constructor() {
        this.heap = [];
        this.map = {}; // To keep track of indices of items in the heap
    }

    // Helper function to swap two elements in the heap
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
        this.map[this.heap[index1].id] = index1;
        this.map[this.heap[index2].id] = index2;
    }

    // Helper function to heapify up
    heapifyUp(index) {
        let currentIndex = index;
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            if (this.heap[currentIndex].distance < this.heap[parentIndex].distance) {
                this.swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    // Helper function to heapify down
    heapifyDown(index) {
        let currentIndex = index;
        const heapSize = this.heap.length;
        while (true) {
            const leftChildIndex = 2 * currentIndex + 1;
            const rightChildIndex = 2 * currentIndex + 2;
            let smallestIndex = currentIndex;

            if (leftChildIndex < heapSize && this.heap[leftChildIndex].distance < this.heap[smallestIndex].distance) {
                smallestIndex = leftChildIndex;
            }
            if (rightChildIndex < heapSize && this.heap[rightChildIndex].distance < this.heap[smallestIndex].distance) {
                smallestIndex = rightChildIndex;
            }

            if (smallestIndex !== currentIndex) {
                this.swap(currentIndex, smallestIndex);
                currentIndex = smallestIndex;
            } else {
                break;
            }
        }
    }

    // Insert a new element into the priority queue
    insert(id, distance) {
        const newNode = { id, distance };
        this.heap.push(newNode);
        const currentIndex = this.heap.length - 1;
        this.map[id] = currentIndex;
        this.heapifyUp(currentIndex);
    }

    // Extract the minimum element from the priority queue
    extractMin() {
        if (this.heap.length === 0) {
            return null;
        }
        const minNode = this.heap[0];
        const lastNode = this.heap.pop();
        delete this.map[minNode.id];
        if (this.heap.length > 0) {
            this.heap[0] = lastNode;
            this.map[lastNode.id] = 0;
            this.heapifyDown(0);
        }
        return minNode;
    }

    // Update the distance of an existing element in the priority queue
    updateDistance(id, newDistance) {
        if (!(id in this.map)) {
            throw new Error(`Node with id ${id} does not exist in the priority queue`);
        }
        const index = this.map[id];
        const currentNode = this.heap[index];
        if (newDistance < currentNode.distance) {
            currentNode.distance = newDistance;
            this.heapifyUp(index);
        } else if (newDistance > currentNode.distance) {
            currentNode.distance = newDistance;
            this.heapifyDown(index);
        }
    }

    // Check if the priority queue is empty
    isEmpty() {
        return this.heap.length === 0;
    }
}

// // Example usage:
// const pq = new MinPriorityQueue();
// pq.insert('1-1', 5);
// pq.insert('2-2', 3);
// pq.insert('3-3', 7);
// pq.insert('4-4', 5);
// pq.insert('5-5', 6);
// pq.insert('6-6', 1);
// pq.insert('7-7', 2);
// pq.insert('8-8', 73);
// pq.insert('9-9', 755);

// console.log(pq.heap)
// // console.log(pq.extractMin()); // { id: '2-2', distance: 3 }
// // console.log(pq.extractMin()); // { id: '1-1', distance: 5 }

// // pq.updateDistance('3-3', 2);
// // console.log(pq.extractMin()); // { id: '3-3', distance: 2 }

// const num = pq.extractMin()

// console.log(pq.heap)
// console.log(pq.extractMin())
// console.log(pq.extractMin())
// console.log(pq.heap)
// pq.updateDistance("9-9", 2)
// console.log(pq.extractMin())


