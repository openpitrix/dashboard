import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import attrAccept from './utils/attr-accept';
import traverseFileTree from './utils/traverseFileTree';

import './index.scss';

const now = Date.now();
let index = 0;

function getUid() {
  index += 1;
  return `upload-${now}-${index}`;
}

export default class Upload extends Component {
  static propTypes = {
    accept: PropTypes.string,
    checkFile: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    directory: PropTypes.bool,
    disabled: PropTypes.bool,
    headers: PropTypes.object,
    multiple: PropTypes.bool,
    style: PropTypes.object,
    uploadFile: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    headers: {},
    uploadFile: noop,
    checkFile: noop,
    multiple: false
  };

  state = {
    uid: getUid(),
    isDraging: false
  };

  componentDidMount() {
    this.uploaderMounted = true;
  }

  componentWillUnmount() {
    this.uploaderMounted = false;
    this.abort();
  }

  reqs = {};

  onChange = e => {
    const { files } = e.target;
    this.uploadFiles(files);
    this.reset();
  };

  onClick = () => {
    if (!this.fileInput) return;
    this.fileInput.click();
  };

  onKeyDown = e => {
    if (e.key === 'Enter') {
      this.onClick();
    }
  };

  onFileDrop = e => {
    e.preventDefault();

    if (e.type === 'dragover') {
      this.setState({ isDraging: true });
      return;
    }

    if (e.type === 'dragleave') {
      this.setState({ isDraging: false });
      return;
    }

    if (e.type === 'drop') {
      this.setState({ isDraging: false });

      const accept = _file => attrAccept(_file, this.props.accept);
      if (this.props.directory) {
        traverseFileTree([...e.dataTransfer.items], this.uploadFiles, accept);
      } else {
        const files = [...e.dataTransfer.files].filter(accept);
        this.uploadFiles(files);
      }
    }
  };

  uploadFiles = files => {
    const postFiles = [...files];
    postFiles.forEach(file => {
      const fileWithId = Object.assign(file, { uid: getUid() });
      this.upload(fileWithId);
    });
  };

  upload(file) {
    const { checkFile, uploadFile } = this.props;
    if (checkFile !== noop && checkFile(file)) {
      const reader = new FileReader();
      reader.readAsDataURL(file, 'UTF-8');
      reader.onload = function () {
        let fileStringBase64 = this.result;
        fileStringBase64 = fileStringBase64.substring(
          fileStringBase64.indexOf(',') + 1,
          fileStringBase64.length
        );
        uploadFile(fileStringBase64, file);
      };
    }
  }

  reset() {
    this.setState({
      uid: getUid()
    });
  }

  abort(file) {
    const { reqs } = this;
    if (file) {
      const uid = file && file.uid ? file.uid : file;
      if (reqs[uid]) {
        reqs[uid].abort();
        delete reqs[uid];
      }
    } else {
      Object.keys(reqs).forEach(uid => {
        if (reqs[uid]) {
          reqs[uid].abort();
        }

        delete reqs[uid];
      });
    }
  }

  render() {
    const {
      className,
      disabled,
      style,
      multiple,
      accept,
      children,
      directory
    } = this.props;

    const events = disabled
      ? {}
      : {
        onClick: this.onClick,
        onKeyDown: this.onKeyDown,
        onDrop: this.onFileDrop,
        onDragOver: this.onFileDrop,
        onDragLeave: this.onFileDrop
      };

    return (
      <span
        {...events}
        className={classNames(className, 'upload', {
          'upload-dragover': this.state.isDraging,
          'upload-disabled': disabled
        })}
        role="button"
        style={style}
      >
        <input
          type="file"
          ref={n => {
            this.fileInput = n;
          }}
          key={this.state.uid}
          style={{ display: 'none' }}
          accept={accept}
          directory={directory ? 'directory' : null}
          webkitdirectory={directory ? 'webkitdirectory' : null}
          multiple={multiple}
          onChange={this.onChange}
        />
        {children}
      </span>
    );
  }
}
