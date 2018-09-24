import React from 'react';
import { I18n } from 'react-i18next';

const ContextMenu = ({ cluster_id, status, handleAction, showOperateCluster }) => {
  return (
    <I18n>
      {t => (
        <div id={cluster_id} className="operate-menu">
          <Link to={`/dashboard/cluster/${cluster_id}`}>{t('View detail')}</Link>
          {status === 'stopped' && (
            <span onClick={() => showOperateCluster(cluster_id, 'start')}>
              {t('Start cluster')}
            </span>
          )}
          {status === 'active' && (
            <span onClick={() => showOperateCluster(cluster_id, 'stop')}>{t('Stop cluster')}</span>
          )}
          {status !== 'deleted' && (
            <span onClick={() => showOperateCluster(cluster_id, 'delete')}>
              {t('Delete cluster')}
            </span>
          )}
        </div>
      )}
    </I18n>
  );
};

export default ContextMenu;
