import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import Loading from 'components/Loading';

import { DocLink, Icon } from 'components/Base';

import styles from './index.scss';

@withTranslation()
@inject('rootStore')
@observer
export class Stepper extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    header: PropTypes.string,
    headerCls: PropTypes.string,
    i18nObj: PropTypes.object,
    name: PropTypes.string,
    stepOption: PropTypes.shape({
      linkUrl: PropTypes.string,
      activeStep: PropTypes.number,
      steps: PropTypes.number,
      stepBase: PropTypes.number,
      prevStep: PropTypes.func,
      disableNextStep: PropTypes.bool,
      isLoading: PropTypes.bool,
      nextStep: PropTypes.func
    }),
    titleCls: PropTypes.string
  };

  get activeStep() {
    const { activeStep, stepBase } = this.props.stepOption;
    if (!_.isNumber(stepBase)) {
      return activeStep;
    }
    return activeStep + 1 - stepBase;
  }

  t(keys, options) {
    const { i18nObj, t } = this.props;
    return t(keys, _.assign({}, options, i18nObj));
  }

  // if next stop button is disabled, can't execution click method
  nextStep = () => {
    const { nextStep, disableNextStep } = this.props.stepOption;

    if (!disableNextStep) {
      nextStep();
    }
  };

  renderTopProgress() {
    const { stepOption } = this.props;
    const { steps, activeStep } = stepOption;
    const width = `${(activeStep * 100) / steps}%`;
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
      name, stepOption, history, rootStore
    } = this.props;
    const {
      activeStep, steps, prevStep, goBack
    } = stepOption;
    const funcBack = _.isFunction(goBack) ? goBack : history.goBack;

    if (activeStep > steps) {
      return null;
    }

    let text = '';
    if (this.activeStep > 1 && !!name) {
      text = this.t(`STEPPER_HEADER_${name.toUpperCase()}_${activeStep}`);
    }

    return (
      <div
        className={classnames(styles.operate, {
          [styles.normalUser]: rootStore.user.isNormal
        })}
      >
        {this.activeStep > 1 && (
          <label data-cy="prevStep" onClick={prevStep}>
            <Icon name="previous" size={20} type="dark" />
            {this.t('Back')}&nbsp;
            <span className={styles.operateText}>{text}</span>
          </label>
        )}
        <label className="pull-right" onClick={funcBack}>
          {this.t('Esc')}&nbsp;
          <Icon name="close" size={20} type="dark" />
        </label>
      </div>
    );
  }

  renderTitle() {
    const {
      name, stepOption, header, headerCls, titleCls
    } = this.props;
    const { activeStep, steps } = stepOption;

    if (this.activeStep > steps) {
      return null;
    }

    const nameKey = name.toUpperCase();
    const headerName = header
      || this.t(`STEPPER_NAME_${nameKey}_HEADER`, {
        activeStep: this.activeStep,
        steps
      });
    const title = this.t(`STEPPER_TITLE_${nameKey}_${activeStep}`);

    return (
      <div className={classnames(styles.stepContent)}>
        <div className={classnames(styles.stepName, headerCls)}>
          {headerName}
        </div>
        <div className={classnames(styles.stepExplain, titleCls)}>{title}</div>
      </div>
    );
  }

  renderFooter() {
    const { stepOption, name } = this.props;
    const {
      activeStep, steps, disableNextStep, btnText, linkUrl
    } = stepOption;

    if (this.activeStep > steps) {
      return null;
    }

    const keyName = `STEPPER_FOOTER_${name.toLocaleUpperCase()}_${activeStep}`;
    const tipText = this.t(keyName);
    const tipLink = <DocLink name={keyName} to={linkUrl} />;

    const buttonText = activeStep === steps ? this.t('Done') : this.t('Go on');

    return (
      <div className={styles.footer}>
        <span className={styles.footerTips}>
          <span className={styles.footerTipsButton}>{this.t('Tips')}</span>
          {tipText}
          {tipLink}
        </span>
        <button
          className={classnames(styles.button, {
            [styles.buttonActived]: !disableNextStep
          })}
          type="primary"
          data-cy="nextStep"
          data-disable={disableNextStep}
          onClick={this.nextStep}
        >
          {!btnText && activeStep === steps && (
            <Icon className={styles.icon} name="checked-icon" size={20} />
          )}
          <span>{this.t(btnText || buttonText)}</span>
          {!btnText && activeStep !== steps && (
            <Icon className={styles.icon} name="next-icon" size={20} />
          )}
        </button>
      </div>
    );
  }

  render() {
    const { className, children, stepOption } = this.props;
    return (
      <div className={classnames(styles.stepper, className)}>
        {this.renderTopProgress()}
        {this.renderTopNav()}
        {this.renderTitle()}
        <div className={styles.mainContent}>
          <Loading isLoading={stepOption.isLoading}>{children}</Loading>
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}

export default withRouter(Stepper);
