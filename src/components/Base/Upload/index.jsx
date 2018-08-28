import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import defaultRequest from './utils/request';
import attrAccept from './utils/attr-accept';
import traverseFileTree from './utils/traverseFileTree';

const now = +new Date();
let index = 0;

function getUid() {
  index += 1;
  return `upload-${now}-${index}`;
}

export default class Upload extends Component {
  reqs = {};

  static propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    directory: PropTypes.bool,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    onProgress: PropTypes.func,
    onStart: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    headers: PropTypes.object,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    beforeUpload: PropTypes.func,
    customRequest: PropTypes.func,
    children: PropTypes.node,
    withCredentials: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string
  };

  static defaultProps = {
    data: {},
    headers: {},
    name: 'file',
    onStart: noop,
    onError: noop,
    onSuccess: noop,
    multiple: false,
    beforeUpload: null,
    customRequest: null,
    withCredentials: false
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
      this.upload(fileWithId, postFiles);
    });
  };

  upload(file, fileList) {
    const { beforeUpload } = this.props;
    if (!beforeUpload) {
      // always async in case use react state to keep fileList
      return setTimeout(() => this.post(file), 0);
    }

    const before = beforeUpload(file, fileList);

    if (before && before.then) {
      before.then(processedFile => {
        const processedFileType = Object.prototype.toString.call(processedFile);
        if (processedFileType === '[object File]' || processedFileType === '[object Blob]') {
          return this.post(processedFile);
        }
        return this.post(file);
      });
    } else if (before !== false) {
      setTimeout(() => this.post(file), 0);
    }

    return true;
  }

  post(file) {
    if (!this.uploaderMounted) return;

    const {
      data,
      onStart,
      onProgress,
      onSuccess,
      onError,
      action,
      customRequest,
      name,
      headers,
      withCredentials
    } = this.props;

    let currentData = data;

    if (typeof currentData === 'function') {
      currentData = currentData(file);
    }
    new Promise(resolve => {
      if (typeof action === 'function') {
        return resolve(action(file));
      }
      return resolve(action);
    }).then(currentAction => {
      const { uid } = file;
      const request = customRequest || defaultRequest;
      this.reqs[uid] = request({
        file,
        headers,
        withCredentials,
        action: currentAction,
        filename: name,
        data: currentData,
        onProgress: onProgress
          ? e => {
              onProgress(e, file);
            }
          : null,
        onSuccess: (res, xhr) => {
          delete this.reqs[uid];
          onSuccess(res, file, xhr);
        },
        onError: (err, res) => {
          delete this.reqs[uid];
          onError(err, res, file);
        }
      });
      onStart(file);
    });
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
    const { className, disabled, style, multiple, accept, children, directory } = this.props;

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
        className={classNames('upload', {
          'upload-dragover': this.state.isDraging,
          'upload-disabled': disabled,
          className
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
