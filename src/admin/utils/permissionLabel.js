const permissionLabel = (permission) => {
  return permission
    .replaceAll(".", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default permissionLabel;
