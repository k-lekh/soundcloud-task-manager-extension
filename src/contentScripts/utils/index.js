import md5 from "md5";

export const getTaskId = ({ userName, timeLink, commentText }) => md5([userName, timeLink, commentText].join('|'));