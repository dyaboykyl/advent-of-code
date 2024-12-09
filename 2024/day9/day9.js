import fs from 'fs';

class DoubleLinkedList {
  constructor() {
    this.head = null;
    this.nodeId = 1;
    this.length = 0;
  }

  get tail() {
    let node = this.head;
    while (node) {
      if (!node?.next)
        return node;
      node = node.next;
    }
    return node;
  }

  addItem(val) {
    let node = new Node(this.nodeId++, val);

    if (this.head == null) {
      this.head = node;
    } else {
      const temp = this.tail;
      temp.next = node;
      node.prev = temp;
    }

    this.length++;
    return node;
  }

  toString() {
    const nodeStrs = [];
    let node = this.head;
    while (node) {
      nodeStrs.push(node.toString());
      node = node.next;
    }

    return nodeStrs.toString();
  }
}

class Node {
  constructor(id, value) {
    this.id = id;
    this.value = value
    this.next = null;
    this.prev = null;
  }

  toString() {
    return `{@${this.id}: ${JSON.stringify(this.value)}}`;
  }
}

const diskMap = fs.readFileSync("day9/input").toString();

function diskLLToArray() {
  let disk = [];
  let node = diskLL.head;
  while (node) {
    const block = node.value;
    if (block.size !== 0) {
      disk.push(Array(block.size).fill(block.data));
    }
    node = node.next;
  }
  return disk.flat();
}

function calculateChecksum(disk) {
  return disk.reduce((sum, id, i) => sum + (id === '.' ? 0 : id) * i, 0);
}

let part1DiskBlocks = [];
let diskLL = new DoubleLinkedList();
let freeBlocksLL = new DoubleLinkedList();

let id = 0;
let file = true;
let i = 0;
while (i < diskMap.length) {
  const size = parseInt(diskMap[i]);
  if (size > 0) {
    const block = { data: file ? id : '.', size }
    part1DiskBlocks.push(block);
    const node = diskLL.addItem({ ...block });
    if (!file) {
      freeBlocksLL.addItem(node);
    }
  }
  if (file) {
    file = false;
  } else {
    file = true;
    id++;
  }
  i++;
}

function part1() {
  let freeBlockIndex = part1DiskBlocks.findIndex(block => block.data === '.');
  i = part1DiskBlocks.length - 1;
  while (i > freeBlockIndex) {
    const block = part1DiskBlocks[i];
    const freeBlock = part1DiskBlocks[freeBlockIndex];
    if (block.data === "." || block.size === 0) {
      i--;
      continue;
    }

    const dataSizeToMove = Math.min(freeBlock.size, block.size);
    const newDataBlock = { size: dataSizeToMove, data: block.data };
    part1DiskBlocks.splice(freeBlockIndex, 0, newDataBlock);
    i++;
    freeBlockIndex++;
    freeBlock.size -= dataSizeToMove;
    block.size -= dataSizeToMove;

    while ((part1DiskBlocks[freeBlockIndex].data !== "." || part1DiskBlocks[freeBlockIndex].size === 0) && freeBlockIndex < i) {
      freeBlockIndex++;
    }
  }


  part1DiskBlocks = part1DiskBlocks.filter(block => block.size);
  const filledDisk = part1DiskBlocks.map(block => Array(block.size).fill(block.data)).flat()
  const checksum = calculateChecksum(filledDisk);
  console.log(`Checksum part 1: ${checksum}`);
}

function part2() {
  let blockNodeToCheck = diskLL.tail;
  while (blockNodeToCheck) {
    const blockNode = blockNodeToCheck;
    blockNodeToCheck = blockNodeToCheck.prev;

    const block = blockNode.value;
    if (block.data === '.' || block.checked) {
      continue;
    }

    block.checked = true;
    let freeBlockNodeNode = freeBlocksLL.head;
    let freeBlockNode = freeBlockNodeNode.value;
    while (freeBlockNodeNode && freeBlockNode.value.size < block.size) {
      freeBlockNodeNode = freeBlockNodeNode.next;
      freeBlockNode = freeBlockNodeNode?.value;
    }

    if (!freeBlockNodeNode || freeBlockNode?.id >= blockNode.id) {
      continue;
    }

    const freeBlock = freeBlockNode.value;

    const newBlockNode = new Node(diskLL.nodeId++, { ...block })
    block.data = ".";

    freeBlock.size -= block.size;
    newBlockNode.prev = freeBlockNode.prev;
    if (newBlockNode.prev) newBlockNode.prev.next = newBlockNode;
    newBlockNode.next = freeBlockNode;
    freeBlockNode.prev = newBlockNode;
  }

  console.log(`Checksum part 2: ${calculateChecksum(diskLLToArray())}`);
}

part1();
part2();