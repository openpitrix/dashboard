import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { Link, Icon } from 'components/Base';

import styles from './index.scss';

@translate()
class LayoutStepper extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    name: PropTypes.string,
    store: PropTypes.shape({
      activeStep: PropTypes.number,
      steps: PropTypes.number,
      prevStep: PropTypes.func,
      disableNextStep: PropTypes.bool,
      nextStep: PropTypes.func
    })
  };

  renderTopNav() {
    const {
      name, store, t, history
    } = this.props;
    const {
      activeStep, steps, prevStep, goBack
    } = store;
    const funcBack = _.isFunction(goBack) ? goBack : history.goBack;

    if (activeStep > steps) {
      return null;
    }

    let text = '';
    if (activeStep > 1 && !!name) {
      text = t(`STEPPER_HEADER_${name.toUpperCase()}_${activeStep}`);
    }

    return (
      <div className={styles.operate}>
        {activeStep > 1 && (
          <label onClick={prevStep}>
            ←&nbsp;{t('Back')}&nbsp;
            <span className={styles.operateText}>{text}</span>
          </label>
        )}
        <label className="pull-right" onClick={funcBack}>
          {t('Esc')}&nbsp;
          <Icon name="close" size={20} type="dark" />
        </label>
      </div>
    );
  }

  renderTitle() {
    const { name, store, t } = this.props;
    const { activeStep, steps } = store;

    if (activeStep > steps) {
      return null;
    }

    const NAME = name.toUpperCase();
    const header = t(`STEPPER_NAME_${NAME}_HEADER`, {
      activeStep,
      steps
    });
    const title = t(`STEPPER_TITLE_${NAME}_${activeStep}`);
    return (
      <div className={classnames(styles.stepContent)}>
        <div className={styles.stepName}>{header}</div>
        <div className={styles.stepExplain}>{title}</div>
      </div>
    );
  }

  renderFooter() {
    const {
      t, store, name, disableNextStep
    } = this.props;
    const { activeStep, steps, nextStep } = store;

    if (activeStep > steps) {
      return null;
    }

    const NAME = `STEPPER_FOOTER_${name.toLocaleUpperCase()}_${activeStep}`;
    const tipText = t(NAME);
    const tipLink = <Link type={NAME} />;

    const buttonText = t('Go on');

    return (
      <div className={styles.footer}>
        <span className={styles.footerTips}>
          <span className={styles.footerTipsButton}>{t('Tips')}</span>
          {tipText}
          {tipLink}
        </span>
        <button
          className={classnames(styles.button, {
            [styles.buttonActived]: !disableNextStep
          })}
          type="primary"
          onClick={nextStep}
        >
          {/*
              {activeStep === steps && <Icon className={styles.icon} name="checked-icon" size={20} />}
            */}
          <span>{buttonText}</span>
          <Icon className={styles.icon} name="next-icon" size={20} />
          {/*
              {activeStep !== steps && <Icon className={styles.icon} name="next-icon" size={20} />}
            */}
        </button>
      </div>
    );
  }

  render() {
    const { className, children, store } = this.props;
    const { steps, activeStep } = store;
    const width = `${activeStep * 100 / steps}%`;
    return (
      <div className={classnames(styles.layout)}>
        <div style={{ width }} className={styles.headerStep} />
        {this.renderTopNav()}
        {this.renderTitle()}
        <div className={className}>{children}</div>
        {this.renderFooter()}
      </div>
    );
  }
}

export default withRouter(LayoutStepper);
