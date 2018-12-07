import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import _ from 'lodash';
import Loading from 'components/Loading';

import { DocLink, Icon } from 'components/Base';

import styles from './index.scss';

@translate()
@observer
class LayoutStepper extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    name: PropTypes.string,
    stepOption: PropTypes.shape({
      activeStep: PropTypes.number,
      steps: PropTypes.number,
      prevStep: PropTypes.func,
      disableNextStep: PropTypes.bool,
      isLoading: PropTypes.bool,
      nextStep: PropTypes.func
    })
  };

  renderTopProgress() {
    const { stepOption } = this.props;
    const { steps, activeStep } = stepOption;
    const width = `${activeStep * 100 / steps}%`;
    const className = activeStep > steps ? 'headerStepFinished' : 'headerStepNotFinished';

    const style = {
      width
    };

    return (
      <div
        style={style}
        className={classnames(styles.headerStep, styles[className])}
      />
    );
  }

  renderTopNav() {
    const {
      name, stepOption, t, history
    } = this.props;
    const {
      activeStep, steps, prevStep, goBack
    } = stepOption;
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
    const { name, stepOption, t } = this.props;
    const { activeStep, steps } = stepOption;

    if (activeStep > steps) {
      return null;
    }

    const nameKey = name.toUpperCase();
    const header = t(`STEPPER_NAME_${nameKey}_HEADER`, {
      activeStep,
      steps
    });
    const title = t(`STEPPER_TITLE_${nameKey}_${activeStep}`);
    return (
      <div className={classnames(styles.stepContent)}>
        <div className={styles.stepName}>{header}</div>
        <div className={styles.stepExplain}>{title}</div>
      </div>
    );
  }

  renderFooter() {
    const {
      t, stepOption, name, disableNextStep
    } = this.props;
    const { activeStep, steps, nextStep } = stepOption;

    if (activeStep > steps) {
      return null;
    }

    const keyName = `STEPPER_FOOTER_${name.toLocaleUpperCase()}_${activeStep}`;
    const tipText = t(keyName);
    const tipLink = <DocLink name={keyName} />;

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
    const { className, children, stepOption } = this.props;
    return (
      <div className={classnames(styles.layout)}>
        {this.renderTopProgress()}
        {this.renderTopNav()}
        {this.renderTitle()}
        <Loading isLoading={stepOption.isLoading}>
          <div className={className}>{children}</div>
        </Loading>
        {this.renderFooter()}
      </div>
    );
  }
}

export default withRouter(LayoutStepper);
