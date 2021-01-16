


<template>
  <button v-on:click="printDir">fefefefefefef</button>

  <div class="horizontal" style="display: flex; flex-direction: horizontal">
    <div class="vertical">
      <div id="editor1-1"></div>
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
      ></div>

      <button v-on:click="addRightEditor">Add Child Text Editor</button>
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
// var fs = require('fs')
// var electronFs = remote.require('fs');

export default {
  name: 'App',
  data() {
    return {
      leftPaneNum: 0,
      rightEditors: 3,
      Editor: null,
      isHidden: false,
    }
  },
  methods: {
    addRightEditor: function () {
      let selector = `#editor2-${this.rightEditors}`
      newEditor(selector, "# this is new")
      addTripleClickListener(selector)
      this.rightEditors++
    },
    printDir: function () {
      console.log(getDirContents("markdown/"))
    },

    /* update: function () {
      for (var i = 0; i < editorArray.length; i++) {
        if (document.getElementById("#editor1-" + stringify(i)).getValue() != editorArray[i]) {
          //UPdate a save 
        }
      }
    }, */
  },
  mounted: function () {

    newEditor(`#editor1-1`)
    var editorArray = []
    let editor
    for (let i = 1, len = this.rightEditors; i < len; i++) {
      let selector = `#editor2-${i}`

      editor = newEditor(selector, "markdownText")
    }
  },
}






function addTripleClickListener(selector) {
  document.querySelector(selector).addEventListener('click', function (evt) {
    if (evt.detail === 3) {
      alert('triple click!')
    }
  })
}

function newEditor(selector, initMarkDown) {
  const editor = new Editor({
    initialValue: initMarkDown,
    el: document.querySelector(selector),
    height: 'auto',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical'
  })
  editor.getHtml()
  console.log(editor.getMarkdown())
  return editor
}



function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err)
      return
    }
    filenames.forEach(function (filename) {
      fs.readFile(dirname + filename, 'utf-8', function (err, content) {
        if (err) {
          onError(err)
          return
        }
        onFileContent(filename, content)
      })
    })
  })
}
function getDirContents(dir) {
  var data = {}
  readFiles(dir, function (filename, content) {
    data[filename] = content
  }, function (err) {
    throw err
  })
  return data
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
