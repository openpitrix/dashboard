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
    headerCls: PropTypes.string,
    name: PropTypes.string,
    stepOption: PropTypes.shape({
      activeStep: PropTypes.number,
      steps: PropTypes.number,
      prevStep: PropTypes.func,
      disableNextStep: PropTypes.bool,
      isLoading: PropTypes.bool,
      nextStep: PropTypes.func
    }),
    titleCls: PropTypes.string
  };

  renderTopProgress() {
    const { stepOption } = this.props;
    const { steps, activeStep } = stepOption;
    const width = `${activeStep * 100 / steps}%`;
    const className = activeStep > steps ? 'headerStepFinished' : 'headerStepNotFinished';

    const style = {
      width,
      transition: `width 500ms ease`
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
    const {
      name, stepOption, headerCls, titleCls, t
    } = this.props;
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
        <div className={classnames(styles.stepName, headerCls)}>{header}</div>
        <div className={classnames(styles.stepExplain, titleCls)}>{title}</div>
      </div>
    );
  }

  renderFooter() {
    const { t, stepOption, name } = this.props;
    const {
      activeStep,
      steps,
      nextStep,
      disableNextStep,
      btnText
    } = stepOption;

    if (activeStep > steps) {
      return null;
    }

    const keyName = `STEPPER_FOOTER_${name.toLocaleUpperCase()}_${activeStep}`;
    const tipText = t(keyName);
    const tipLink = <DocLink name={keyName} />;

    const buttonText = activeStep === steps ? t('Done') : t('Go on');
    const iconName = activeStep === steps ? 'checked-icon' : 'next-icon';

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
          <Icon className={styles.icon} name={iconName} size={20} />
          <span>{t(btnText || buttonText)}</span>
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
          <div className={classnames(styles.mainContent, className)}>
            {children}
          </div>
        </Loading>
        {this.renderFooter()}
      </div>
    );
  }
}

export default withRouter(LayoutStepper);
