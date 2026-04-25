import { 
  Repeat2, Heart, UserPlus, Users, MessageSquare, BarChart3, Settings2, Star, UserCheck 
} from "lucide-react";

export const SUPPORTED_SERVICES = [
  {
    id: "habrcareer",
    name: "Habr Career",
    url: "https://career.habr.com",
    pattern: "*://career.habr.com/*",
    icon: "https://career.habr.com/favicon.ico",
    modules: [
      { id: "Friends", default: true, renderIcon: (props) => <UserCheck {...props} className="text-orange-400" />, }
    ],
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com",
    pattern: "*://github.com//*",
    icon: "https://github.com/favicon.ico",
    modules: [
      { id: "Followers", default: true, renderIcon: (props) => <Users {...props} className="text-green-400" />, },
      { id: "Stars", default: false, renderIcon: (props) => <Star {...props} className="text-yellow-400" />, }
    ],
  },
  {
    id: "likesfm",
    name: "Likes.FM",
    url: "https://likes.fm",
    pattern: "*://likes.fm/*",
    icon: "https://likes.fm/static/images/durov.ico",
    modules: [
      { id: "Reposts", default: false, renderIcon: (props) => <Repeat2 {...props} className="text-blue-400" />, },
      { id: "Likes", default: true, renderIcon: (props) => <Heart {...props} className="text-pink-500" />,},
      { id: "Subscribers", default: true, renderIcon: (props) => <UserPlus {...props} className="text-purple-400" />, },
      { id: "Members", default: true, renderIcon: (props) => <Users {...props} className="text-indigo-400" />, },
      { id: "Comments", default: false, renderIcon: (props) => <MessageSquare {...props} className="text-slate-400" />, },
      { id: "Votings", default: true, renderIcon: (props) => <BarChart3 {...props} className="text-emerald-400" />, },
    ],
  },
];
