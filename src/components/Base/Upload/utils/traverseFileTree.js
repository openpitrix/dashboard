const traverseFileTree = (files, callback, isAccepted) => {
  const traverse = (item, path) => {
    const currentPath = path || '';
    if (item.isFile) {
      item.file(file => {
        if (isAccepted(file)) {
          callback([file]);
        }
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();

      dirReader.readEntries(entries => {
        entries.forEach(entrieItem => {
          traverse(entrieItem, `${currentPath}${item.name}/`);
        });
      });
    }
  };

  files.forEach(file => {
    traverse(file.webkitGetAsEntry());
  });
};

export default traverseFileTree;
