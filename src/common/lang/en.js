module.exports = {
  // 浏览器版本提醒
  browserTip: 'Please use the latest version of chrome for the best experience!',
  // 侧边栏
  sbOpt: [
    'Setting',
    'Upload&Download',
    'Color',
    'Language',
    'New Feature',
    'Question',
    'Github'
  ],
  // 用户界面侧边栏
  userSbOpt: [
    'New Project',
    'Personal Setting',
    'Language',
    'New Feature',
    'Github',
    'Log Out'
  ],
  // 支持
  support: {
    title: 'Support JS-ENCODER?',
    content: 'Then give the author some rewards!',
    btn: 'Support Me!'
  },
  // 页脚
  footer: {
    describe: 'A platform for users to write and store code online.',
    function: 'Functions',
    email: 'Email',
    github: 'GitHub',
    MIT: 'Agreement',
    log: 'Update Log'
  },
  // 用户项目信息
  profileInfo: {
    projectNum: 'Projects: ',
    recycleNum: 'Recycle: ',
    filter: {
      search: {
        name: 'NAME',
        placeholder: 'Search Project Name'
      },
      tags: {
        name: 'TAGS',
        placeholder: 'Search Tags'
      },
      sort: {
        name: 'SORT',
        placeholder: 'Sort By',
        sortList: [
          {
            value: 'Date Created',
            label: 'DateCreated'
          },
          {
            value: 'Date Updated',
            label: 'DateUpdated'
          }
        ]
      },
      order: {
        name: 'ORDER'
      }
    },
    projectDetail: {
      projectMenuList: ['Tags', 'Edit', 'Delete', 'recover'],
      rename: 'Rename The Project',
    },
    projectType: ['projects', 'recycle', 'search'],
    blankTip: 'No Project',
    create: 'Create',
    blankCycle: 'Absolutely Empty',
    deleteTip: {
      title: 'Delete Project',
      content: 'Make sure to delete the current project?',
      cancel: 'Cancel',
      confirm: 'Delete',
      describe: 'Deleted project will be moved to the recycle bin and cleared in two weeks',
      success: 'Project has been moved to the recycle bin',
      fail: 'Project deletion failed'
    },
    tagsTip: {
      title: 'Edit Tags',
      cancel: 'Cancel',
      confirm: 'Confirm',
      success: 'Tags updated successfully',
      fail: 'Tag update failed'
    },
    recoverTip: {
      title: 'Restore The Project',
      content: 'Are you sure to restore this project?',
      describe: 'This project will revert to the unrecycled state',
      cancel: 'Cancel',
      confirm: 'Confirm',
      success: 'Restore Project successful',
      fail: 'Restore Project failed'
    }
  },
  // 侧边栏延申
  secSbOpt: {
    conf: ['Preprocessor', 'Library', 'More'],
    ud: ['Upload', 'Download'],
    color: ['Switch', 'Select'],
    lang: ['简体中文', 'English'],
    help: ['Shortcut', 'Feedback']
  },
  tabsCommands: [
    'Run'
  ],
  tabsMenu: [
    'Reset code',
    'Fullscreen view'
  ],
  slideUserMenu: [
    'Workspace',
    'Setting',
    'Recycle bin',
    'Sign out'
  ],
  loginHint: 'Log in to view user information',
  loginBtn: 'Log in with github',
  dialogInfo: {
    preprocessor: {
      title: 'Preprocessor'
    },
    library: {
      title: 'Library',
      cssTitle: 'Add external styles',
      jsTitle: 'Add external scripts',
      cssDescribe: 'The links added here are all run in order before running CSS, links that support the HTTP or HTTPS protocols',
      jsDescribe: 'The links added here are all run in order before running JavaScript, links that support the HTTP or HTTPS protocols',
      add: 'Add'
    },
    more: {
      title: 'More',
      waitTime: 'Waiting Time',
      waitTimeDescribe: 'After you finish the code,we will wait for some time to execute it',
      autoExecute: 'Auto-run',
      autoExecuteDescribe: 'Turning on auto-execute automatically updates the view, and turning this option off requires that the view be updated when the RUN button is clicked',
      replaceTab: 'Replace Spaces equal to TAB width with TAB',
      showHistoryLog: 'Show Console History Log',
      showHistoryLogDescribe: 'When this option is selected, the Console history log is not cleared for code updates, but it can affect performance',
      tabIndent: 'Tab Indent Width'
    },
    upload: {
      title: 'Upload',
      describe: 'Upload Local File, the format contains html, css, js, md, sass, scss, less, styl, ts and coffee. The file content overwrites the editor content.',
      chooseBtn: 'choose',
      uploadBtn: 'upload',
      chooseFiles: 'The file you selected',
      fileWarn: 'Show only files that format is right'
    },
    download: {
      title: 'Download',
      singleFileTitle: 'Single file download',
      singleFileDescribe: 'Combine HTML, CSS, JS into one file',
      multiFileTitle: 'Multi-file download',
      multiFileDescribe: 'Separate HTML, CSS, JS into multiple files and put them in a folder',
      beforeCompile: 'Download the file before compilation',
      downloadBtn: 'download'
    },
    switch: {
      title: 'Color format switch',
      switchDescribe: 'RGB and HEX convert to each other'
    },
    select: {
      title: 'Color table',
      selectDescribe: 'Click to copy the HEX color to the clipboard',
      GAndB: 'Green/Blue',
      RAndB: 'Red/Blue',
      RAndG: 'Red/Green',
      Gray: 'Gray',
      inform: 'Color has been added to the clipboard'
    },
    newFeature: {
      title: 'New Feature',
      featureList: [],
      noFeature: 'No update'
    },
    shortcut: {
      title: 'Shortcut Key',
      shortcutList: [
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
        'Jump to line'
      ]
    },
    feedback: {
      title: 'Feedback',
      feedbackDescribe: 'If you find bugs, you can give feedback on github',
      toFeedback: 'To feedback'
    },
    newProject: {
      title: 'Create Project',
      name: 'Project Name',
      tagsDescribe: 'Add tags to your project (press enter to add, no more than three)',
      tags: 'Tags'
    },
    personalSetting: {
      title: 'Personal Setting',
      clearLocal: 'Clear local cookies',
      clearDescribe: 'The cookies contains personal Settings and other information',
      clearBtn: 'Clear',
      clearInfo: 'Cookies deleted',
      defaultPrep: 'Default Preprocessor',
      defaultCode: 'Default Initial Code',
      codePlaceholder: 'Please enter the initial code'
    },
    welcome: {
      title: 'JS-ENCODER',
      first: '：) Welcome Come To',
      introduce: 'JS-ENCODER is a platform for users to edit and save front-end code online.\nJS-ENCODER supports compilation of multiple front-end languages (including preprocessing languages), external links to introduce, but also provides file upload, download, shortcut keys, color board and other auxiliary functions.',
      important: 'The moooooooost important thing is, JS-ENCODER does not need to open the local editor software, you can smoothly edit code and real-time display effect!!!',
      try: 'What are you waiting for? Come and experience it!'
    },
    logOut: {
      title: 'Logout',
      describe: 'Logout will exit the current account, and any locally retained user configuration information will be cleared',
      describeExtra: 'Until you successfully log in next time, you cannot log in automatically when entering JS-ENCODER',
      content: 'Make sure to log out of JS-ENCODER?',
      confirm: 'Logout',
      cancel: 'Nah'
    }
  }
}