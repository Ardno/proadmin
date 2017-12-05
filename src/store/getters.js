const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  password: state => state.user.password,
  useinfo: state => state.user.useinfo,
  msgcount: state => state.user.msgcount,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  messageList: state => state.webim.messageList,
  imUserinfo: state => state.webim.imUserinfo,
  commonInfo: state => state.user.commonInfo
}
export default getters
