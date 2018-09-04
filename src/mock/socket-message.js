// mock socket messages for start cluster

const messages = [
  {
    type: 'create',
    resource: {
      rtype: 'job',
      rid: 'j-nXlExrDjKD1x',
      values: { app_id: '', cluster_id: 'cl-p2oxz33p1o1x29', status: 'pending' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'job', rid: 'j-nXlExrDjKD1x', values: { status: 'working' } }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster',
      rid: 'cl-p2oxz33p1o1x29',
      values: { transition_status: 'starting' }
    }
  },

  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-KmEwgxAD8Lyo',
      values: { transition_status: 'starting' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-Z6GVrNA6VYL5',
      values: { transition_status: 'starting' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-gPyVpGmNRVZv',
      values: { transition_status: 'starting' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-Z6GVrNA6VYL5', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-Z6GVrNA6VYL5', values: { status: 'active' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-gPyVpGmNRVZv', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-gPyVpGmNRVZv', values: { status: 'active' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-KmEwgxAD8Lyo', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-KmEwgxAD8Lyo', values: { status: 'active' } }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-Z6GVrNA6VYL5',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-KmEwgxAD8Lyo',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-gPyVpGmNRVZv',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-Z6GVrNA6VYL5', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-gPyVpGmNRVZv', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-KmEwgxAD8Lyo', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-Z6GVrNA6VYL5',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-gPyVpGmNRVZv',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-KmEwgxAD8Lyo',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-Z6GVrNA6VYL5', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-gPyVpGmNRVZv', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-KmEwgxAD8Lyo', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-Z6GVrNA6VYL5',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-gPyVpGmNRVZv',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-KmEwgxAD8Lyo',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-Z6GVrNA6VYL5', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-KmEwgxAD8Lyo', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-gPyVpGmNRVZv', values: { transition_status: '' } }
  },

  {
    type: 'update',
    resource: { rtype: 'cluster', rid: 'cl-p2oxz33p1o1x29', values: { status: 'active' } }
  },
  {
    type: 'update',
    resource: { rtype: 'job', rid: 'j-nXlExrDjKD1x', values: { status: 'successful' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster', rid: 'cl-p2oxz33p1o1x29', values: { transition_status: '' } }
  }
];

export const mockSocketData = sockClient => {
  // a full start cluster cycle
  const wait = time => new Promise(resolve => setTimeout(resolve, time));
  const sendMsg = msg => {
    console.log('emit: ', msg);
    sockClient.emit(`ops-resource`, msg);
  };

  let folkMsg = messages.slice();

  let curMsg,
    len = folkMsg.length;

  while ((curMsg = folkMsg.shift())) {
    let idx = len - folkMsg.length;
    wait(idx * 1000).then(sendMsg.bind(null, curMsg));
  }
};
