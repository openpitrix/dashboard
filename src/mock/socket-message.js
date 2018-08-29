// mock socket messages for start cluster

const messages = [
  {
    type: 'create',
    resource: {
      rtype: 'job',
      rid: 'j-nXlExrDjKD1x',
      values: { app_id: '', cluster_id: 'cl-z8q7v1zxkjmq26', status: 'pending' }
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
      rid: 'cl-z8q7v1zxkjmq26',
      values: { transition_status: 'starting' }
    }
  },

  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-N32EjM3Mz5W2',
      values: { transition_status: 'starting' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-RD7QqGMGOp1M',
      values: { transition_status: 'starting' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-VKDmmW1WmE5X',
      values: { transition_status: 'starting' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-RD7QqGMGOp1M', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-RD7QqGMGOp1M', values: { status: 'active' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-VKDmmW1WmE5X', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-VKDmmW1WmE5X', values: { status: 'active' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-N32EjM3Mz5W2', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-N32EjM3Mz5W2', values: { status: 'active' } }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-RD7QqGMGOp1M',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-N32EjM3Mz5W2',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-VKDmmW1WmE5X',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-RD7QqGMGOp1M', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-VKDmmW1WmE5X', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-N32EjM3Mz5W2', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-RD7QqGMGOp1M',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-VKDmmW1WmE5X',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-N32EjM3Mz5W2',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-RD7QqGMGOp1M', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-VKDmmW1WmE5X', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-N32EjM3Mz5W2', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-RD7QqGMGOp1M',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-VKDmmW1WmE5X',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: {
      rtype: 'cluster_node',
      rid: 'cln-N32EjM3Mz5W2',
      values: { transition_status: 'updating' }
    }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-RD7QqGMGOp1M', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-N32EjM3Mz5W2', values: { transition_status: '' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster_node', rid: 'cln-VKDmmW1WmE5X', values: { transition_status: '' } }
  },

  {
    type: 'update',
    resource: { rtype: 'cluster', rid: 'cl-z8q7v1zxkjmq26', values: { status: 'active' } }
  },
  {
    type: 'update',
    resource: { rtype: 'job', rid: 'j-nXlExrDjKD1x', values: { status: 'successful' } }
  },
  {
    type: 'update',
    resource: { rtype: 'cluster', rid: 'cl-z8q7v1zxkjmq26', values: { transition_status: '' } }
  }
];

export const mockSocketData = sockClient => {
  // a full start cluster cycle
  const wait = time => new Promise(resolve => setTimeout(resolve, time));
  const sendMsg = msg => {
    console.log('emit: ', msg);
    sockClient.emit(`ops-resource`, msg);
  };

  let curMsg,
    len = messages.length;
  while ((curMsg = messages.shift())) {
    let idx = len - messages.length;
    wait(idx * 1000).then(sendMsg.bind(null, curMsg));
  }
};
