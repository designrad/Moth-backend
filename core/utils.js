module.exports = {
  generateRandomString: (length = 32) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvmxyz-+=*$%#@?!0123456789";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },
  changeSessionData: (session, object) => {
    return Object.assign({}, session.data, object);
  },
  clearSessionData: () => {
    return undefined;
  }
}