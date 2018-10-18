import React, { Fragment } from 'react';

import { Button } from 'components/Base';
import Layout, { CreateResource } from 'components/Layout';
import { Group } from './Section';

import { getFormData } from 'utils';
import VMParser from 'lib/config-parser/vm';
import mockData from 'lib/config-parser/mock/elk.json';

import styles from './index.scss';

export default class TestDeploy extends React.Component {
  state = {
    loading: false
  };

  fetchData = () => new Promise(resolve => setTimeout(resolve, 500));

  componentDidMount() {
    // mock fetch data
    this.setState({ loading: true });

    this.fetchData().then(() => {
      this.parser = new VMParser(mockData);

      this.setState({ loading: false });
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log(getFormData(e.target));
  };

  handleCancelSubmit = e => {};

  renderBody() {
    if (!this.parser) {
      return null;
    }

    const groups = [].concat(
      { title: 'Basic settings', items: this.parser.getBasicSetting() },
      this.parser.getNodeSetting(),
      { title: 'Vxnet settings', items: this.parser.getVxnetSetting() }
    );

    console.log('render data: ', groups);

    return (
      <form method="post" onSubmit={this.handleSubmit}>
        <CreateResource title="Deploy App" footer={this.renderFooter()}>
          {groups.map((group, idx) => <Group detail={group} seq={idx} key={idx} />)}
        </CreateResource>
      </form>
    );
  }

  renderFooter() {
    return (
      <div className={styles.actionBtnGroup}>
        <Button htmlType="submit" type="primary" className={styles.btn}>
          Confirm
        </Button>
        <Button onClick={this.handleCancelSubmit} className={styles.btn}>
          Cancel
        </Button>
      </div>
    );
  }

  render() {
    return <Layout isLoading={this.state.loading}>{this.renderBody()}</Layout>;
  }
}
