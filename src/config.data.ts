import { LIKES_FM_TASKS } from "src/tasks";
import type { ServiceConfig } from "src/types/services";

export const SERVICES = [
  {
    id: "habrcareer",
    name: "Habr Career",
    url: "https://career.habr.com",
    pattern: "*://career.habr.com/*",
    icon: "https://career.habr.com/favicon.ico",
    modules: [
      { id: "Friends", name:"Friends", title: "Автоматические подписки", default: true, }
    ],
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com",
    pattern: "*://github.com//*",
    icon: "https://github.com/favicon.ico",
    modules: [
      { id: "Followers", name: "Followers", title: "Автоматические подписки", default: true,},
      { id: "Stars", name: "Stars", title: "Автоматические звездочки по всем репозиториям", default: false, }
    ],
  },
  {
    id: "likesfm",
    name: "Likes.FM",
    url: "https://likes.fm",
    pattern: "*://likes.fm/*",
    icon: "https://likes.fm/static/images/durov.ico",
    modules: [
      { id: LIKES_FM_TASKS.REPOST, name: "Reposts", title: "Автоматические репосты", default: false, },
      { id: LIKES_FM_TASKS.LIKE, name: "Likes", title: "Автоматические лайки", default: true, },
      { id: LIKES_FM_TASKS.SUB, name: "Subscribers", title: "Автоматические подписки на людей", default: true, },
      { id: LIKES_FM_TASKS.GROUP, name: "Members", title: "Автоматические подписки в сообщества", default: true, },
      { id: LIKES_FM_TASKS.COMMENT, name: "Comments", title: "Автоматические комментарии", default: false, },
      { id: LIKES_FM_TASKS.POLL, name: "Votings", title: "Автоматические опросы", default: false, },
    ],
  },
] as const satisfies readonly ServiceConfig[];
