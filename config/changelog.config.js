/* eslint-disable */
/*
 ref: https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/master/index.js
 */
const parserOpts = {
  headerPattern: /^(\w*)(?:\((.*)\))?\: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash']
};

const issueIds = new Set();
const regSubjectIssue = /\(#(\d+)\)/;

const writerOpts = {
  transform: function(commit) {
    // strip commit with unique issue id
    if (typeof commit.subject === 'string' && commit.subject) {
      let matchIssue = commit.subject.match(regSubjectIssue);
      if (matchIssue && matchIssue[1]) {
        let id = matchIssue[1];

        if (!issueIds.has(id)) {
          issueIds.add(id);
        } else {
          return;
        }
      }
    }

    // let discard = true;
    // let issues = [];
    //
    // commit.notes.forEach(function(note) {
    //   note.title = 'BREAKING CHANGES';
    //   discard = false;
    // });

    if (commit.type === 'feat') {
      commit.type = 'Features';
    } else if (commit.type === 'fix') {
      commit.type = 'Bug Fixes';
    } else if (commit.type === 'perf') {
      commit.type = 'Performance Improvements';
    } else if (commit.type === 'revert') {
      commit.type = 'Reverts';
    } else if (commit.type === 'docs') {
      commit.type = 'Documentation';
    } else if (commit.type === 'style') {
      commit.type = 'Styles';
    } else if (commit.type === 'refactor') {
      commit.type = 'Code Refactoring';
    } else if (commit.type === 'test') {
      commit.type = 'Tests';
    } else if (commit.type === 'chore') {
      commit.type = 'Chores';
    }

    if (commit.scope === '*') {
      commit.scope = '';
    }

    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7);
    }
    return commit;
  },

  groupBy: 'type',
  // commitGroupsSort: (commit)=> console.log(commit),
  commitsSort: 'committerDate'
  // noteGroupsSort: 'title',
  // notesSort: compareFunc
};

module.exports = {
  // parserOpts,
  writerOpts
};
