import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

class IronImage extends Component {
  static propTypes = {
    src: PropTypes.string, // real loaded image
    preload: PropTypes.string
  };

  static defaultProps = {
    src: '',
    preload: '/assets/none.svg'
  };

  constructor(props) {
    super(props);
    this.ironImageHd = null;
  }

  componentDidMount() {
    const { src } = this.props;

    const hdLoaderImg = new Image();
    hdLoaderImg.src = src;

    hdLoaderImg.onload = () => {
      this.ironImageHd.setAttribute('style', `background-image: url('${src}')`);
      this.ironImageHd.classList.add(styles.fadeIn);
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.loaded} ref={c => (this.ironImageHd = c)} />
        <div
          className={styles.preload}
          style={{ backgroundImage: `url('${this.props.preload}')` }}
        />
      </div>
    );
  }
}

export default IronImage;
