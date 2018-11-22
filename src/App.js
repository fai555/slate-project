import { Editor, getEventRange, getEventTransfer } from 'slate-react'
import { Block, Value } from 'slate'

import React from 'react'
import initialValueAsJson from './value.json'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import styled from 'react-emotion'
import { isKeyHotkey } from 'is-hotkey'

// import { Button, Icon, Toolbar } from '../components'

export const Button = styled('span')`
  cursor: pointer;
  color: ${props =>
    props.reversed
      ? props.active ? 'white' : '#aaa'
      : props.active ? 'black' : '#ccc'};
`

export const Icon = styled(({ className, ...rest }) => {
  return <span className={`material-icons ${className}`} {...rest} />
})`
  font-size: 18px;
  vertical-align: text-bottom;
`

export const Menu = styled('div')`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`

export const Toolbar = styled(Menu)`
  position: relative;
  padding: 1px 18px 17px;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`



/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const existingValue = JSON.parse(localStorage.getItem('content'))
const initialValue = Value.fromJSON(existingValue || initialValueAsJson)
// const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * A styled image block component.
 *
 * @type {Component}
 */

const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`

/*
 * A function to determine whether a URL has an image extension.
 *
 * @param {String} url
 * @return {Boolean}
 */

function isImage(url) {
  return !!imageExtensions.find(url.endsWith)
}

/**
 * A change function to standardize inserting images.
 *
 * @param {Editor} editor
 * @param {String} src
 * @param {Range} target
 */

function insertImage(editor, src, target) {
  if (target) {
    editor.select(target)
  }

  editor.insertBlock({
    type: 'image',
    data: { src },
  })
}

/**
 * The editor's schema.
 *
 * @type {Object}
 */

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph')
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
      }
    },
  },
  blocks: {
    image: {
      isVoid: true,
    },
  },
}

/**
 * The images example.
 *
 * @type {Component}
 */

// class App extends React.Component {

//   state = {
//     value: initialValue,
//   }
//   /**
//    * Store a reference to the `editor`.
//    *
//    * @param {Editor} editor
//    */

//   ref = editor => {
//     this.editor = editor
//   }

//   /**
//    * Render the app.
//    *
//    * @return {Element} element
//    */

//   onChange = ({ value }) => {
//     this.setState({ value })
//   }

//   render() {
//     return (
//       <div>
//         <Toolbar>
//           <Button onMouseDown={this.onClickImage}>
//             <Icon>image</Icon>
//           </Button>
//         </Toolbar>
//         <Editor 
        
//         placeholder="Enter some text..."
//         ref={this.ref}
//         defaultValue={initialValue}
//         schema={schema}
//         onDrop={this.onDropOrPaste}
//         onPaste={this.onDropOrPaste}
//         renderNode={this.renderNode}


//         value={this.state.value} 
//         onChange={this.onChange} />
//         {/* <Editor
//           placeholder="Enter some text..."
//           ref={this.ref}
//           defaultValue={initialValue}
//           schema={schema}
//           onDrop={this.onDropOrPaste}
//           onPaste={this.onDropOrPaste}
//           renderNode={this.renderNode}
//         /> */}
//       </div>
//     )
//   }

//   /**
//    * Render a Slate node.
//    *
//    * @param {Object} props
//    * @return {Element}
//    */

//   renderNode = (props, editor, next) => {
//     const { attributes, node, isFocused } = props

//     switch (node.type) {
//       case 'image': {
//         const src = node.data.get('src')
//         return <Image src={src} selected={isFocused} {...attributes} />
//       }

//       default: {
//         return next()
//       }
//     }
//   }

//   /**
//    * On clicking the image button, prompt for an image and insert it.
//    *
//    * @param {Event} event
//    */

//   onClickImage = event => {
//     event.preventDefault()
//     const src = window.prompt('Enter the URL of the image:')
    
//     if (!src) return
//     this.editor.command(insertImage, src)
//   }

//   /**
//    * On drop, insert the image wherever it is dropped.
//    *
//    * @param {Event} event
//    * @param {Editor} editor
//    * @param {Function} next
//    */

//   onDropOrPaste = (event, editor, next) => {
//     const target = getEventRange(event, editor)
//     if (!target && event.type === 'drop') return next()

//     const transfer = getEventTransfer(event)
//     const { type, text, files } = transfer

//     if (type === 'files') {
//       for (const file of files) {
//         const reader = new FileReader()
//         const [mime] = file.type.split('/')
//         if (mime !== 'image') continue

//         reader.addEventListener('load', () => {
//           editor.command(insertImage, reader.result, target)
//         })

//         reader.readAsDataURL(file)
//       }
//       return
//     }

//     if (type === 'text') {
//       if (!isUrl(text)) return next()
//       if (!isImage(text)) return next()
//       editor.command(insertImage, text, target)
//       return
//     }

//     next()
//   }
// }

/**
 * Export.
 */

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

/**
 * The rich text example.
 *
 * @type {Component}
 */

export class RichTextExample extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: initialValue,
    initialTopLevelBlockNodeCount:0,
    disableSave: false,
  }
  

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type == type)
  }

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = editor => {
    this.editor = editor
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  // onChange = ({ value }) => {
  //   this.setState({ value })
  // }

  showOpenFileDlg = () => {
      this.inputRef.current.click()
  }

  clickSave = () => {
    // if (value.document != this.state.value.document) {
      const content = JSON.stringify(this.state.value.toJSON())
      localStorage.setItem('content', content)
    // }

  }

  clickCancel = () => {
    const existingValue = JSON.parse(localStorage.getItem('content'))
    this.setState({value: Value.fromJSON(existingValue)})
    // const initialValue = Value.fromJSON(existingValue || initialValueAsJson)
  }

  changeBlockNodeCount = ({target: {value}}) =>{
    if(value>=0) this.setState({initialTopLevelBlockNodeCount:value})
  }
  
  render() {
    let {value,initialTopLevelBlockNodeCount} = this.state;

    console.log(JSON.parse(JSON.stringify(value)).document.nodes.length)

    return (
      <div className="editor-app">
        <Toolbar>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
          <Button onMouseDown={this.onClickImage}>
            <Icon>image</Icon>
          </Button>
          {/* <Button onMouseDown={this.onBrowseImage}>
            <input type="file" name="pic" accept="image/*"></input>
            <Icon>add_photo_alternate</Icon>
          </Button> */}

          <Button>
            
              <label>
                <Icon>add_photo_alternate</Icon>              
                  <input
                      type="file"
                      accept="image/*"
                      style={{display:"none"}}
                      multiple="multiple"
                      onChange={this.onBrowseImage} />
              </label>
          </Button>

          <Button>
            Top Level Block Count
            <input onChange={this.changeBlockNodeCount} type="number" value={initialTopLevelBlockNodeCount}/>
            {/* <Icon>save</Icon> */}
          </Button>

          <Button onClick={this.clickSave}>
            Save
            {/* <Icon>save</Icon> */}
          </Button>
          <Button onClick={this.clickCancel}>
            Cancel
            {/* <Icon>cancel_presentation</Icon> */}
          </Button>
          

          
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          ref={this.ref}
          defaultValue={initialValue}
          schema={schema}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          onDrop={this.onDropOrPaste}
          onPaste={this.onDropOrPaste}
        />
        <div className="bottom-toolbar">
          <Toolbar>
            <Button>
              Max Top Level Block Count
              <input onChange={this.changeBlockNodeCount} type="number" value={initialTopLevelBlockNodeCount}/>
              {/* <Icon>save</Icon> */}
            </Button>

            <Button onClick={this.clickSave}>
              Save
              {/* <Icon>save</Icon> */}
            </Button>
            <Button onClick={this.clickCancel}>
              Cancel
              {/* <Icon>cancel_presentation</Icon> */}
            </Button>
            

            
          </Toolbar>

        </div>
      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks.size > 0) {
        // console.log(document, blocks, type)
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    const { attributes, children, node, isFocused } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'image': {
        const src = node.data.get('src')
        return <Image src={src} selected={isFocused} {...attributes} />
      }
      default:
        return next()
    }
  }


    /**
   * On clicking the image button, prompt for an image and insert it.
   *
   * @param {Event} event
   */

  onClickImage = event => {
    event.preventDefault()
    const src = window.prompt('Enter the URL of the image:')

    if (!src) return
    this.editor.command(insertImage, src)
  }

  onBrowseImage = event => {
    event.preventDefault()

    if(event.target.files){
      var fileList=event.target.files;
  
      for (const file of fileList) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')
        if (mime !== 'image') continue
  
        reader.addEventListener('load', () => {
          this.editor.command(insertImage, reader.result)
        })
  
        reader.readAsDataURL(file)
      }

    }



        // var fileArray=[];
        // for(var i=0;i<fileList.length;i++){
        //     fileArray.push(fileList[i]);
        //     // console.log(JSON.stringify(fileList[i].getAttribute('name')));



        //     // this.uploadImageAsPromise(fileList[i]);

        // }

    // var input = document.createElement('input');
    // input.type = 'file';
    // input.setAttribute("id", "file-uploader");
    // input.click()
    // // input.onclick=this.onClickImage;

    // // input.onclick(event)

    // console.log(document.getElementById('file-uploader').files[0])

    // const src = window.prompt('Enter the URL of the image:')
    // if (!src) return
    // this.editor.command(insertImage, src)
  }


    /**
   * On drop, insert the image wherever it is dropped.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   */

  onDropOrPaste = (event, editor, next) => {
    const target = getEventRange(event, editor)
    if (!target && event.type === 'drop') return next()

    const transfer = getEventTransfer(event)
    const { type, text, files } = transfer

    if (type === 'files') {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')
        if (mime !== 'image') continue

        reader.addEventListener('load', () => {
          editor.command(insertImage, reader.result, target)
        })

        reader.readAsDataURL(file)
      }
      return
    }

    if (type === 'text') {
      if (!isUrl(text)) return next()
      if (!isImage(text)) return next()
      editor.command(insertImage, text, target)
      return
    }

    next()
  }



  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {

    // if (value.document != this.state.value.document) {
    //   const content = JSON.stringify(value.toJSON())
    //   localStorage.setItem('content', content)
    // }

    let {initialTopLevelBlockNodeCount} = this.state;
    let currentBlockCount = JSON.parse(JSON.stringify(value)).document.nodes.length;
    
    if(currentBlockCount<=initialTopLevelBlockNodeCount) this.setState({ value })

    this.setState({ disableSave: true })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }
}

/**
 * Export.
 */



// export default App