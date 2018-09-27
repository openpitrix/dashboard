import React from 'react';

export default function renderHandleMenu({ item, t, clusterStore, runtimeStore, page = 'index' }) {
  const { showOperateCluster } = clusterStore;
  const { cluster_id, status, runtime_id } = item;
  let { isKubernetes } = runtimeStore;
  if (page === 'index') {
    isKubernetes = runtimeStore.checkKubernetes(runtime_id);
  }
  const renderBtn = (type, text) => (
    <span onClick={() => showOperateCluster(cluster_id, type)}>{text}</span>
  );

  return (
    <div id={cluster_id} className="operate-menu">
      {page === 'index' && <Link to={`/dashboard/cluster/${cluster_id}`}>{t('View detail')}</Link>}
      {!isKubernetes && status === 'stopped' && renderBtn('start', t('Start cluster'))}
      {!isKubernetes && status === 'active' && renderBtn('stop', t('Stop cluster'))}
      {isKubernetes && status === 'deleted' && renderBtn('cease', t('Cease cluster'))}
      {isKubernetes && status !== 'deleted' && renderBtn('rollback', t('Rollback cluster'))}
      {isKubernetes && status !== 'deleted' && renderBtn('update_env', t('Update cluster env'))}
      {isKubernetes && status !== 'deleted' && renderBtn('upgrade', t('Upgrade cluster'))}
      {status !== 'deleted' && renderBtn('delete', t('Delete cluster'))}
    </div>
  );
}
