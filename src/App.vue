


<template>
  <!-- <button v-on:click="printDir">fefefefefefef</button> -->

  <div class="horizontal" style="display: flex; flex-direction: horizontal">
    <div class="vertical">
      <div
        v-for="num in leftEditors"
        :key="num.key"
        v-bind:id="'editor1-' + num"
        @contextmenu="setParentAsChild"
      ></div>
    </div>
    <!--Side Bar-->
    <div class="vertical">
      <!--<button>
        <span>Hide</span>
        <span>Show v-if="!isHidden"</span>
      </button>-->

      <div
        v-for="num in rightEditors"
        :key="num.key"
        v-bind:id="'editor2-' + num"
        class="editor-class"
        @contextmenu="setChildAsParent(num)"
      ></div>

      <!-- <button v-on:click="addRightEditor">Add Child Text Editor</button> -->
    </div>
  </div>
</template>

<script>
// require('./toastui-editor-all.min.js')
// Editor = toastui.Editor

import Editor from '@toast-ui/editor'
import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style

var remote = window.require('electron').remote
var fs = remote.require('fs')
var fpath = remote.require('path')
// var fs = require('fs')
// var electronFs = remote.require('fs');
const { shell } = remote.require('electron')



export default {
  name: 'App',
  data() {
    return {
      leftEditors: 1,
      rightEditors: 0,
      Editor: null,
      isHidden: false,
      parentFile: '1.md',
      // saveDir: "markdown",
      saveDir: "C:/Users/User/Documents/markdown",
      editorArr: [],
      leftEditorArr: [],
      childrenIndicator: null,

    }
  },
  methods: {
    addRightEditor: function () {
      let selector = `#editor2-${this.rightEditors}`
      this.editorArr.push(this.newEditor(selector))
      addTripleClickListener(selector, this.rightEditors, this.setChildAsParent)
      this.rightEditors++
    },

    numToGoodDir: function (num) {
      let endNum = noExtension(this.parentFile)
      let dirFromNum = `${fpath.dirname(this.parentFile)}/${endNum}/${num}`
      return `${this.saveDir}/${dirFromNum}`
    },

    numToGoodPath: function (num) {
      return `${this.saveDir}/${this.pathFromNum(num)}`
    },

    pathFromNum: function (num) {
      let endNum = noExtension(this.parentFile)
      return `${fpath.dirname(this.parentFile)}/${endNum}/${num}.md`
    },

    setChildAsParent: function (row) {
      if (row < this.rightEditors - 1) {
        // let num = noExtension(this.parentFile)
        // this.parentFile = `${fpath.dirname(this.parentFile)}/${num}/${row}.md`
        this.parentFile = this.pathFromNum(row)
        console.log(this.parentFile)
        this.doEditors()
      }
    },

    setParentAsChild: function () {
      console.log(this.parentFile)
      if (!(this.parentFile === "1.md" || this.parentFile === "./1.md")) {
        this.parentFile = `${fpath.dirname(this.parentFile)}.md`
        console.log(`ok   ${this.parentFile}`)
        this.doEditors()
      }
    },

    deleteEditor: function () {
      // alert(row)

      let caretElement = getSelectionStart()
      let firstAncestor = caretElement.closest(".editor-class")
      if (firstAncestor) {
        let ancestorId = firstAncestor.id
        if (ancestorId.indexOf('editor2-') === 0) {
          let num = ancestorId.slice(8)
          // num
          let path = this.numToGoodPath(num)
          let fullPath = fpath.resolve(path)
          let folderPath = fpath.resolve(fileToDir(path))

          if (!shell.moveItemToTrash(fullPath)) { return }
          if (!shell.moveItemToTrash(folderPath)) { return }
          console.log(`deleted ${fullPath}`)



          // if (!fs.renameSync(oldPath, newPath)) { return }



          let editorId = `editor2-${num}`
          document.getElementById(editorId).remove()
          let len = this.editorArr.length + 2
          //assign new ids
          for (let i = parseInt(num) + 1; i < len; i++) {
            this.editorArr.splice(i - 1)
            let editorId = `editor2-${i}`
            document.getElementById(editorId).id = `editor2-${i - 1}`
            console.log(`editor2-${i - 1}`)
          }
         /*  for (let i = parseInt(num) + 1, len = this.editorArr.length + 2; i < len; i++) {

            document.getElementById(editorId).id = `editor2-${i - 1}`
            console.log(`editor2-${i - 1}`)



          }
          let path = this.numToGoodPath(num)
          let fullPath = fpath.resolve(path)
          let folderPath = fpath.resolve(fileToDir(path))
 */
          //remove by 1
          rightEditors--
        }
      }


      // console.log(firstAncestor)
      // document.querySelector("p").closest(".near.ancestor")

    },

    getNumberOfChildren: function (num) {
      return new Promise(async (resolve) => {

        let dir = this.numToGoodDir(num)
        fs.readdir(dir, { withFileTypes: true }, (err, dirents) => {
          let files = dirents.filter(dirent => dirent.isFile())
            .map(dirent => dirent.name)
          console.log(files.length)
          resolve(files.length)
        })
      })
    },

    doEditors: async function () {
      this.leftEditors = 0
      this.rightEditors = 0

      let num = noExtension(this.parentFile)


      let arr = await readFiles(`${this.saveDir}/${fpath.dirname(this.parentFile)}/${num}`)
      let length = arr.length
      let keys = []
      let contents = []
      let childrenObj = {}
      console.log("RESET")
      this.leftEditorArr = []
      this.editorArr = []
      for (let i = 0; i < length; i++) {
        const element = arr[i]
        keys.push(element[0])
        contents.push(element[1])
        childrenObj[element[0]] = element[1]
      }
      this.rightEditors = length + 2
      this.leftEditors = 1
      await this.nextTick
      console.log(childrenObj)


      let parentContent = readFile(fpath.join(this.saveDir, this.parentFile))
      console.log(parentContent)
      this.leftEditorArr.push(this.newEditor(`#editor1-1`, parentContent))
      leftTripleClick(`#editor1-1`, this.setParentAsChild)

      for (let i = 0; i < length; i++) {
        const name = keys[i]
        const num = noExtension(name)

        let selector = `#editor2-${num}`

        this.editorArr.push(this.newEditor(selector, contents[i]))
        addTripleClickListener(selector, num.toString(), this.setChildAsParent)
        // editor = this.newEditor(selector, childrenObj[name])
      }
      let selector = `#editor2-${length + 1}`
      console.log(selector)
      this.editorArr.push(this.newEditor(selector))
      addTripleClickListener(selector, length.toString(), this.setChildAsParent)
      let promises = []
      for (let i = 0; i < length; i++) {
        const name = keys[i]
        const num = noExtension(name)
        // let numberOfChildren = this.getNumberOfChildren(num)
        // console.log(numberOfChildren);
        promises.push(new Promise(async (resolve) => {
          let selector = `#editor2-${num}`
          let element = document.querySelector(selector)


          let appendTo = element.querySelector('.te-mode-switch')
          if (appendTo) {
            let cloned = this.childrenIndicator.cloneNode(true)
            cloned.innerHTML = `${await this.getNumberOfChildren(num)} children`
            cloned.addEventListener("click", evt => {
              if (evt.detail === 1) {
                this.setChildAsParent(num)
              }
            })
            appendTo.appendChild(cloned)
          }
          resolve()
        }))
      }
      Promise.all(promises)

    },



    /* for (const [name, content] of Object.entries(childrenObj)) {
} */


    saveEverything: function () {

      for (let i = 0, len = this.leftEditorArr.length; i < len; i++) {
        let editor = this.leftEditorArr[i]
        let data = editor.getMarkdown()
        let path = `${this.saveDir}/${i + 1}.md`
        writeFile(path, data)
      }

      // console.log(this.editorArr.length)
      let len = this.editorArr.length
      for (let i = 0; i < len - 1; i++) {
        let editor = this.editorArr[i]
        let data = editor.getMarkdown()
        let path = this.numToGoodPath(i + 1)
        writeFile(path, data)
      }
      let editor = this.editorArr[len - 1]
      let data = editor.getMarkdown()
      let path = this.numToGoodPath(len)
      if (data) { 
        dirFromFile(path, data) 
        this.addRightEditor()
      }



    },
    newEditor: function (selector, initMarkDown, numberOfChildren) {
      let element = document.querySelector(selector)
      const editor = new Editor({
        initialValue: initMarkDown,
        el: element,
        height: 'auto',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical'
      })
      editor.getHtml()
      return editor
    },
  },
  mounted: function () {
    this.childrenIndicator = document.createElement('button')
    this.childrenIndicator.classList.add('te-switch-button')
    // this.childrenIndicator.classList.add('tui-toolbar-icons')

    this.doEditors()

    document.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
        this.saveEverything()
      }
    })
    document.addEventListener("keydown", e => {
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyD") {
        // if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyD") {
        this.deleteEditor()
      }
    })



  },
}
function getSelectionStart() {
  var node = document.getSelection().anchorNode
  return (node.nodeType == 3 ? node.parentNode : node)
}

function fileToDir(path) {
  return `${fpath.dirname(path)}/${noExtension(path)}`
}

async function dirFromFile(path, data) {
  let createPath = fileToDir(path)
  console.log("createPath", createPath)
  writeFile(path, data)
  if (!fs.existsSync(createPath)) {
    fs.mkdirSync(createPath)
  }
}

async function writeFile(path, data) {
  fs.writeFile(path, data, 'utf-8', function (err) {
    if (err) throw err
    console.log(`${path} saved!`)
  })
}

function noExtension(path) {
  return fpath.parse(path).name
}

function readFile(path) {
  return fs.readFileSync(path).toString()
}

function ctrlWlistener(selector, row, callback) {
  document.querySelector(selector).addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.code === "KeyD") {
      // if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyD") {
      callback(row)
    }
  })
}

function leftTripleClick(selector, callback) {
  document.querySelector(selector).addEventListener('click', function (evt) {
    if (evt.detail === 3) {
      callback()
    }
  })
}

function addTripleClickListener(selector, row, callback) {
  document.querySelector(selector).addEventListener('click', function (evt) {
    if (evt.detail === 3) {
      callback(row)
    }
  })
}


/* function newHeightEditor(selector, initMarkDown, height) {
  const editor = new Editor({
    initialValue: initMarkDown,
    el: document.querySelector(selector),
    height: height,
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical'
  })
  editor.getHtml()
  return editor
} */





/* function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err)
      return
    }
    filenames.forEach(function (filename) {

      if (fs.lstatSync(dirname + filename).isFile()) {
        fs.readFile(dirname + filename, 'utf-8', function (err, content) {
          if (err) {
            onError(err)
            return
          }
          onFileContent(filename, content)
        })
      }
    })
  })
} */
/* function getDirContents(dir) {
  var data = {}
  readFiles(dir, function (filename, content) {
    data[filename] = content
    console.log(filename)
  }, function (err) {
    throw err
  })
  return data
} */









/* async function getDirContents(dir) {
  const arr = await readFiles(dir)
  let childrenObj = {}
  for (let i = 0, len = arr.length; i < len; i++) {
    const element=arr[i]
  childrenObj[element[0]] = element[1]
  }
  return childrenObj
} */


/**
 * Promise all
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */
function promiseAllP(items, block) {
  var promises = []
  items.forEach(function (item, index) {
    promises.push(function (item, i) {
      return new Promise(function (resolve, reject) {
        return block.apply(this, [item, index, resolve, reject])
      })
    }(item, index))
  })
  return Promise.all(promises)
} //promiseAll

/**
 * read files
 * @param dirname string
 * @return Promise
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @see http://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
 */
/* function readFiles(dirname) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, function (err, filenames) {
      if (err) return reject(err)
      promiseAllP(filenames,
        (filename, index, resolve, reject) => {
          fs.readFile(fpath.resolve(dirname, filename), 'utf-8', function (err, content) {
            if (err) return reject(err)
            return resolve([ filename, content ])
            // return resolve({ filename: content })
            // return resolve({ filename: filename, contents: content })
          })
        })
        .then(results => {
          return resolve(results)
        })
        .catch(error => {
          return reject(error)
        })
    })
  })
} */


function readFiles(dirname) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, { withFileTypes: true }, function (err, dirents) {
      if (err) return reject(err)
      const filenames = dirents
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)
      promiseAllP(filenames,
        (filename, index, resolve, reject) => {
          fs.readFile(fpath.resolve(dirname, filename), 'utf-8', function (err, content) {
            if (err) return reject(err)
            return resolve([filename, content])
            // return resolve({ filename: content })
            // return resolve({ filename: filename, contents: content })
          })
        })
        .then(results => {
          return resolve(results)
        })
        .catch(error => {
          return reject(error)
        })
    })
  })
}












</script>

<style>
/* @import "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.css"; */

/* @import "https://uicdn.toast.com/editor/latest/toastui-editor.min.css"; */
.vertical {
  display: flex;
  flex-direction: column;
}
</style>