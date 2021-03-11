module.exports = {
  dialog: {
    title: 'Notice',
    confirm: 'confirm',
    cancel: 'cancel',
  },
  dialogs: {
    library: {
      title: 'Library',
      loading: 'loading...',
      empty: 'No matching library',
      style: {
        title: 'External style',
        describe:
          'The external styles you add will be executed in sequence before the local CSS is executed, supporting HTTP and HTTPS protocol links.',
        searchPlaceHolder: 'Find external styles...',
        add: 'Add external style',
      },
      script: {
        title: 'External script',
        describe:
          'The external styles you add will be executed sequentially before the native JavaScript executes, supporting HTTP and HTTPS protocol links.',
        searchPlaceHolder: 'Find external scripts...',
        add: 'Add external script',
      },
    },
    preprocessor: {
      title: 'Preprocessor',
    },
    upload: {
      title: 'Upload Files',
      preDescribe: 'Upload local files in formats including ',
      mimeType: 'html, md, pug, css, sass, scss, less, styl, js, ts, coffee, ',
      aftDescribe: 'and the file contents will overwrite the contents of the corresponding edit window.',
      resolveHTML: 'Resolve HTML file',
      resolveDescribe:
        'With this option selected, the editor will separate the HTML, CSS, and javascript code in the file HTML from the external links, which will override the code in the corresponding editor, and the external links will be automatically added to the library',
      chooseBtn: 'Choose File',
      fileList: 'File List',
      uploadBtn: 'Upload',
    },
    settings: {
      title: 'Settings',
      time: {
        title: 'Delayed Execution Time',
        describe: 'When you are done with the code, we will wait a while before executing it.',
      },
      autoExecute: {
        title: 'AutoExecute',
        describe:
          'Selecting this option will automatically execute the code. If it is not selected, click the Execute button to execute the code.',
      },
      autoComplete: {
        title: 'Code Hinting',
      },
      lint: {
        title: 'Code Linter',
        describe:
          'Enabling this allows for canonical checking of code, which is currently not supported for preprocessor.',
      },
      lineWrap: {
        title: 'Line Wrap',
      },
      indent: {
        title: 'Code Indent',
        tabIndent: 'Replace Spaces equal to Tab width with tabs',
        indentSpaces: 'Indent spaces',
      },
      fonts: {
        title: 'Fonts',
        fontFamily: 'Font family',
        fontSize: 'Font size',
      },
      headTags: {
        title: 'Tags of <head>',
        describe: 'Type the tags you want to add to <head> like <meta...>'
      }
    },
    download: {
      title: 'File Download',
      single: {
        title: 'Single File',
        describe: 'Integrate html, css and javaScript code into an single HTML file.',
      },
      multiple: {
        title: 'Multiple Files',
        describe: 'Generate html, css and js files and put them into folders.',
      },
      preCompile: {
        title: 'Download the pre-compile file',
        describe:
          'If you are using a preprocessor language, selecting this option will download the pre-compiled files.',
      },
      downloadBtn: 'Download',
    },
    shortcuts: {
      title: 'Shortcuts',
      common: 'Common',
      markdownList: [
        'Bold',
        'Italic',
        'Line through',
        'Link',
        'Picture',
        'Quote',
        'Code',
        'Unordered list',
        'Ordered list',
        'Line',
        'List editing',
      ],
      commonList: [
        'Indent code',
        'Format code',
        'Turn on smart tips',
        'Fold the code',
        'Toggle comment on selected lines',
        'Duplicate line',
        'Select the current row',
        'Swap line up',
        'Swap line down',
        'Focus into HTML editor',
        'Focus into CSS editor',
        'Focus into JS editor',
        'Indent code left',
        'Indent code right',
        'Code search',
        'Code replace',
        'Jump to line',
      ],
    },
  },
  instance: {
    loader: {
      init: 'Initializing the instance, please wait...',
      load: 'Load the instance, please wait...',
    },
    header: {
      instanceInfo: {
        name: 'Name',
        describe: 'Describe...',
        save: 'Save',
      },
    },
    sidebar: ['Preprocessor', 'Library', 'Settings', 'Upload', 'Download', 'Shortcuts', 'Switch Languages', 'Github'],
    viewTools: {
      refresh: 'Refresh',
      fullScreen: 'Full Screen',
    },
  },
  console: {
    tools: {
      filters: 'Filters',
      settings: 'Settings',
      recycle: 'Clear Logs',
      minimal: 'Minimal',
    },
    settings: {
      clear: {
        title: 'Auto clears the history log',
        describe:
          'Selecting this option will clear the previously generated history logs before each code execution. You may choose to keep the history logs, but this may affect performance.',
      },
      highlight: {
        title: 'Highlight',
        describe: 'Select this option and the log contents will be highlighted.',
      },
    },
  },
}
